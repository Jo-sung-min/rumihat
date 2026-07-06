"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { ADMIN_EMAIL, ADMIN_PASSWORD, loginAdmin } from "../../lib/admin-store";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState(ADMIN_PASSWORD);
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!loginAdmin(email, password)) {
      setError("관리자 계정 정보가 맞지 않습니다.");
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
            <input value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>
          {error ? <p className="form-error">{error}</p> : null}
          <button type="submit">LOGIN</button>
        </form>
      </main>
      <Footer />
    </>
  );
}

