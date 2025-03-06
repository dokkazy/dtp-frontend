import { links } from "@/configs/routes";
import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
    <div className="flex flex-col gap-4 p-6 md:p-10">
      <Link
        href={links.home.href}
        className="flex items-center gap-2 font-medium"
      >
        <Image
          width={400}
          height={400}
          src="/images/binhdinhtour3.png"
          alt="logo"
          className="h-10 w-auto object-cover"
        />
      </Link>
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-xs">
          {children}
        </div>
      </div>
    </div>
    <div className="relative hidden bg-muted lg:block">
      <Image
        src="/images/quynhonbanner.jpg"
        alt="Image"
        className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        width={1000}
        height={1000}
      />
    </div>
  </div>
  );
}