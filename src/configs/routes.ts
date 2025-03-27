
export const links = {
    login: { href: "/login", label: "Đăng nhập" },
    register: { href: "/register", label: "Đăng ký" },
    home: { href: "/", label: "Trang chủ" },
    tour: { href: "/tour", label: "Tour Quy Nhơn" },
    allTour: { href: "/tour/all", label: "Tất cả tour" },
    blog: { href: "/blog", label: "Cẩm nang du lịch" },
    about: { href: "/about", label: "Về chúng tôi" },
    passenger: { href: "/passenger", label: "Khách hàng" },
    shoppingCart: { href: "/shoppingcart", label: "Giỏ hàng" },
    checkout: { href: "/checkout", label: "Thanh toán" },
    paymentCancel: { href: "/payment/cancel", label: "Hủy thanh toán" },
    paymentSuccess: { href: "/payment/success", label: "Thanh toán thành công" },
}

export const nextServer = {
    setToken: "/api/auth/set-token",
    logout: "/api/auth/logout",
    refreshToken: "/api/auth/refresh-token",
}

export const apiEndpoint = {
    //authentication
    login: "/api/authentication/login",
    register: "/api/authentication/register",
    logout: "api/authentication/logout",
    refresh: "/api/authentication/refresh",
    //user
    profile: "/api/user/me",

    //tour
    tours: "/api/tour",
    odataTours: "/odata/tour",
    getTourCount: "/odata/tour/$count",
    odataTour: "/odata/tour",
    tourScheduleTicket: "/api/tour/scheduleticket",
    tourSchedule: "/api/tour/schedule",
    basket: "/api/basket",

    //order
    order: "/api/order",
    payment: "/api/payment",

}




