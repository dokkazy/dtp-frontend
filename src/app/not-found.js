"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function NotFound() {
    const router = useRouter();
    const [count, setCount] = useState(5);

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push("/");
        }, 5000);

        // Create countdown effect
        const interval = setInterval(() => {
            if (count == 0) {
                return;
            }
            setCount((prev) => prev - 1);
        }, 1000);

        // Cleanup on unmount
        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [router, count]);

    if (count === 0) {
        return (
            <div className="flex min-h-screen flex-col gap-8 items-center justify-center">
                <h1 className="font-bold text-3xl">Đang chuyển hướng về trang chủ</h1>
                <motion.div
                    className="ml-2 flex"
                    variants={{
                        initial: { transition: { staggerChildren: 0 } },
                        animate: { transition: { staggerChildren: 0.2 } },
                    }}
                    initial="initial"
                    animate="animate"
                >
                    {[0, 1, 2].map((dot) => (
                        <motion.span
                            key={dot}
                            variants={{
                                initial: { opacity: 0.3, y: 0 },
                                animate: { opacity: 1, y: [-2, -8, -2] }
                            }}
                            transition={{
                                duration: 0.8,
                                ease: "easeInOut",
                                repeat: Infinity,
                                delay: dot * 0.1  // Stagger the animation
                            }}
                            className="mx-1 h-2 w-2 rounded-full bg-primary inline-block"
                        >
                            &nbsp;
                        </motion.span>
                    ))}
                </motion.div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
                <div className="text-9xl font-bold text-core">404</div>
                {count !== 0 ? (<h1 className="text-3xl font-bold">Không tìm thấy trang</h1>) : (<h1 className="text-3xl font-bold">Đang chuyển hướng</h1>)}
                <p className="max-w-md text-muted-foreground">
                    Trang bạn đang tìm kiếm có thể đã bị xóa hoặc không tồn tại.
                    Bạn sẽ được chuyển hướng về trang chủ sau {count} giây.
                </p>
                <div className="flex gap-4">
                    <Link href="/">
                        <Button variant="core" className="rounded-full px-6">
                            Về trang chủ ngay
                        </Button>
                    </Link>
                    <Button
                        variant="outline"
                        className="rounded-full px-6"
                        onClick={() => router.back()}
                    >
                        Quay lại
                    </Button>
                </div>
            </div>
        </div>
    );
}