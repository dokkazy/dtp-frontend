import {
  Building,
  Compass,
  Heart,
  MapPin,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";
import Image from "next/image";

import Banner from "@/components/common/Banner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Về chúng tôi",
  keywords: [
    "Về chúng tôi",
    "Thông tin về chúng tôi",
    "Giới thiệu",
    "Du lịch",
    "Tour du lịch",
  ],
}

export default function About() {
  return (
    <main className="pb-6 sm:pb-8 lg:pb-12">
      <Banner title2="Về chúng tôi" />

      <div className="flex min-h-screen flex-col">
        {/* Who We Are Section */}
        <section className="bg-background py-16 md:py-24">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <div className="grid items-center gap-12 md:grid-cols-2">
              <div>
                <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl">
                  Chúng tôi <span className="text-core">là ai ?</span>
                </h2>
                <p className="mb-6 text-lg text-muted-foreground">
                  Chúng tôi là một nền tảng web du lịch kết nối các công ty tour
                  du lịch với người dùng, giúp quảng bá và cung cấp thông tin về
                  các tour hấp dẫn.
                </p>
                <p className="mb-6 text-lg text-muted-foreground">
                  Mang đến trải nghiệm đặt tour dễ dàng và thuận tiện, tạo điều
                  kiện cho người dùng khám phá những hành trình thú vị và đa
                  dạng khắp nơi trên thế giới. Hãy cùng chúng tôi khám phá những
                  chuyến đi tuyệt vời!
                </p>
              </div>
              <div className="relative h-[400px] overflow-hidden rounded-xl">
                <Image
                  src="/images/quynhon.jpg"
                  alt="Our team exploring"
                  fill
                  className="object-cover"
                  quality={100}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission Section */}
        <section className="bg-muted py-16 md:py-24">
          <div className="container mx-auto max-w-6xl px-4 text-center md:px-6">
            <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl">
              <span className="text-core">Sứ mệnh</span> của chúng tôi
            </h2>
            <p className="mx-auto mb-16 max-w-3xl text-xl text-muted-foreground">
              Đem đến cho du khách với những trải nghiệm chân thực và hỗ trợ các
              công ty tour du lịch địa phương chia sẻ chuyên môn
            </p>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="border-none bg-background/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">
                    Hỗ trợ cộng đồng
                  </h3>
                  <p className="text-muted-foreground">
                    Phát triển nền kinh tế địa phương bằng cách thúc đẩy du lịch
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none bg-background/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Compass className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">
                    Trải nghiệm chất lượng
                  </h3>
                  <p className="text-muted-foreground">
                    Tạo ra những tour du lịch đặc biệt mang lại kỷ niệm đáng nhớ
                    và kết nối sâu sắc hơn.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none bg-background/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Building className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">
                    Operator Growth
                  </h3>
                  <p className="text-muted-foreground">
                    Empowering tour companies with tools and visibility to grow
                    their businesses.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
      </section>

        {/* What We Offer Section */}
        <section className="bg-background py-16 md:py-24">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tight md:text-4xl">
              Chúng tôi cung cấp những gì
            </h2>

            <Tabs defaultValue="travelers" className="mx-auto w-full max-w-4xl">
              <TabsList className="mb-8 grid w-full grid-cols-2">
                <TabsTrigger value="travelers">Cho du khách</TabsTrigger>
                <TabsTrigger value="companies">
                  Cho các bên cung cấp tour
                </TabsTrigger>
              </TabsList>

              <TabsContent value="travelers" className="space-y-8">
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="flex gap-4">
                    <MapPin className="mt-1 h-6 w-6 flex-shrink-0 text-primary" />
                    <div>
                      <h3 className="mb-2 text-xl font-semibold">
                        Trải nghiệm được chọn lọc
                      </h3>
                      <p className="text-muted-foreground">
                        Khám phá các chuyến du lịch từ các nhà cung cấp đáng tin
                        cậy phù hợp với sở thích, ngân sách và lịch trình của
                        bạn.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Heart className="mt-1 h-6 w-6 flex-shrink-0 text-primary" />
                    <div>
                      <h3 className="mb-2 text-xl font-semibold">
                        Gợi ý cá nhân hóa
                      </h3>
                      <p className="text-muted-foreground">
                        Nhận các gợi ý phù hợp dựa trên sở thích và trải nghiệm
                        du lịch trước đây của bạn.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Shield className="mt-1 h-6 w-6 flex-shrink-0 text-primary" />
                    <div>
                      <h3 className="mb-2 text-xl font-semibold">
                        Đặt tour an toàn
                      </h3>
                      <p className="text-muted-foreground">
                        Đặt tour an toàn thông qua nền tảng của chúng tôi với
                        giá cả và chính sách minh bạch.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Users className="mt-1 h-6 w-6 flex-shrink-0 text-primary" />
                    <div>
                      <h3 className="mb-2 text-xl font-semibold">
                        Cộng đồng du khách
                      </h3>
                      <p className="text-muted-foreground">
                        Kết nối với các du khách khác, chia sẻ trải nghiệm và
                        đọc các đánh giá chân thực.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-center">
                  <Button variant="core" size="lg" asChild>
                    <Link href="/tour">Xem tour</Link>
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="companies" className="space-y-8">
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="flex gap-4">
                    <TrendingUp className="mt-1 h-6 w-6 flex-shrink-0 text-primary" />
                    <div>
                      <h3 className="mb-2 text-xl font-semibold">
                        Phát triển doanh nghiệp
                      </h3>
                      <p className="text-muted-foreground">
                        Tăng số lượng đặt các chuyến du lịch và doanh thu với
                        các công cụ tiếp thị và phân tích mạnh mẽ.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Building className="mt-1 h-6 w-6 flex-shrink-0 text-primary" />
                    <div>
                      <h3 className="mb-2 text-xl font-semibold">
                        Công cụ quản lý
                      </h3>
                      <p className="text-muted-foreground">
                        Truy cập các công cụ quản lý đặt tour, lập lịch trình và
                        giao tiếp với khách hàng mạnh mẽ.
                      </p>
                    </div>
                  </div>
                </div>

                {/* <div className="mt-8 flex justify-center">
                  <Button size="lg" asChild>
                    <Link href="#partner">Become a Partner</Link>
                  </Button>
                </div> */}
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Team Section */}
        <section className="bg-muted py-16 md:py-24">
          <div className="container mx-auto max-w-6xl px-4 text-center md:px-6">
            <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl">
              Gặp gỡ đội ngũ của chúng tôi
            </h2>
            <p className="mx-auto mb-16 max-w-3xl text-xl text-muted-foreground">
              Một nhóm đam mê du lịch với sứ mệnh phát triển du lịch địa phương
            </p>

            <div className="md:grid-col-3 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
              {[
                {
                  name: "Phan Mai Sơn",
                  role: "Người sáng lập & CEO",
                  image: "/placeholder.svg?height=400&width=400",
                },
                {
                  name: "Lê Trung Kiên",
                  image: "/placeholder.svg?height=400&width=400",
                },
                {
                  name: "Trần Đăng Khoa",
                  image: "/placeholder.svg?height=400&width=400",
                },
                {
                  name: "Trương Đình Văn",
                  image: "/placeholder.svg?height=400&width=400",
                },
                {
                  name: "Võ Công Huy",
                  image: "/placeholder.svg?height=400&width=400",
                },
              ].map((member, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="relative mb-4 h-48 w-48 overflow-hidden rounded-full">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="mb-1 text-xl font-semibold">{member.name}</h3>
                  <p className="text-muted-foreground">{member?.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
