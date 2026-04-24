import { data } from "react-router";
import { isGameKey, type GameKey } from "~/domain/game-catalog";
import {
  createSetupPreset,
  deleteSetupPreset,
  listSetupPresets,
  updateSetupPreset,
} from "~/domain/platform.server";
import type { JsonValue, SetupPresetInput } from "~/domain/platform-shared";
import { getOptionalUserFromContext } from "~/domain/utils/global-context.server";

const MAX_PRESET_NAME_LENGTH = 80;
const MAX_SETTINGS_BYTES = 16_000;
const MAX_PRESET_ID_LENGTH = 128;

interface RouteArgs {
  request: Request;
  context: any;
}

interface PresetRequestBody {
  id?: unknown;
  gameKey?: unknown;
  name?: unknown;
  settings?: unknown;
}

function getCorsHeaders(request: Request): HeadersInit {
  const origin = request.headers.get("Origin");
  const headers: Record<string, string> = {
    Vary: "Origin",
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Credentials": "true",
  };

  if (
    origin &&
    (/^https:\/\/([a-z0-9-]+\.)?tabledeck\.us$/i.test(origin) ||
      /^http:\/\/(localhost|127\.0\.0\.1):\d+$/i.test(origin))
  ) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
}

function respond(
  request: Request,
  body: Record<string, unknown>,
  init: ResponseInit = {},
) {
  return data(body, {
    ...init,
    headers: {
      ...getCorsHeaders(request),
      ...(init.headers ?? {}),
    },
  });
}

function isJsonValue(value: unknown): value is JsonValue {
  if (value === null) return true;

  if (typeof value === "string" || typeof value === "boolean") return true;
  if (typeof value === "number") return Number.isFinite(value);

  if (Array.isArray(value)) {
    return value.every((entry) => isJsonValue(entry));
  }

  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>).every((entry) =>
      isJsonValue(entry),
    );
  }

  return false;
}

function normalizePresetId(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const presetId = value.trim();
  if (presetId.length === 0 || presetId.length > MAX_PRESET_ID_LENGTH) return null;

  return presetId;
}

function normalizePresetName(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const name = value.trim();
  if (name.length === 0 || name.length > MAX_PRESET_NAME_LENGTH) return null;

  return name;
}

function validatePresetInput(body: PresetRequestBody): SetupPresetInput | null {
  if (typeof body.gameKey !== "string" || !isGameKey(body.gameKey)) {
    return null;
  }

  const name = normalizePresetName(body.name);
  if (!name) return null;

  if (!isJsonValue(body.settings)) return null;

  const settingsJson = JSON.stringify(body.settings);
  if (settingsJson.length > MAX_SETTINGS_BYTES) return null;

  return {
    gameKey: body.gameKey,
    name,
    settings: body.settings,
  };
}

async function readJsonBody(request: Request): Promise<PresetRequestBody | null> {
  try {
    const body = (await request.json()) as unknown;
    if (!body || typeof body !== "object" || Array.isArray(body)) return null;
    return body as PresetRequestBody;
  } catch {
    return null;
  }
}

export async function loader({ request, context }: RouteArgs) {
  const user = getOptionalUserFromContext(context);
  if (!user) {
    return respond(request, { error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const gameKeyParam = url.searchParams.get("gameKey");

  let gameKey: GameKey | undefined;
  if (gameKeyParam) {
    if (!isGameKey(gameKeyParam)) {
      return respond(request, { error: "Invalid game" }, { status: 400 });
    }

    gameKey = gameKeyParam;
  }

  const presets = await listSetupPresets(context, user.id, gameKey);
  return respond(request, { presets });
}

export async function action({ request, context }: RouteArgs) {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: getCorsHeaders(request),
    });
  }

  const user = getOptionalUserFromContext(context);
  if (!user) {
    return respond(request, { error: "Unauthorized" }, { status: 401 });
  }

  if (request.method === "DELETE") {
    const url = new URL(request.url);
    const body = await readJsonBody(request);
    const presetId = normalizePresetId(url.searchParams.get("id") ?? body?.id);

    if (!presetId) {
      return respond(request, { error: "Invalid preset id" }, { status: 400 });
    }

    const deleted = await deleteSetupPreset(context, user.id, presetId);
    if (!deleted) {
      return respond(request, { error: "Preset not found" }, { status: 404 });
    }

    return respond(request, { ok: true, deleted: true });
  }

  if (!["POST", "PUT", "PATCH"].includes(request.method)) {
    return respond(
      request,
      { error: "Method not allowed" },
      { status: 405, headers: { Allow: "GET, POST, PUT, PATCH, DELETE" } },
    );
  }

  const body = await readJsonBody(request);
  if (!body) {
    return respond(request, { error: "Expected JSON object body" }, { status: 400 });
  }

  const input = validatePresetInput(body);
  if (!input) {
    return respond(request, { error: "Invalid preset" }, { status: 400 });
  }

  const presetId = normalizePresetId(body.id);
  if (presetId) {
    const preset = await updateSetupPreset(context, user.id, presetId, input);
    if (!preset) {
      return respond(request, { error: "Preset not found" }, { status: 404 });
    }

    return respond(request, { ok: true, preset });
  }

  if (request.method !== "POST") {
    return respond(request, { error: "Invalid preset id" }, { status: 400 });
  }

  const preset = await createSetupPreset(context, user.id, input);
  if (!preset) {
    return respond(request, { error: "Could not save preset" }, { status: 503 });
  }

  return respond(request, { ok: true, preset }, { status: 201 });
}
