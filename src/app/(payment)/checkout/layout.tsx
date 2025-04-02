import Image from "next/image";
import Link from "next/link";

import { links } from "@/configs/routes";
export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="border-b-2 border">
        <header className="mx-auto max-w-6xl py-4">
          <Link className="min-w-fit" href={links.home.href}>
            <Image
              width={400}
              height={400}
              src="/images/binhdinhtour3.png"
              alt="logo"
              priority
              className="h-10 w-auto object-cover"
            />
          </Link>
        </header>
      </div>
      {children}
      <footer className="relative mx-auto max-w-6xl py-8">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
          <Image
            width={400}
            height={400}
            src="/images/binhdinhtour3.png"
            alt="logo"
            priority
            className="h-10 w-auto object-cover"
          />
        </div>
        <p className="text-xs text-[#101010]">
          © {new Date().getFullYear()} binhdinhtour. All rights reserved.
        </p>
      </footer>
    </>
  );
}
