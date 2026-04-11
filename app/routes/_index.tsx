import type { Route } from "./+types/_index";
import { getOptionalUserFromContext } from "~/domain/utils/global-context.server";

export function meta() {
  return [
    { title: "Tabledeck — Play Board Games Online with Friends" },
    { name: "description", content: "Free online tabletop games — play Skull King, King's Cribbage, and more with friends from anywhere. No download required." },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "Tabledeck" },
    { property: "og:title", content: "Tabledeck — Play Board Games Online with Friends" },
    { property: "og:description", content: "Free online tabletop games — play Skull King, King's Cribbage, and more with friends from anywhere. No download required." },
    { property: "og:url", content: "https://tabledeck.us" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: "Tabledeck — Play Board Games Online with Friends" },
    { name: "twitter:description", content: "Free online tabletop games — play Skull King, King's Cribbage, and more with friends." },
  ];
}

export const links: Route.LinksFunction = () => [
  { rel: "canonical", href: "https://tabledeck.us" },
];

export async function loader({ context }: Route.LoaderArgs) {
  const user = getOptionalUserFromContext(context);
  return { user: user ? { name: user.name, email: user.email } : null };
}

const GAMES = [
  {
    emoji: "💀",
    title: "Skull King",
    description: "Real-time trick-taking for 2–8 players",
    href: "https://skull.tabledeck.us",
    live: true,
  },
  {
    emoji: "♠️",
    title: "Kings Cribbage",
    description: "Classic cribbage, play online with friends",
    href: "https://kingscrib.tabledeck.us",
    live: true,
  },
] as const;

export default function Index({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="absolute top-4 right-4 flex gap-3">
        {user ? (
          <>
            <a href="/profile" className="text-gray-300 hover:text-white text-sm">
              {user.name || user.email}
            </a>
            <a href="/logout" className="text-gray-500 hover:text-gray-300 text-sm">
              Logout
            </a>
          </>
        ) : (
          <>
            <a href="/login" className="text-gray-300 hover:text-white text-sm">
              Login
            </a>
            <a
              href="/signup"
              className="text-amber-400 hover:text-amber-300 text-sm font-medium"
            >
              Sign Up
            </a>
          </>
        )}
      </div>

      {/* Hero */}
      <div className="text-center mb-12">
        <div className="text-6xl mb-3">🃏</div>
        <h1 className="text-5xl font-bold text-white mb-3">Tabledeck</h1>
        <p className="text-gray-400 text-lg max-w-md">
          Your tabletop game hub — play with friends anywhere, on any device.
        </p>
      </div>

      {/* Game cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl">
        {GAMES.map((game) => (
          <a
            key={game.title}
            href={game.live ? game.href : undefined}
            className={`bg-gray-900 rounded-2xl p-6 border border-gray-800 transition-colors ${
              game.live
                ? "hover:border-amber-600 cursor-pointer"
                : "opacity-60 cursor-default"
            }`}
          >
            <div className="text-4xl mb-3">{game.emoji}</div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-white font-semibold text-lg">{game.title}</h2>
              {game.live ? (
                <span className="text-xs bg-green-900 text-green-300 px-2 py-0.5 rounded-full">
                  Live
                </span>
              ) : (
                <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">
                  Coming Soon
                </span>
              )}
            </div>
            <p className="text-gray-400 text-sm">{game.description}</p>
            {game.live && (
              <p className="text-amber-500 text-sm mt-3 font-medium">Play →</p>
            )}
          </a>
        ))}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Tabledeck",
            url: "https://tabledeck.us",
            description: "Free online tabletop games — play Skull King, King's Cribbage, and more with friends from anywhere.",
          }),
        }}
      />
    </div>
  );
}
