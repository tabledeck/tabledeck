import { redirect } from "react-router";
import type { Route } from "./+types/signup";
import { getOptionalUserFromContext } from "~/domain/utils/global-context.server";
import { useState } from "react";
import { signUp } from "~/lib/auth-client";
import { BtnPrimary } from "~/components/tabledeck/BtnPrimary";
import { CardFanIcon } from "~/components/crests/CardFanIcon";

export function meta() {
  return [{ title: "Sign Up — Tabledeck" }];
}

export async function loader({ context }: Route.LoaderArgs) {
  const user = getOptionalUserFromContext(context);
  if (user) throw redirect("/");
  return null;
}

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await signUp.email({ name, email, password });
      if (result.error) {
        setError(result.error.message ?? "Sign up failed.");
      } else {
        window.location.href = "/";
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="td-surface flex flex-col items-center justify-center p-4">
      {/* Wordmark above card */}
      <div className="mb-7 text-center flex flex-col items-center gap-2">
        <CardFanIcon size={48} />
        <h1
          className="font-serif font-semibold"
          style={{
            fontSize: "32px",
            fontStyle: "italic",
            color: "#e8c872",
            textShadow: "0 1px 0 rgba(0,0,0,0.5), 0 0 28px rgba(201,162,74,0.2)",
            letterSpacing: "0.01em",
          }}
        >
          Tabledeck
        </h1>
        <p
          className="font-serif"
          style={{
            fontVariant: "small-caps",
            fontSize: "11.5px",
            letterSpacing: "0.38em",
            color: "rgba(244,233,208,0.5)",
          }}
        >
          Create Account
        </p>
      </div>

      {/* Parchment auth card */}
      <div className="td-auth-card">
        <form onSubmit={handleSignup} className="flex flex-col gap-5">
          <div>
            <label className="td-input-label">Display Name</label>
            <input
              type="text"
              placeholder="Your name at the table"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="td-input"
            />
          </div>
          <div>
            <label className="td-input-label">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="td-input"
            />
          </div>
          <div>
            <label className="td-input-label">Password</label>
            <input
              type="password"
              placeholder="Min. 8 characters"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="td-input"
            />
          </div>

          {error && (
            <p
              className="font-serif text-sm text-center"
              style={{ color: "#6b1a21", fontStyle: "italic" }}
            >
              {error}
            </p>
          )}

          <BtnPrimary type="submit" disabled={loading} fullWidth>
            {loading ? "Creating account\u2026" : "Create Account"}
          </BtnPrimary>

          <p
            className="font-serif text-sm text-center"
            style={{ fontStyle: "italic", color: "rgba(26,22,18,0.55)" }}
          >
            Already have an account?{" "}
            <a
              href="/login"
              style={{ color: "#8b6a1e", textDecoration: "underline" }}
            >
              Sign in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
