"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { getOAuthLoginUrl, loginAdmin, saveAdminSession } from "../../lib/admin-store";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("oauth") === "success") {
      saveAdminSession(params.get("token") ?? "oauth-login", params.get("provider") ?? "oauth", params.get("email") ?? "");
      router.replace("/admin");
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

    const accepted = await loginAdmin(email, password);
    setSubmitting(false);

    if (!accepted) {
      setError("Email or password is incorrect.");
      return;
    }

    router.push("/admin");
  }

  return (
    <>
      <Header />
      <main className="auth-page">
        <form className="auth-panel" onSubmit={handleSubmit}>
          <h1>Admin Login</h1>
          <label>
            Email
            <input value={email} autoComplete="email" onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label>
            Password
            <input type="password" value={password} autoComplete="current-password" onChange={(event) => setPassword(event.target.value)} />
          </label>
          {error ? <p className="form-error">{error}</p> : null}
          <button type="submit" disabled={submitting}>
            {submitting ? "LOGGING IN..." : "LOGIN"}
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
        </form>
      </main>
      <Footer />
    </>
  );
}
