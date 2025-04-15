import envConfig from "@/configs/envConfig";
import { links } from "@/configs/routes";
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/*",
        "/api/rotbot",
        "/api/rotbot/*",
        links.paymentCancel.href,
        links.paymentSuccess.href,
        links.profile.href,

      ],
    },
    sitemap: `${envConfig.NEXT_PUBLIC_BASE_URL}/sitemap.xml`,
  };
}
