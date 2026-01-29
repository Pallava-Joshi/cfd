"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/docs", label: "Docs" },
  { href: "/marketplace", label: "Marketplace" },
] as const;

const SCROLL_THRESHOLD = 24;

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className="relative inline-flex h-5 w-5 flex-col items-center justify-center gap-1">
      <span
        className={cn(
          "block h-0.5 w-5 origin-center bg-current transition-all duration-200",
          open ? "translate-y-1.5 rotate-45" : "translate-y-0 rotate-0",
        )}
      />
      <span
        className={cn(
          "block h-0.5 w-5 bg-current transition-all duration-200",
          open ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100",
        )}
      />
      <span
        className={cn(
          "block h-0.5 w-5 origin-center bg-current transition-all duration-200",
          open ? "-translate-y-1.5 -rotate-45" : "translate-y-0 rotate-0",
        )}
      />
    </span>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isLoading: userLoading, logoutMutation } = useAuth();

  const onScroll = useCallback(() => {
    setScrolled(
      typeof window !== "undefined" ? window.scrollY > SCROLL_THRESHOLD : false,
    );
  }, []);

  useEffect(() => {
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-transparent",
        "pt-2 px-4 sm:px-6 transition-[padding] duration-300 ease-out",
      )}
    >
      <div
        className={cn(
          "min-h-[52px] sm:min-h-[58px] md:min-h-[62px] w-full max-w-[1260px] mx-auto flex flex-row md:grid md:grid-cols-[auto_1fr_auto] items-center gap-1.5 sm:gap-3 md:gap-4 lg:gap-6 px-2.5 sm:px-4 md:px-6 rounded-xl sm:rounded-2xl",
          "transition-[background-color,border-color] duration-300 ease-out",
          scrolled || mobileMenuOpen
            ? "bg-white border border-[var(--border)]"
            : "bg-transparent border border-transparent",
        )}
      >
        {/* Column 1: Logo */}
        <Link
          href="/"
          className="hover:opacity-80 transition-opacity flex items-center justify-self-start min-w-0"
          aria-label="MarginX home"
        >
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-black rounded-full shrink-0" />
            <span className="text-sm sm:text-base md:text-xl font-semibold font-ibm-plex-mono text-black truncate max-w-[120px] sm:max-w-none">
              MarginX
            </span>
          </div>
        </Link>

        {/* Column 2: Nav links + GitHub (desktop only) */}
        <nav className="hidden md:flex flex-1 items-center justify-center min-w-0 gap-2 sm:gap-3 md:gap-4 lg:gap-6 text-[12px] sm:text-[13px] md:text-[15px]">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "shrink-0 transition-colors whitespace-nowrap",
                pathname === link.href
                  ? "text-[var(--foreground)] font-medium"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
              )}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://github.com/pallava-joshi/cfd"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View on GitHub"
            className="shrink-0 p-1 rounded-md text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors inline-flex items-center justify-center"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
        </nav>

        {/* Spacer on mobile so hamburger stays rightmost */}
        <div className="flex-1 min-w-0 md:hidden" aria-hidden />

        {/* Column 3: Auth CTAs (desktop) / Hamburger (mobile) */}
        <div className="flex items-center justify-end gap-1.5 sm:gap-2 md:gap-4 min-w-0 flex-shrink-0 text-[12px] sm:text-[13px] md:text-[15px] md:justify-self-end">
          <div className="hidden md:flex items-center gap-1.5 sm:gap-2 md:gap-4">
            {userLoading ? (
              <span className="text-[var(--muted-foreground)]/60 shrink-0">
                …
              </span>
            ) : user ? (
              <>
                <Link
                  href="/marketplace"
                  className="shrink-0 whitespace-nowrap text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                >
                  Trade
                </Link>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => logoutMutation.mutate()}
                  className="shrink-0 px-3 sm:px-4"
                >
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="shrink-0 whitespace-nowrap text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                >
                  Sign in
                </Link>
                <Link href="/register" className="shrink-0">
                  <Button
                    size="sm"
                    className="whitespace-nowrap px-2.5 sm:px-3 md:px-4"
                  >
                    Get started
                  </Button>
                </Link>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="md:hidden flex items-center justify-center p-2 -mr-2 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/10 transition-colors"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <MenuIcon open={mobileMenuOpen} />
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div
        className={cn(
          "md:hidden absolute left-4 right-4 top-full mt-1 rounded-2xl border border-[var(--border)] bg-white shadow-lg overflow-hidden transition-all duration-200 ease-out",
          mobileMenuOpen
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible -translate-y-2 pointer-events-none",
        )}
      >
        <nav className="flex flex-col py-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-4 py-3 text-[15px] transition-colors",
                pathname === link.href
                  ? "text-[var(--foreground)] font-medium bg-[var(--muted)]/10"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/5",
              )}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://github.com/pallava-joshi/cfd"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View on GitHub"
            className="px-4 py-3 text-[15px] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/5 transition-colors flex items-center gap-2"
          >
            GitHub
          </a>
          <div className="border-t border-[var(--border)] my-2" />
          {userLoading ? (
            <div className="px-4 py-3 text-[var(--muted-foreground)]/60">…</div>
          ) : user ? (
            <>
              <Link
                href="/marketplace"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-[15px] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/5"
              >
                Trade
              </Link>
              <button
                type="button"
                onClick={() => {
                  logoutMutation.mutate();
                  setMobileMenuOpen(false);
                }}
                className="px-4 py-3 text-left text-[15px] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/5 w-full"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-[15px] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/5"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="mx-4 mt-2 mb-3"
              >
                <Button className="w-full py-3">Get started</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
