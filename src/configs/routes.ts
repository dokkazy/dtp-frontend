
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
    checkout: { href: "payment/checkout", label: "Thanh toán" },

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
    getTourCount: "/odata/tour/$count",
    odataTour: "/odata/tour",
    tourScheduleTicket: "/api/tour/scheduleticket",
    tourSchedule: "/api/tour/schedule",
    basket: "/api/basket",
    order: "/api/order",

}




