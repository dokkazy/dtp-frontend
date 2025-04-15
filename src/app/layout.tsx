/* eslint-disable @next/next/no-sync-scripts */
import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import { cookies } from "next/headers";
import { GoogleAnalytics } from "@next/third-parties/google";

import "./globals.css";
import LoadingBar from "@/components/common/loading/LoadingBar";
import PageLoader from "@/providers/LoaderProvider";
import { Toaster } from "@/components/ui/sonner";
import LoadingScreen from "@/components/common/loading/LoadingScreen";
import AuthProvider from "@/providers/AuthProvider";
import { CartProvider } from "@/providers/CartProvider";
import userApiRequest from "@/apiRequests/user";
import { UserProfile } from "@/types/user";
import { isProduction } from "@/lib/utils";
import TrackingToken from "@/components/common/TrackingToken";
import UserInitializer from "@/components/common/UserInitializer";
import envConfig from "@/configs/envConfig";
import { NavigationEvents } from "@/components/common/loading/NaviagationEvents";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["vietnamese"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Binh Dinh Tour",
    default: "Binh Dinh Tour",
  },
  description: "Powered by BinhDinhTour",
  referrer: "origin-when-cross-origin",
  creator: "Dokkazy",
  metadataBase: new URL(envConfig.NEXT_PUBLIC_BASE_URL),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("_auth");
  const refreshToken = cookieStore.get("cont_auth");
  let user: UserProfile | null = null;

  if (sessionToken) {
    try {
      const res = await userApiRequest.me(sessionToken.value);
      if (res.status === 200) {
        user = res.payload.data;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  return (
    <html lang="en">
      <head>
        {!isProduction() && (
          <script
            crossOrigin="anonymous"
            src="https://unpkg.com/react-scan/dist/auto.global.js"
          />
        )}
      </head>
      <body className={`${ibmPlexSans.className} antialiased`}>
        <AuthProvider
          initialSessionToken={sessionToken?.value}
          initialRefreshToken={refreshToken?.value}
          user={user}
        >
          <TrackingToken />
          <UserInitializer />
          <CartProvider>
            <LoadingScreen>
              <LoadingBar />
              <PageLoader />
              {children}
              <Toaster closeButton richColors position="top-right" />
              <NavigationEvents />
            </LoadingScreen>
          </CartProvider>
        </AuthProvider>
      </body>
      <GoogleAnalytics gaId="G-XYZ" />
    </html>
  );
}
