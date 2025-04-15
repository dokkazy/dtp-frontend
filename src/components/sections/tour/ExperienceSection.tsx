import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import blogData from "@/app//(routes)/blog/blog-data.json";
export default function ExperienceSection() {
  return (
    <section className="mx-auto mb-16 flex max-w-2xl flex-col gap-6 px-4 sm:pb-6 md:max-w-4xl lg:max-w-6xl lg:px-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Kinh nghiệm du lịch Quy Nhơn
        </h2>
        {/* Show link only on mobile, hide on md and above */}
        <Link
          href="/blog"
          className="hidden text-blue-500 hover:underline md:block"
        >
          Xem tất cả &gt;
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 px-4 md:grid-cols-2 md:px-0">
        {blogData.map((blog, index) => {
          if (index > 3) return null; // Limit to first 4 items
          return (
            <Card key={index} className="overflow-hidden border shadow-sm">
              <div className="flex h-full flex-col md:flex-row">
                <div className="relative h-48 w-full md:h-auto md:w-1/3">
                  <div className="relative h-full w-full overflow-hidden">
                    <Image
                      src={
                        "https://picsum.photos/id/1018/600/400" 
                        // ||
                        // JSON.parse(blog.img)[0]
                      }
                      alt={blog.title}
                      fill
                      className="size-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between p-4">
                  <h3
                    title={blog.title}
                    className="mb-2 line-clamp-2 text-lg font-semibold"
                  >
                    {blog.title}
                  </h3>

                  <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                    {blog.description}
                  </p>

                  <div className="mt-auto flex items-center justify-between">
                    <div className="">
                      <Image
                        width={200}
                        height={200}
                        src="/images/binhdinhtour3.png"
                        alt="logo"
                        className="h-6 w-auto object-cover"
                      />
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
          );
        })}
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
