/// <reference types="@cloudflare/workers-types" />

export {};

declare global {
  interface Env {
    D1_DATABASE: D1Database;
    SKULL_KING_DB?: D1Database;
    BATTLESHIP_DB?: D1Database;
    KINGS_CRIBBAGE_DB?: D1Database;
    SCOREBOARD_DB?: D1Database;
    GAME_OF_THINGS_DB?: D1Database;
    ENVIRONMENT: string;
    BETTER_AUTH_SECRET: string;
  }
}

declare module "react-router" {
  interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
  }
}
