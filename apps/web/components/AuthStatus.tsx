"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSessionProfile, logoutAdmin, subscribeAuth, type SessionProfile } from "../lib/admin-store";

export function AuthStatus() {
  const [profile, setProfile] = useState<SessionProfile | null>(null);

  useEffect(() => {
    const refresh = () => setProfile(getSessionProfile());
    refresh();

    return subscribeAuth(refresh);
  }, []);

  if (!profile) {
    return (
      <>
        <Link href="/login?mode=join">Join</Link>
        <Link href="/login">Login</Link>
      </>
    );
  }

  return (
    <>
      {profile.role === "ADMIN" ? <Link href="/admin">Admin</Link> : null}
      <button
        className="header-text-button"
        onClick={() => {
          logoutAdmin();
          setProfile(null);
        }}
      >
        Logout
      </button>
    </>
  );
}
