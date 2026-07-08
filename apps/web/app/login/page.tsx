"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { getOAuthLoginUrl, getSessionProfile, joinCustomer, loginAdmin, loginCustomer, saveUserSession } from "../../lib/admin-store";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "join">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("oauth") !== "success") {
      const profile = getSessionProfile();

      if (profile) {
        router.replace(profile.role === "ADMIN" ? "/admin" : "/mypage");
        return;
      }
    }

    if (params.get("mode") === "join") {
      setMode("join");
    }

    if (params.get("oauth") === "success") {
      saveUserSession(params.get("token") ?? "oauth-login", params.get("provider") ?? "oauth", params.get("email") ?? "");
      router.replace("/mypage");
      return;
    }

    if (params.get("oauth") === "failed") {
      setError("OAuth login failed. Please try again.");
    }
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    if (mode === "join") {
      const joined = joinCustomer({ name, email, password });
      setSubmitting(false);

      if (!joined) {
        setError("This email is already registered or the input is invalid.");
        return;
      }

      router.push("/mypage");
      return;
    }

    const adminAccepted = await loginAdmin(email, password);

    if (adminAccepted) {
      setSubmitting(false);
      router.push("/admin");
      return;
    }

    const customerAccepted = loginCustomer(email, password);
    setSubmitting(false);

    if (!customerAccepted) {
      setError("Email or password is incorrect.");
      return;
    }

    router.push("/mypage");
  }

  return (
    <>
      <Header />
      <main className="auth-page">
        <form className="auth-panel" onSubmit={handleSubmit}>
          <div className="auth-tabs" role="tablist" aria-label="Account mode">
            <button type="button" className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>
              Login
            </button>
            <button type="button" className={mode === "join" ? "active" : ""} onClick={() => setMode("join")}>
              Join
            </button>
          </div>
          <h1>{mode === "join" ? "Join" : "Login"}</h1>
          {mode === "join" ? (
            <label>
              Name
              <input value={name} autoComplete="name" onChange={(event) => setName(event.target.value)} />
            </label>
          ) : null}
          <label>
            Email
            <input required type="email" value={email} autoComplete="email" onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label>
            Password
            <input required type="password" value={password} autoComplete={mode === "join" ? "new-password" : "current-password"} onChange={(event) => setPassword(event.target.value)} />
          </label>
          {error ? <p className="form-error">{error}</p> : null}
          <button type="submit" disabled={submitting}>
            {submitting ? "PLEASE WAIT..." : mode === "join" ? "JOIN" : "LOGIN"}
          </button>
          <div className="oauth-divider">or</div>
          <div className="oauth-actions">
            <a className="oauth-button google" href={getOAuthLoginUrl("google")}>
              Continue with Google
            </a>
            <a className="oauth-button kakao" href={getOAuthLoginUrl("kakao")}>
              Continue with Kakao
            </a>
          </div>
          <p className="auth-help">Admin accounts can sign in from this same login form.</p>
        </form>
      </main>
      <Footer />
    </>
  );
}
