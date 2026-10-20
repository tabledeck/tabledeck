import { GAMES, type GameKey } from "./game-catalog";
import {
  GAME_PAGES,
  gameHowToPath,
  gameHowToUrl,
  gameLandingPath,
  gameLandingUrl,
  gamePlayUrl,
  getGamePage,
} from "./game-pages";
import { absoluteUrl, PUBLIC_HOSTS, SITE_ORIGIN } from "./site";

const OG_WIDTH = "1200";
const OG_HEIGHT = "630";

export interface PageSeo {
  title: string;
  description: string;
  canonical: string;
  image: string;
  imageAlt: string;
  robots?: string;
}

type MetaTag =
  | { title: string }
  | { name: string; content: string }
  | { property: string; content: string }
  | { tagName: "link"; rel: string; href: string };

export function pageMeta(page: PageSeo): MetaTag[] {
  const robots = page.robots ?? "index,follow,max-image-preview:large";
  return [
    { title: page.title },
    { name: "description", content: page.description },
    { name: "robots", content: robots },
    { tagName: "link", rel: "canonical", href: page.canonical },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "Tabledeck" },
    { property: "og:title", content: page.title },
    { property: "og:description", content: page.description },
    { property: "og:url", content: page.canonical },
    { property: "og:image", content: page.image },
    { property: "og:image:alt", content: page.imageAlt },
    { property: "og:image:width", content: OG_WIDTH },
    { property: "og:image:height", content: OG_HEIGHT },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: page.title },
    { name: "twitter:description", content: page.description },
    { name: "twitter:image", content: page.image },
    { name: "twitter:image:alt", content: page.imageAlt },
  ];
}

export function homeSeo(): PageSeo {
  return {
    title: "Tabledeck — Play Board Games Online with Friends",
    description:
      "Play Skull King, King's Cribbage, Battleship, The Game of Things, and a shared scoreboard online with friends. Free in the browser. No download.",
    canonical: absoluteUrl("/"),
    image: absoluteUrl("/og/tabledeck.png"),
    imageAlt: "Tabledeck — play board games online with friends",
  };
}

export function gamesIndexSeo(): PageSeo {
  return {
    title: "Online Board Games to Play with Friends | Tabledeck",
    description:
      "Five free Tabledeck games: Skull King, King's Cribbage, Battleship, The Game of Things, and a live scoreboard. Rules, how to play, and a link to open a table.",
    canonical: absoluteUrl("/games"),
    image: absoluteUrl("/og/tabledeck.png"),
    imageAlt: "Tabledeck games you can play online with friends",
  };
}

export function gameLandingSeo(gameKey: GameKey): PageSeo {
  const page = getGamePage(gameKey);
  return {
    title: page.landingTitle,
    description: page.landingDescription,
    canonical: gameLandingUrl(gameKey),
    image: absoluteUrl(page.ogImagePath),
    imageAlt: page.landingH1,
  };
}

export function gameHowToSeo(gameKey: GameKey): PageSeo {
  const page = getGamePage(gameKey);
  return {
    title: page.howToTitle,
    description: page.howToDescription,
    canonical: gameHowToUrl(gameKey),
    image: absoluteUrl(page.ogImagePath),
    imageAlt: page.howToH1,
  };
}

export function privatePageMeta(title: string): MetaTag[] {
  return [
    { title },
    { name: "robots", content: "noindex,nofollow" },
  ];
}

interface SitemapEntry {
  loc: string;
  changefreq: "weekly" | "monthly";
  priority: string;
}

export function sitemapEntries(): SitemapEntry[] {
  const hub: SitemapEntry[] = [
    { loc: absoluteUrl("/"), changefreq: "weekly", priority: "1.0" },
    { loc: absoluteUrl("/games"), changefreq: "weekly", priority: "0.9" },
  ];

  for (const game of GAMES) {
    hub.push({
      loc: gameLandingUrl(game.id),
      changefreq: "weekly",
      priority: "0.8",
    });
    hub.push({
      loc: gameHowToUrl(game.id),
      changefreq: "monthly",
      priority: "0.7",
    });
  }

  const subdomains: SitemapEntry[] = PUBLIC_HOSTS.filter(
    (host) => host.host !== "tabledeck.us" && host.host !== "www.tabledeck.us",
  ).map((host) => ({
    loc: host.url,
    changefreq: "weekly" as const,
    priority: "0.8",
  }));

  return [...hub, ...subdomains];
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function sitemapXml(): string {
  const urls = sitemapEntries()
    .map(
      (entry) => `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

export function robotsTxt(): string {
  return [
    "# Tabledeck hub. Game tables are separate hosts under tabledeck.us.",
    "# Submit https://tabledeck.us/sitemap.xml in Search Console for each verified host.",
    "User-agent: *",
    "Allow: /",
    "Disallow: /api/",
    "Disallow: /login",
    "Disallow: /signup",
    "Disallow: /logout",
    "Disallow: /profile",
    "",
    "Sitemap: https://tabledeck.us/sitemap.xml",
    "",
  ].join("\n");
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Tabledeck",
    url: absoluteUrl("/"),
    description: homeSeo().description,
    publisher: organizationJsonLd(),
  };
}

export function organizationJsonLd() {
  return {
    "@type": "Organization",
    name: "Tabledeck",
    url: absoluteUrl("/"),
    logo: absoluteUrl("/og/tabledeck.png"),
  };
}

export function gamesItemListJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Tabledeck games",
    itemListElement: GAMES.map((game, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: game.title,
      url: gameLandingUrl(game.id),
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function gameApplicationJsonLd(gameKey: GameKey) {
  const game = GAMES.find((entry) => entry.id === gameKey)!;
  const page = GAME_PAGES[gameKey];
  const node: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: game.title,
    url: gamePlayUrl(gameKey),
    description: page.landingDescription,
    applicationCategory: "GameApplication",
    operatingSystem: "Web",
    browserRequirements: "Requires a modern web browser.",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    publisher: {
      "@type": "Organization",
      name: "Tabledeck",
      url: SITE_ORIGIN,
    },
  };

  if (page.playerCount) {
    node.numberOfPlayers = {
      "@type": "QuantitativeValue",
      minValue: page.playerCount.minValue,
      maxValue: page.playerCount.maxValue,
    };
  }

  return node;
}

export function howToJsonLd(gameKey: GameKey) {
  const page = getGamePage(gameKey);
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: page.howToH1,
    description: page.howToDescription,
    url: gameHowToUrl(gameKey),
    step: page.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
      url: `${gameHowToUrl(gameKey)}#step-${index + 1}`,
    })),
  };
}

export function gameBreadcrumb(gameKey: GameKey, leaf: "landing" | "howto") {
  const page = getGamePage(gameKey);
  const items = [
    { name: "Tabledeck", url: absoluteUrl("/") },
    { name: "Games", url: absoluteUrl("/games") },
    { name: page.landingH1, url: gameLandingUrl(gameKey) },
  ];
  if (leaf === "howto") {
    items.push({ name: page.howToH1, url: gameHowToUrl(gameKey) });
  }
  return breadcrumbJsonLd(items);
}

export const HUB_GUIDE_PATHS = [
  "/",
  "/games",
  ...GAMES.flatMap((game) => [gameLandingPath(game.id), gameHowToPath(game.id)]),
];
