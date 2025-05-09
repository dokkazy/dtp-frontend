
export const links = {
  login: { href: "/login", label: "Đăng nhập" },
  logout: { href: "/logout", label: "Đăng xuất" },
  register: { href: "/register", label: "Đăng ký" },
  resetPassword: { href: "/reset-password", label: "Đặt lại mật khẩu" },
  forgotPassword: { href: "/forgot-password", label: "Quên mật khẩu" },
  accountConfirm: { href: "/account-confirm", label: "Xác thực tài khoản" },
  home: { href: "/", label: "Trang chủ" },
  tour: { href: "/tour", label: "Tour Quy Nhơn" },
  allTour: { href: "/tour/all", label: "Tất cả tour" },
  blog: { href: "/blog", label: "Cẩm nang du lịch" },
  about: { href: "/about", label: "Về chúng tôi" },

  profile: { href: "/profile", label: "Khách hàng" },
  bookings: { href: "/my-bookings", label: "Lịch sử đặt tour" },
  review: { href: "/my-review", label: "Đánh giá" },
  rating: { href: "/my-review/rating", label: "Đánh giá" },
  account: { href: "/my-account", label: "Cài đặt tài khoản" },
  privacy: { href: "/privacy", label: "Chính sách bảo mật" },
  wallet: { href: "/my-wallet", label: "Ví của tôi" },
  otpQrSetup: { href: "/my-wallet/otp-setup", label: "Thiết lập xác thực OTP" },

  shoppingCart: { href: "/shoppingcart", label: "Giỏ hàng" },
  checkout: { href: "/checkout", label: "Thanh toán" },
  paymentCancel: { href: "/payment/cancel", label: "Hủy thanh toán" },
  paymentSuccess: { href: "/payment/success", label: "Thanh toán thành công" },
};

export const nextServer = {
  setToken: "/api/auth/set-token",
  logout: "/api/auth/logout",
  refreshToken: "/api/auth/refresh-token",
  login: "/api/auth/login",
  confirmation: "/api/auth/confirmation",

  //tour
  getAllTours: "/api/tour/getAll",
  recommendTours: "/api/tour/recommend",
};

export const apiEndpoint = {
  //authentication
  login: "/api/authentication/login",
  register: "/api/authentication/register",
  logout: "api/authentication/logout",
  refresh: "/api/authentication/refresh",
  confirmation: "/api/authentication/confirmation",
  fotgotPassword: "/api/authentication/forget-password",
  resetPassword: "/api/authentication/reset-password",
  //user
  profile: "/api/user/me",
  updateProfile: "/api/user",
  changePassword: "/api/user/password",

  //tour
  tours: "/api/tour",
  odataTours: "/odata/tour",
  odataTour: "/odata/tour",
  tourScheduleTicket: "/api/tour/scheduleticket",
  tourSchedule: "/api/tour/schedule",
  basket: "/api/basket",
  rating: "api/tour/rating",
  feedback: "/api/tour/feedback",

  //order
  order: "/api/order",
  payment: "/api/payment",
  voucher: "/api/voucher",

  //wallet
  wallet: "/api/wallet",
  otp: "/api/wallet/otp",
  withdrawWithOtp: "/api/wallet/withdraw",
  deposit: "/api/wallet/deposit",

  //chatbot
  chat: "/api/Chat",
  reset: "/api/Chat/reset",
};
