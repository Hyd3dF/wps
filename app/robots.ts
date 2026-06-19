import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/explore", "/topics/", "/u/"],
      disallow: [
        "/api/",
        "/settings",
        "/notifications",
        "/saved",
        "/rooms/",
        "/login",
        "/register",
        "/new-topic",
        "/new-room",
      ],
    },
    sitemap: "https://oroya.xyz/sitemap.xml",
    host: "https://oroya.xyz",
  };
}
