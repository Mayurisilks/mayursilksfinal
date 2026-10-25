"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  CircleUserRound,
  ShoppingBag,
  Menu,
  X,
  Package,
  Settings,
  LogOut,
} from "lucide-react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Sarees", href: "/sarees" },
  { label: "Collection", href: "/collection" },
  { label: "New Collections", href: "/new-collections" },
  { label: "About", href: "/about" },
  { label: "Blogs", href: "/blogs" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customerName, setCustomerName] = useState("My Account");

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    function checkAuth() {
      const token = window.sessionStorage.getItem("authToken");
      const name = window.sessionStorage.getItem("customerName");

      setIsLoggedIn(Boolean(token));
      setCustomerName(name || "My Account");

      if (!token) {
        setProfileOpen(false);
      }
    }

    checkAuth();

    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, [pathname]);

  function handleProfileClick() {
    if (!isLoggedIn) {
      router.push("/login");
      setMenuOpen(false);
      return;
    }

    setProfileOpen((open) => !open);
  }

  function handleLogout() {
    window.sessionStorage.removeItem("authToken");
    window.sessionStorage.removeItem("customerName");

    setIsLoggedIn(false);
    setProfileOpen(false);
    setMenuOpen(false);

    router.replace("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200 bg-white">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex min-h-16 max-w-[1600px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10"
      >
        {/* Brand */}
        <Link
          href="/"
          className="shrink-0 leading-tight text-[#650025]"
          aria-label="Mayuri Silks home"
        >
          <span className="block text-lg font-bold tracking-[0.18em] sm:text-xl">
            MAYURI
          </span>
          <span className="mt-1 block text-center text-[9px] tracking-[0.42em]">
            SILKS
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center justify-center gap-5 lg:flex xl:gap-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap text-sm font-medium transition-colors ${
                  isActive
                    ? "text-[#650025]"
                    : "text-stone-700 hover:text-[#650025]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Action icons */}
        <div className="flex shrink-0 items-center gap-4 sm:gap-5">
          <button
            type="button"
            aria-label="Search products"
            onClick={() => router.push("/search")}
            className="cursor-pointer text-stone-800 transition-colors hover:text-[#650025]"
          >
            <Search size={22} strokeWidth={1.7} />
          </button>

          {/* Profile */}
          <div className="relative">
            <button
              type="button"
              aria-label="My profile"
              aria-expanded={profileOpen}
              onClick={handleProfileClick}
              className="cursor-pointer text-stone-800 transition-colors hover:text-[#650025]"
            >
              <CircleUserRound size={23} strokeWidth={1.7} />
            </button>

            {isLoggedIn && profileOpen && (
              <div className="absolute right-0 top-full z-50 mt-3 w-60 overflow-hidden rounded-lg border border-stone-200 bg-white shadow-lg">
                {/* Customer name */}
                <div className="border-b border-stone-100 px-4 py-4">
                  <p className="truncate text-sm font-semibold text-stone-900">
                    {customerName}
                  </p>
                  <p className="mt-1 text-xs text-stone-500">My Account</p>
                </div>

                {/* Orders */}
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    router.push("/orders");
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-stone-700 transition-colors hover:bg-stone-50 hover:text-[#650025]"
                >
                  <Package size={17} strokeWidth={1.7} />
                  Orders
                </button>

                {/* Settings */}
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    router.push("/settings");
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-stone-700 transition-colors hover:bg-stone-50 hover:text-[#650025]"
                >
                  <Settings size={17} strokeWidth={1.7} />
                  Settings
                </button>

                {/* Logout */}
                <div className="border-t border-stone-100">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                  >
                    <LogOut size={17} strokeWidth={1.7} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Shopping bag */}
          <button
            type="button"
            aria-label="Shopping bag"
            onClick={() => router.push("/cart")}
            className="cursor-pointer text-stone-800 transition-colors hover:text-[#650025]"
          >
            <ShoppingBag size={22} strokeWidth={1.7} />
          </button>

          {/* Mobile menu button */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="text-stone-800 lg:hidden"
          >
            {menuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </nav>

      {/* Mobile navigation */}
      {menuOpen && (
        <div className="border-t border-stone-200 bg-white px-5 py-3 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`border-b border-stone-100 py-3 text-sm font-medium ${
                  pathname === item.href ? "text-[#650025]" : "text-stone-700"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
