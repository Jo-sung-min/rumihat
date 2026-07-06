"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isAdminLoggedIn, logoutAdmin } from "../lib/admin-store";

export function AuthStatus() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isAdminLoggedIn());
  }, []);

  if (!loggedIn) {
    return <Link href="/login">Login</Link>;
  }

  return (
    <>
      <Link href="/admin">Admin</Link>
      <button
        className="header-text-button"
        onClick={() => {
          logoutAdmin();
          setLoggedIn(false);
        }}
      >
        Logout
      </button>
    </>
  );
}

