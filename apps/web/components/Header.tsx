import Link from "next/link";
import { Globe2, Instagram } from "lucide-react";
import { AuthStatus } from "./AuthStatus";
import { CartStatus } from "./CartStatus";

export function Header() {
  return (
    <header className="site-header">
      <div className="ticker">
        <span>Rumihat. ORIGINAL COTTON BALL CAP COLLECTION</span>
        <span>Rumihat. ORIGINAL COTTON BALL CAP COLLECTION</span>
        <span>Rumihat. ORIGINAL COTTON BALL CAP COLLECTION</span>
      </div>
      <div className="nav-bar">
        <nav className="nav-left" aria-label="주요 메뉴">
          <Link href="/store">STORE</Link>
          <Link href="/">LOOK</Link>
        </nav>
        <Link href="/" className="brand" aria-label="Rumihat home">
          Rumihat.
        </Link>
        <nav className="nav-right" aria-label="계정 메뉴">
          <Link href="/" aria-label="Instagram">
            <Instagram size={22} />
          </Link>
          <Link href="/" aria-label="Language">
            <Globe2 size={22} />
          </Link>
          <CartStatus />
          <Link href="/mypage">My page</Link>
          <AuthStatus />
        </nav>
      </div>
      <div className="sub-ticker">
        <span>NICE DAY WITH RUMIHAT</span>
        <span>NICE DAY WITH RUMIHAT</span>
        <span>NICE DAY WITH RUMIHAT</span>
        <span>NICE DAY WITH RUMIHAT</span>
      </div>
    </header>
  );
}
