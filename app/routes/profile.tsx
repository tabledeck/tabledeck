import { redirect } from "react-router";
import type { Route } from "./+types/profile";
import { getOptionalUserFromContext } from "~/domain/utils/global-context.server";

export function meta() {
  return [{ title: "Profile — Tabledeck" }];
}

export async function loader({ context }: Route.LoaderArgs) {
  const user = getOptionalUserFromContext(context);
  if (!user) throw redirect("/login");
  return { user: { name: user.name, email: user.email } };
}

export default function Profile({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;

  return (
    <div className="min-h-screen bg-gray-950 p-4">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6 pt-4">
          <a href="/" className="text-gray-400 hover:text-white text-sm">
            ← Home
          </a>
          <a href="/logout" className="text-gray-500 hover:text-gray-300 text-sm">
            Logout
          </a>
        </div>

        <div className="text-center mb-10">
          <div className="text-5xl mb-3">🃏</div>
          <h1 className="text-2xl font-bold text-white">
            {user.name || user.email}
          </h1>
          <p className="text-gray-400 text-sm">{user.email}</p>
        </div>

        <h2 className="text-white font-semibold mb-4">Your Games</h2>
        <div className="space-y-3">
          <a
            href="https://skull.tabledeck.us"
            className="flex items-center gap-4 bg-gray-900 rounded-xl p-4 border border-gray-800 hover:border-gray-600 transition-colors"
          >
            <span className="text-3xl">💀</span>
            <div>
              <p className="text-white font-medium">Skull King</p>
              <p className="text-gray-400 text-sm">Real-time trick-taking for 2–8 players</p>
            </div>
            <span className="ml-auto text-gray-500 text-sm">Play →</span>
          </a>
          <a
            href="https://kingscrib.tabledeck.us"
            className="flex items-center gap-4 bg-gray-900 rounded-xl p-4 border border-gray-800 hover:border-gray-600 transition-colors"
          >
            <span className="text-3xl">♠️</span>
            <div>
              <p className="text-white font-medium">Kings Cribbage</p>
              <p className="text-gray-400 text-sm">Classic cribbage, online</p>
            </div>
            <span className="ml-auto text-gray-500 text-sm">Play →</span>
          </a>
        </div>
      </div>
    </div>
  );
}
