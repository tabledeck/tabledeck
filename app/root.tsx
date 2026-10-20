import {
  isRouteErrorResponse,
  Links,
  Meta,
  type MiddlewareFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "react-router";
import { useEffect, useState } from "react";
import { getToast } from "remix-toast";
import { toast as notify, ToastContainer } from "react-toastify";
import toastStyles from "react-toastify/ReactToastify.css?url";
import styles from "./app.css?url";
import type { Route } from "./+types/root";
import {
  globalStorageMiddleware,
  userContext,
} from "~/domain/utils/global-context.server";

export const middleware: MiddlewareFunction<Response>[] = [
  globalStorageMiddleware,
];

const FONT_STYLESHEET =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;700&family=Caveat:wght@500;600&display=swap";

export const meta: Route.MetaFunction = () => [];

export const links: Route.LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  { rel: "stylesheet", href: toastStyles },
];

function FontLinks() {
  const [fontsReady, setFontsReady] = useState(false);
  useEffect(() => {
    setFontsReady(true);
  }, []);
  return (
    <>
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <meta name="theme-color" content="#0f1d33" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preload" href={FONT_STYLESHEET} as="style" />
      <link rel="stylesheet" href={FONT_STYLESHEET} media={fontsReady ? "all" : "print"} />
      <noscript>
        <link rel="stylesheet" href={FONT_STYLESHEET} />
      </noscript>
    </>
  );
}

export async function loader({ request, context }: Route.LoaderArgs) {
  const user = context.get(userContext) ?? null;
  const { toast, headers } = await getToast(request);
  return { toast, user } as const;
}

export function ErrorBoundary() {
  const error = useRouteError();

  let title = "Something went wrong";
  let message = "An unexpected error occurred.";
  let statusCode: number | null = null;

  if (isRouteErrorResponse(error)) {
    statusCode = error.status;
    if (error.status === 404) {
      title = "Page Not Found";
      message = "The page you're looking for doesn't exist.";
    } else {
      message = error.statusText || message;
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <html lang="en" className="dark bg-gray-950">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
        <title>Error — Tabledeck</title>
        <Meta />
        <FontLinks />
        <Links />
      </head>
      <body className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4">
        {statusCode && (
          <p className="text-amber-400 text-6xl font-bold mb-2">{statusCode}</p>
        )}
        <h1 className="text-2xl font-semibold mb-3">{title}</h1>
        <p className="text-white/60 mb-6 text-center max-w-sm">{message}</p>
        <a
          href="/"
          className="bg-amber-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-amber-500 transition-colors"
        >
          Go Home
        </a>
        <Scripts />
      </body>
    </html>
  );
}

export default function App({ loaderData }: Route.ComponentProps) {
  const { toast } = loaderData;

  useEffect(() => {
    if (toast) {
      notify(toast.message, { type: toast.type, theme: "dark" });
    }
  }, [toast]);

  return (
    <html lang="en" className="dark bg-gray-950">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <FontLinks />
        <Links />
      </head>
      <body className="min-h-screen bg-gray-950 text-white">
        <ToastContainer />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
