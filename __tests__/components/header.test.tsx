import Header from "@/components/common/Header";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { CartProvider } from "@/providers/CartProvider";
import AuthProvider from "@/providers/AuthProvider";

jest.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("@/lib/http", () => ({
  sessionToken: { value: "1" },
  refreshToken: { value: "1" },
}));

describe("Header", () => {
  it("renders correctly", () => {
    render(
      <AuthProvider initialRefreshToken="1" initialSessionToken="1" user={null}>
        <CartProvider>
          <Header />
        </CartProvider>
      </AuthProvider>,
    );

    // Test for something that definitely exists in the header, like the logo
    const avatarFallbacks = screen.getAllByText("CN");
    expect(avatarFallbacks.length).toBe(2); // One in desktop header, one in mobile header
  });
});
