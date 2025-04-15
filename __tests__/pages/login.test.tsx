import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoginForm } from "@/app/(auth)/login/login-form";
import authApiRequest from "@/apiRequests/auth";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { links } from "@/configs/routes";
import { sessionToken, refreshToken, HttpError } from "@/lib/http";

// Mock dependencies
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock("@/apiRequests/auth", () => ({
  loginFromNextClientToNextServer: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("@/lib/http", () => ({
  sessionToken: {
    value: "test-access-token",
  },
  refreshToken: {
    value: "test-refresh-token",
  },
  HttpError: jest.fn().mockImplementation(() => {
    return {
      status: 401,
      payload: { message: "Unauthorized", error: [] },
    };
  }),
}));

jest.mock("@/lib/utils", () => ({
  cn: jest.fn((a, b) => [a, b].filter(Boolean).join(" ")),
  handleErrorApi: jest.fn(),
  EntityError: jest.fn().mockImplementation(() => {
    return {
      status: 400,
      payload: { message: "Error", error: [] },
    };
  }),
}));

// Mock window.notifyAuthChange
global.window.notifyAuthChange = jest.fn();

describe("LoginForm", () => {
  const mockPush = jest.fn();
  const mockRefresh = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    });
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    });
  });

  it("renders the login form correctly", () => {
    render(<LoginForm />);

    expect(
      screen.getByRole("heading", { name: "Đăng nhập" }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/Username hoặc email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mật khẩu/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Đăng nhập/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Chưa có tài khoản/i)).toBeInTheDocument();
    expect(screen.getByText(/Đăng ký ngay/i)).toBeInTheDocument();
  });

  it("validates form fields on submission", async () => {
    render(<LoginForm />);

    const submitButton = screen.getByRole("button", { name: /Đăng nhập/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Username phải có ít nhất 6 kí tự/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Mật khẩu phải có ít nhất 8 kí tự/i),
      ).toBeInTheDocument();
    });
  });

  it("handles successful login", async () => {
    const mockResponse = {
      status: 200,
      payload: {
        success: true,
        message: "Success",
        data: {
          tokenType: "Bearer",
          accessToken: "test-access-token", 
          expiresIn: 7200,
          refreshToken: "test-refresh-token",
          role: "Tourist"
        }
      }
    };

    (
      authApiRequest.loginFromNextClientToNextServer as jest.Mock
    ).mockResolvedValue(mockResponse);

    render(<LoginForm />);

    // Fill form fields
    fireEvent.change(screen.getByLabelText(/Username hoặc email/i), {
      target: { value: "testuser" },
    });

    fireEvent.change(screen.getByLabelText(/Mật khẩu/i), {
      target: { value: "password123" },
    });

    // Submit form
    const submitButton = screen.getByRole("button", { name: /Đăng nhập/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      // Check if API was called with correct params
      expect(
        authApiRequest.loginFromNextClientToNextServer,
      ).toHaveBeenCalledWith({
        userName: "testuser",
        password: "password123",
      });

      // Check if tokens were set
      expect(sessionToken.value).toBe("test-access-token");
      expect(refreshToken.value).toBe("test-refresh-token");

      // Check if toast was shown
      expect(toast.success).toHaveBeenCalledWith("Đăng nhập thành công");

      // Check if routing happened
      expect(mockPush).toHaveBeenCalledWith(links.home.href);
      expect(mockRefresh).toHaveBeenCalled();

      // Check if auth change notification was triggered
      expect(window.notifyAuthChange).toHaveBeenCalled();
    });
  });

  it("handles login error from HTTP error", async () => {
    const payload = { message: "Invalid credentials", error: ["Invalid username, password or email"] };
    const httpError = new HttpError({ status: 400, payload });
    (
      authApiRequest.loginFromNextClientToNextServer as jest.Mock
    ).mockRejectedValue(httpError);

    render(<LoginForm />);

    // Fill form fields
    fireEvent.change(screen.getByLabelText(/Username hoặc email/i), {
      target: { value: "testuser" },
    });

    fireEvent.change(screen.getByLabelText(/Mật khẩu/i), {
      target: { value: "password123" },
    });

    // Submit form
    const submitButton = screen.getByRole("button", { name: /Đăng nhập/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      // Check that no redirection happened
      expect(mockPush).not.toHaveBeenCalled();
      expect(mockRefresh).not.toHaveBeenCalled();
    });
  });

  it("handles general error during login", async () => {
    const generalError = new HttpError({
      status: 500,
      payload: { message: "Server error", error: [] },
    });
    (
      authApiRequest.loginFromNextClientToNextServer as jest.Mock
    ).mockRejectedValue(generalError);

    render(<LoginForm />);

    // Fill form fields
    fireEvent.change(screen.getByLabelText(/Username hoặc email/i), {
      target: { value: "testuser" },
    });

    fireEvent.change(screen.getByLabelText(/Mật khẩu/i), {
      target: { value: "password123" },
    });

    // Submit form
    const submitButton = screen.getByRole("button", { name: /Đăng nhập/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Đã xảy ra lỗi, vui lòng thử lại sau.",
      );

      // Check that no redirection happened
      expect(mockPush).not.toHaveBeenCalled();
      expect(mockRefresh).not.toHaveBeenCalled();
    });
  });

  it("redirects to custom URL when provided in searchParams", async () => {
    const customRedirectUrl = "/";
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue(customRedirectUrl),
    });

    const mockResponse = {
      status: 200,
      payload: {
        data: {
          accessToken: "test-access-token",
          refreshToken: "test-refresh-token",
        },
      },
    };

    (
      authApiRequest.loginFromNextClientToNextServer as jest.Mock
    ).mockResolvedValue(mockResponse);

    render(<LoginForm />);

    // Fill form fields
    fireEvent.change(screen.getByLabelText(/Username hoặc email/i), {
      target: { value: "testuser" },
    });

    fireEvent.change(screen.getByLabelText(/Mật khẩu/i), {
      target: { value: "password123" },
    });

    // Submit form
    const submitButton = screen.getByRole("button", { name: /Đăng nhập/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      // Check if routing happened to custom URL
      expect(mockPush).toHaveBeenCalledWith(customRedirectUrl);
    });
  });
});
