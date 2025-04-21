/* eslint-disable @typescript-eslint/no-explicit-any */
import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { CartProvider } from "@/providers/CartProvider";
import AuthProvider from "@/providers/AuthProvider";
import OrderList from "@/app/(routes)/(manager)/my-bookings/OrderList";
import { OrderStatus } from "@/types/order";

// Mock the API request
jest.mock("@/apiRequests/order", () => ({
  orderApiRequest: {
    getOrders: jest.fn().mockResolvedValue({
      status: 200,
      payload: [
        {
          orderId: "123",
          tourName: "Tour Quy Nhơn - Kỳ Co",
          tourDate: "12-04-2025",
          orderTickets: [
            { code: "T1", ticketKind: "ADULT", quantity: 2, grossCode: 2000 },
            { code: "T2", ticketKind: "CHILD", quantity: 1, grossCode: 2000 },
          ],
          finalCost: 1500000,
          status: 2,
          tourThumbnail: "/images/ky-co.jpg",
        },
        {
          orderId: "456",
          tourName: "Tour Eo Gió",
          tourDate: "10-04-2025",
          orderTickets: [
            { code: "T3", ticketKind: "ADULT", quantity: 1, grossCode: 2000 },
          ],
          finalCost: 800000,
          status: 0,
          tourThumbnail: "/images/eo-gio.jpg",
        },
      ],
    }),
  },
}));

jest.mock("next/navigation", () => ({
  usePathname: () => "/my-orders",
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("@/lib/http", () => ({
  sessionToken: { value: "1" },
  refreshToken: { value: "1" },
  HttpError: class HttpError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "HttpError";
    }
  },
}));

// Mock the Image component from Next.js
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />;
  },
}));

describe("OrderList", () => {
  it("renders orders correctly", async () => {
    render(
      <AuthProvider initialRefreshToken="1" initialSessionToken="1" user={null}>
        <CartProvider>
          <OrderList />
        </CartProvider>
      </AuthProvider>,
    );

    // Should show loading state initially
    expect(screen.getByText("Đơn hàng")).toBeInTheDocument();

    // Wait for orders to load
    await waitFor(() => {
      expect(screen.getByText("Tour Quy Nhơn - Kỳ Co")).toBeInTheDocument();
    });

    // Check that order details are rendered
    expect(screen.getByText(/.*12.*2025/)).toBeInTheDocument();
    expect(screen.getByText(/Tổng thanh toán.*1.500.000/)).toBeInTheDocument();
    expect(screen.getByText("Tour Eo Gió")).toBeInTheDocument();

    // Check that payment button appears for SUBMITTED status
    const paymentButton = screen.getByText("Thanh toán");
    expect(paymentButton).toBeInTheDocument();
  });

  it("shows empty state when no orders", async () => {
    // Override the mock to return empty orders
    jest
      .requireMock("@/apiRequests/order")
      .orderApiRequest.getOrders.mockResolvedValueOnce({
        status: 200,
        payload: [],
      });

    render(
      <AuthProvider initialRefreshToken="1" initialSessionToken="1" user={null}>
        <CartProvider>
          <OrderList />
        </CartProvider>
      </AuthProvider>,
    );

    // Wait for empty state to appear
    await waitFor(() => {
      expect(screen.getByText("Không có đơn hàng nào.")).toBeInTheDocument();
    });
  });

  it("handles load more functionality", async () => {
    // Create mock data with more than 5 orders to test pagination
    const mockOrders = Array(7)
      .fill(0)
      .map((_, index) => ({
        orderId: `order${index}`,
        tourName: `Tour ${index}`,
        tourDate: "12-04-2025",
        orderTickets: [
          {
            code: `T${index}`,
            ticketKind: "ADULT",
            quantity: 1,
            grossCode: 2000,
          },
        ],
        finalCost: 1000000,
        status: OrderStatus.COMPLETED,
        tourThumbnail: "/images/ky-co.jpg",
      }));

    jest
      .requireMock("@/apiRequests/order")
      .orderApiRequest.getOrders.mockResolvedValueOnce({
        status: 200,
        payload: mockOrders,
      });

    render(
      <AuthProvider initialRefreshToken="1" initialSessionToken="1" user={null}>
        <CartProvider>
          <OrderList />
        </CartProvider>
      </AuthProvider>,
    );

    // Wait for orders to load (initially 5)
    await waitFor(() => {
      expect(screen.getByText("Tour 0")).toBeInTheDocument();
    });

    // Should show "Xem thêm" button
    const loadMoreButton = screen.getByText("Xem thêm");
    expect(loadMoreButton).toBeInTheDocument();

    // Click load more and check if more orders are displayed
    fireEvent.click(loadMoreButton);

    // Should now display all 7 orders
    await waitFor(() => {
      expect(screen.getByText("Tour 6")).toBeInTheDocument();
    });
  });
});
