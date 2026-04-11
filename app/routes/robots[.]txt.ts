export function loader() {
  return new Response(
    [
      "User-agent: *",
      "Allow: /",
      "Disallow: /api/",
      "",
      "Sitemap: https://tabledeck.us/sitemap.xml",
    ].join("\n"),
    { headers: { "Content-Type": "text/plain" } }
  );
}
