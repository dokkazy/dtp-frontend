import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Banner from "@/components/common/Banner";
import Image from "next/image";
import Link from "next/link";
import blogData from "./blog-data.json";

export const dynamic = "force-static";

export default function Blog() {
  return (
    <main className="pb-16">
      <Banner title1="Cẩm nang du lịch" title2="Quy Nhơn" />
      <div className="container mx-auto mt-10 max-w-2xl md:max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-2xl font-bold lg:text-3xl">Bài viết mới nhất</h2>
          <p className="mt-2 text-gray-600">Khám phá những địa điểm và trải nghiệm du lịch thú vị tại Quy Nhơn</p>
        </div>
        
        {/* Featured Blog Post */}
        {blogData.length > 0 && (
          <div className="mb-16">
            <Card className="overflow-hidden">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="relative h-72 overflow-hidden sm:h-96 md:h-full">
                  <Image 
                    src={JSON.parse(blogData[0].img)[0]}
                    alt={blogData[0].title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="flex flex-col justify-between p-6">
                  {blogData[0].createdDate && (
                    <p className="mb-2 text-sm text-gray-500">
                      {blogData[0].createdDate}
                    </p>
                  )}
                  <CardHeader className="p-0">
                    <CardTitle className="text-xl font-bold md:text-2xl">
                      {blogData[0].title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 py-4">
                    <CardDescription className="text-base">
                      {blogData[0].description}
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="p-0">
                    <Link 
                      href={blogData[0].url} 
                      target="_blank"
                      className="text-core hover:underline"
                    >
                      Đọc thêm →
                    </Link>
                  </CardFooter>
                </div>
              </div>
            </Card>
          </div>
        )}
        
        {/* Blog Post Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {blogData.slice(1).map((post, index) => (
            <Card key={index} className="overflow-hidden h-full flex flex-col">
              <div className="relative h-48 overflow-hidden">
                <Image 
                  src={JSON.parse(post.img)[0]}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="flex flex-col flex-grow p-6">
                {post.createdDate && (
                  <p className="mb-2 text-sm text-gray-500">
                    {post.createdDate}
                  </p>
                )}
                <CardHeader className="p-0">
                  <CardTitle className="line-clamp-2 text-lg font-bold">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow p-0 py-4">
                  <CardDescription className="line-clamp-3">
                    {post.description}
                  </CardDescription>
                </CardContent>
                <CardFooter className="p-0 mt-auto">
                  <Link 
                    href={post.url} 
                    target="_blank"
                    className="text-core hover:underline"
                  >
                    Đọc thêm →
                  </Link>
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
