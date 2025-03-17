import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function ExperienceSection() {
  const experiences = [
    {
      id: 1,
      category: "Hoạt động nên trải nghiệm",
      title: "13 Địa Điểm Du Lịch Tết Trong Nước Đón Xuân Ất Tỵ",
      description:
        "Nên đi du lịch Tết Nguyên Đán ở đâu? Theo chân Klook khám phá ngay những địa điểm du lịch Tết...",
      image: "https://picsum.photos/id/1018/600/400",
      provider: "Klook Vietnam",
    },
    {
      id: 2,
      category: "Đồ ăn & thức uống",
      title: "19 Đặc Sản Phú Yên Nổi Tiếng Thơm Ngon Ăn Là Ghiền",
      description:
        "Ăn gì ở Phú Yên? Đặc sản Phú Yên nào đặc sắc? Nên mua món ngon Phú Yên nào về làm quà? Cứ...",
      image: "https://picsum.photos/id/1018/600/400",
      provider: "Klook Vietnam",
    },
    {
      id: 3,
      category: "Lưu trú",
      title: "10 Khách Sạn Quy Nhơn Đẹp, Giá Tốt & Vị Trí Trung Tâm",
      description:
        "Nên chọn khách sạn Quy Nhơn nào làm địa điểm dừng chân sắp tới? Dưới đây là các khách sạn Quy...",
      image: "https://picsum.photos/id/1018/600/400",
      provider: "Klook Vietnam",
    },
    {
      id: 4,
      category: "Hoạt động nên trải nghiệm",
      title: "Kinh Nghiệm Đi Kỳ Co - Eo Gió Nổi Tiếng Quy Nhơn",
      description:
        "Đừng tự nhận là tín đồ du lịch biển đảo nếu bạn chưa từng đón ánh nắng vàng ấm áp trên bãi biể...",
      image: "https://picsum.photos/id/1018/600/400",
      provider: "Klook Vietnam",
    },
  ];

  return (
    <section className="mx-auto mb-16 flex max-w-2xl px-4 flex-col gap-6 sm:pb-6 md:max-w-4xl lg:max-w-6xl lg:px-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-gray-900">
          Kinh nghiệm du lịch Quy Nhơn
        </h2>
        {/* Show link only on mobile, hide on md and above */}
        <Link href="/blog" className="text-blue-500 hidden hover:underline md:block">
          Xem tất cả &gt;
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 px-4 md:px-0">
        {experiences.map((experience) => (
          <Card
            key={experience.id}
            className="overflow-hidden border shadow-sm"
          >
            <div className="flex h-full flex-col md:flex-row">
              <div className="relative h-48 w-full md:h-auto md:w-1/3">
                <div className="relative h-full w-full overflow-hidden">
                  <Image
                    src={experience.image}
                    alt={experience.title}
                    fill
                    className="transition-transform object-cover duration-300 hover:scale-105"
                  />
                </div>
              </div>

              <div className="flex-1 p-4">
                <Badge variant="outline" className="mb-2 bg-gray-100">
                  {experience.category}
                </Badge>

                <h3 className="mb-2 text-lg font-semibold">
                  {experience.title}
                </h3>

                <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                  {experience.description}
                </p>

                <div className="mt-auto flex items-center justify-between">
                  <div className="">
                    <svg
                      width="60"
                      height="41"
                      viewBox="0 0 100 41"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_65_89)">
                        <path
                          d="M4.77008 4.735C5.03008 3.501 6.26008 2.5 7.51308 2.5H14.3251L8.66008 29.323H1.84808C0.59408 29.323 -0.21192 28.323 0.04908 27.088L4.77008 4.735ZM27.4771 4.735C27.7381 3.501 28.9671 2.5 30.2201 2.5H37.0321L31.3671 29.323H24.5551C23.3011 29.323 22.4951 28.323 22.7561 27.088L27.4771 4.735ZM72.8921 4.735C73.1521 3.501 74.3801 2.5 75.6351 2.5H82.4471L76.7821 29.323H69.9691C68.7151 29.323 67.9101 28.323 68.1711 27.088L72.8921 4.735ZM39.3031 2.5H46.1151C47.3691 2.5 48.1751 3.5 47.9141 4.735L43.1931 27.088C42.9331 28.323 41.7041 29.323 40.4501 29.323H33.6381L39.3031 2.5ZM84.7181 2.5H91.5301C92.7841 2.5 93.5901 3.5 93.3291 4.735L88.6071 27.088C88.3471 28.323 87.1191 29.323 85.8651 29.323H79.0521L84.7181 2.5ZM50.1851 4.735C50.4451 3.501 51.6731 2.5 52.9271 2.5H59.7401L54.0741 29.323H47.2621C46.0081 29.323 45.2021 28.323 45.4641 27.088L50.1841 4.735H50.1851ZM62.0101 2.5H68.8231C70.0771 2.5 70.8821 3.5 70.6211 4.735L63.5401 38.265C63.2781 39.499 62.0501 40.5 60.7961 40.5H53.9831L62.0101 2.5ZM12.8191 20.382H21.9021L20.4861 27.088C20.2251 28.323 18.9961 29.323 17.7431 29.323H10.9301L12.8181 20.383L12.8191 20.382ZM44.5201 31.559H53.6021L51.7141 40.5H44.9021C43.6471 40.5 42.8421 39.5 43.1031 38.265L44.5201 31.559ZM69.1741 33.638L68.0241 39.084C67.9741 39.318 67.8961 39.382 67.6581 39.382H67.1351C66.8971 39.382 66.8451 39.318 66.8951 39.084L68.0451 33.638C68.0951 33.405 68.1731 33.34 68.4111 33.34H68.9341C69.1721 33.34 69.2241 33.405 69.1741 33.638ZM70.6861 37.312H70.5791C70.4651 37.312 70.4251 37.344 70.4021 37.457L70.0581 39.084C70.0081 39.318 69.9291 39.382 69.6921 39.382H69.1681C68.9311 39.382 68.8791 39.318 68.9281 39.084L70.0781 33.638C70.1281 33.405 70.2081 33.34 70.4451 33.34H71.5251C72.7691 33.34 73.2401 33.783 73.0101 34.87L72.8181 35.781C72.5881 36.869 71.9301 37.312 70.6861 37.312ZM71.0021 34.613L70.7021 36.039C70.6771 36.152 70.7031 36.184 70.8181 36.184H70.9901C71.3901 36.184 71.6051 36.023 71.6921 35.612L71.8121 35.04C71.8991 34.63 71.7531 34.468 71.3521 34.468H71.1801C71.0661 34.468 71.0261 34.5 71.0021 34.613ZM74.7401 35.491L75.5901 36.426C76.0361 36.909 76.0981 37.199 75.9841 37.739L75.9541 37.884C75.7391 38.899 75.2271 39.463 74.0401 39.463C72.8541 39.463 72.5611 38.988 72.8351 37.69L72.8691 37.53C72.9191 37.296 72.9981 37.231 73.2351 37.231H73.7911C74.0291 37.231 74.0811 37.296 74.0311 37.529L73.9561 37.884C73.8881 38.206 73.9921 38.335 74.2781 38.335C74.5651 38.335 74.7211 38.215 74.7831 37.925L74.8151 37.771C74.8631 37.545 74.8371 37.433 74.5911 37.167L73.7911 36.305C73.3431 35.83 73.2861 35.555 73.4001 35.015L73.4371 34.839C73.6521 33.824 74.1641 33.259 75.3501 33.259C76.5371 33.259 76.8301 33.735 76.5561 35.032L76.5221 35.193C76.4721 35.427 76.3931 35.491 76.1561 35.491H75.5991C75.3621 35.491 75.3101 35.427 75.3591 35.193L75.4341 34.839C75.5021 34.516 75.3991 34.388 75.1121 34.388C74.8261 34.388 74.6691 34.508 74.6081 34.798L74.5791 34.935C74.5291 35.169 74.5551 35.282 74.7401 35.491ZM79.5321 33.638C79.5821 33.405 79.6601 33.34 79.8981 33.34H80.4211C80.6591 33.34 80.7111 33.405 80.6611 33.638L79.8051 37.691C79.5311 38.988 79.0381 39.463 77.8511 39.463C76.6651 39.463 76.3721 38.988 76.6461 37.69L77.5021 33.638C77.5521 33.405 77.6311 33.34 77.8681 33.34H78.3921C78.6291 33.34 78.6811 33.405 78.6321 33.638L77.7351 37.884C77.6671 38.206 77.7791 38.335 78.0901 38.335C78.3921 38.335 78.5671 38.206 78.6351 37.884L79.5321 33.638ZM82.9381 36.917C82.9411 36.982 82.9621 36.997 83.0031 36.997C83.0431 36.997 83.0721 36.982 83.1021 36.917L84.5161 33.55C84.5851 33.38 84.6671 33.34 84.8721 33.34H85.6661C85.9031 33.34 85.9551 33.405 85.9061 33.638L84.7561 39.084C84.7061 39.318 84.6261 39.382 84.3891 39.382H84.0131C83.7761 39.382 83.7231 39.318 83.7731 39.084L84.3251 36.474C84.3401 36.402 84.3271 36.385 84.2781 36.385C84.2451 36.385 84.2081 36.402 84.1881 36.458L83.0461 39.117C82.9641 39.31 82.8591 39.382 82.6221 39.382H82.4001C82.1541 39.382 82.0801 39.31 82.0801 39.117L82.0521 36.457C82.0471 36.401 82.0341 36.385 81.9931 36.385C81.9441 36.385 81.9241 36.402 81.9091 36.474L81.3581 39.084C81.3081 39.318 81.2301 39.382 80.9921 39.382H80.6161C80.3781 39.382 80.3261 39.318 80.3761 39.084L81.5261 33.638C81.5761 33.405 81.6551 33.34 81.8921 33.34H82.5721C82.8581 33.34 82.9501 33.405 82.9481 33.687L82.9371 36.917H82.9381ZM100 2.5C100 3.605 99.1101 4.5 98.0131 4.5C97.7513 4.49921 97.4922 4.44685 97.2506 4.3459C97.009 4.24496 96.7897 4.0974 96.6052 3.91167C96.4207 3.72594 96.2746 3.50567 96.1752 3.26345C96.0758 3.02123 96.0252 2.76181 96.0261 2.5C96.0261 1.395 96.9161 0.5 98.0131 0.5C99.1101 0.5 100 1.395 100 2.5Z"
                          fill="#101010"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_65_89">
                          <rect
                            width="100"
                            height="40"
                            fill="white"
                            transform="translate(0 0.5)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                    
                  </div>

                  <a
                    href="#"
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    Xem thêm
                  </a>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Full-width button shown only on md screens and above */}
      <div className="block w-full md:hidden">
        <Button
          asChild
          variant="outline"
          className="w-full rounded-md border border-gray-300 bg-white py-3 text-gray-700 hover:bg-gray-50"
        >
          <Link href="/blog">Xem tất cả</Link>
        </Button>
      </div>
    </section>
  );
}
