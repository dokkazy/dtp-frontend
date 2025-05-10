import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function NoteSection() {
  return (
    <section className="mx-auto mb-16 flex max-w-2xl px-4 flex-col gap-6 sm:pb-6 md:max-w-4xl lg:max-w-6xl lg:px-8">
      <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-gray-900">
        Du lịch Bình Định cần biết những gì ?
      </h1>
      <Card className="w-full">
        <CardContent className="p-6 md:px-12 md:py-8">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-base md:text-lg">
                Bình Định có gì chơi ?
              </AccordionTrigger>
              <AccordionContent>
                "Đặc sản" của Bình Định là làn gió biển tươi mát cùng những bãi
                biển trong xanh. Du lịch Bình Định không thể bỏ qua Kỳ Co, Eo
                Gió, khu du lịch sinh thái Hầm Hô, Bãi Xếp, Tuyệt Tình Cốc, Hòn
                Khô.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-base md:text-lg">
                Đi Bình Định mùa nào đẹp ?
              </AccordionTrigger>
              <AccordionContent>
                Bình Định có 2 mùa rõ rệt là mùa mưa và mùa khô. Thời điểm thích
                hợp nhất để du lịch Bình Định là từ Tháng 3 đến Tháng 9. Bạn nên
                tránh tham quan Bình Định vào mùa mưa bão, thường kéo dài từ
                tháng 10 đến tháng 2 năm kế tiếp.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-base md:text-lg">
                Đi Bình Định nên ăn gì ?
              </AccordionTrigger>
              <AccordionContent>
                Bình Định có rất nhiều món ngon đặc sản đang chờ bạn
                thưởng thức. Món ngon Bình ĐỊnh gồm có bánh xèo tôm nhảy, bún cá,
                bánh hỏi cháo lòng, bún sứa, bánh ít lá gai...
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-base md:text-lg">
                Tại sao gọi Bình Định là xứ Nẫu ?
              </AccordionTrigger>
              <AccordionContent>
                "Nậu" ban đầu ý chỉ tổ chức quản lý một nhóm nhỏ cùng làm một
                nghề, khái niệm này được biến nghĩa dùng để gọi người đứng đầu
                trong đám người nào đó và sau này dùng để gọi đại từ nhân xưng
                ngôi thứ ba. Sau này, phương ngữ Phú Yên-Bình Định tỉnh lược đại
                từ danh xưng ngôi thứ ba (cả số ít và số nhiều) bằng cách thay
                từ gốc thanh hỏi. Và thế là “Nậu” được thay bằng “Nẩu” hoặc
                "Nẫu".
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </section>
  );
}
