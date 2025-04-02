"use client";

import { ReactNode, useEffect, useState } from "react";
import Image from "next/image";

const LoadingScreen = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timeout);
  }, []);

  return isLoading ? (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <Image
          width={400}
          height={400}
          src="/images/binhdinhtour3.png"
          priority
          alt="logo"
          className="h-20 w-auto object-cover sm:h-28 md:h-32"
        />
      </div>
    </>
  ) : (
    children
  );
};

export default LoadingScreen;
