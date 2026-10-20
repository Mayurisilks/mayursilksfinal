"use client";

import Link from "next/link";
import { useState } from "react";

const products = [
  {
    name: "Kanjivaram Silk Saree",
    category: "Traditional Collection",
    price: "₹12,499",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=85",
  },
  {
    name: "Banarasi Silk Saree",
    category: "Wedding Collection",
    price: "₹9,999",
    image:
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=700&q=85",
  },
  {
    name: "Designer Silk Saree",
    category: "Festive Collection",
    price: "₹7,499",
    image:
      "https://images.unsplash.com/photo-1583391733956-6c78276477e3?auto=format&fit=crop&w=700&q=85",
  },
];

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#F8F5F0] text-[#30231F]">
      {/* Announcement */}
      <div className="bg-[#550022] px-4 py-2 text-center text-xs tracking-wide text-[#F8F0E4]">
        Discover timeless elegance with Mayuri Silks
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#E9DFD2] bg-[#F8F5F0]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D8B878] bg-[#550022] text-2xl text-[#D8B878]">
              M
            </span>
            <span>
              <span className="block text-lg font-bold tracking-[0.16em] text-[#550022]">
                MAYURI SILKS
              </span>
              <span className="block text-[9px] tracking-[0.24em] text-[#94794F]">
                TIMELESS INDIAN ELEGANCE
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm md:flex">
            <Link href="/" className="font-semibold text-[#550022]">
              Home
            </Link>
            <a href="#collections" className="transition hover:text-[#94794F]">
              Collections
            </a>
            <a href="#featured" className="transition hover:text-[#94794F]">
              Featured Sarees
            </a>
          </nav>

          <div className="hidden items-center gap-3 sm:flex">
            <Link
              href="/login"
              className="rounded-lg border border-[#550022] px-4 py-2.5 text-sm font-semibold text-[#550022] transition hover:bg-[#550022] hover:text-white"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-[#550022] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#70002D]"
            >
              Create Account
            </Link>
          </div>

          <button
            type="button"
            aria-label="Toggle navigation menu"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E9DFD2] text-xl sm:hidden"
          >
            {menuOpen ? "×" : "☰"}
          </button>
        </div>

        {menuOpen && (
          <div className="space-y-3 border-t border-[#E9DFD2] bg-white p-5 sm:hidden">
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="block rounded-lg border border-[#550022] px-4 py-3 text-center font-semibold text-[#550022]"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              onClick={() => setMenuOpen(false)}
              className="block rounded-lg bg-[#550022] px-4 py-3 text-center font-semibold text-white"
            >
              Create Account
            </Link>
            <a
              href="#collections"
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-center text-sm"
            >
              Explore Collections
            </a>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-10 sm:px-8 sm:py-16 lg:grid-cols-2 lg:gap-16 lg:py-20">
        <div className="mayuri-animate-in order-2 lg:order-1">
          <p className="mb-5 text-xs font-bold tracking-[0.25em] text-[#94794F] sm:text-sm">
            THE BEAUTY OF TRADITION
          </p>

          <h1 className="max-w-xl text-4xl font-semibold leading-[1.15] tracking-tight text-[#550022] sm:text-5xl lg:text-6xl">
            Elegance woven
            <br />
            into every
            <span className="font-normal italic text-[#94794F]"> thread.</span>
          </h1>

          <p className="mt-6 max-w-md text-sm leading-7 text-[#786A62] sm:text-base">
            Discover beautiful silk sarees that celebrate tradition, timeless
            craftsmanship and the special moments of your life.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#collections"
              className="inline-flex items-center gap-3 rounded-lg bg-[#550022] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#70002D]"
            >
              Explore Collection <span aria-hidden="true">→</span>
            </a>
            <Link
              href="/login"
              className="rounded-lg border border-[#D8B878] px-6 py-3.5 text-sm font-semibold text-[#550022] transition hover:bg-white"
            >
              Sign In
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-[#E5D9CA] pt-6">
            <div>
              <p className="text-lg font-bold text-[#550022]">Timeless</p>
              <p className="mt-1 text-xs text-[#8B7B70]">Traditional beauty</p>
            </div>
            <div>
              <p className="text-lg font-bold text-[#550022]">Elegant</p>
              <p className="mt-1 text-xs text-[#8B7B70]">Curated collections</p>
            </div>
            <div>
              <p className="text-lg font-bold text-[#550022]">Mayuri</p>
              <p className="mt-1 text-xs text-[#8B7B70]">Made for moments</p>
            </div>
          </div>
        </div>

        <div className="relative order-1 mx-auto w-full max-w-lg lg:order-2 lg:max-w-none">
          <div className="absolute -right-3 -top-3 h-24 w-24 rounded-tr-[40px] border-r border-t border-[#D8B878] sm:-right-5 sm:-top-5 sm:h-32 sm:w-32" />
          <div className="absolute -bottom-3 -left-3 h-24 w-24 rounded-bl-[40px] border-b border-l border-[#D8B878] sm:-bottom-5 sm:-left-5 sm:h-32 sm:w-32" />
          <div className="relative overflow-hidden rounded-t-[180px] rounded-b-2xl bg-[#E9DFD2]">
            <img
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=90"
              alt="Traditional Indian silk saree"
              className="h-[360px] w-full object-cover sm:h-[500px] lg:h-[570px]"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#2B111A]/80 to-transparent p-6 pt-20 sm:p-8 sm:pt-24">
              <p className="text-xs tracking-[0.2em] text-[#E8D5B0]">
                THE SIGNATURE COLLECTION
              </p>
              <p className="mt-2 text-2xl font-medium text-white sm:text-3xl">
                Tradition, treasured.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Collections */}
      <section
        id="collections"
        className="border-y border-[#E9DFD2] bg-white py-12 sm:py-16"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-bold tracking-[0.22em] text-[#94794F]">
                FIND YOUR STYLE
              </p>
              <h2 className="text-2xl font-semibold text-[#550022] sm:text-3xl">
                Explore Collections
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-[#81736C]">
              Thoughtfully curated styles for weddings, celebrations and
              everyday elegance.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                title: "Wedding Silks",
                subtitle: "For your special day",
                image:
                  "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=700&q=85",
              },
              {
                title: "Traditional Sarees",
                subtitle: "Rooted in heritage",
                image:
                  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=85",
              },
              {
                title: "Festive Collection",
                subtitle: "Celebrate beautifully",
                image:
                  "https://images.unsplash.com/photo-1583391733956-6c78276477e3?auto=format&fit=crop&w=700&q=85",
              },
            ].map((collection) => (
              <a
                href="#featured"
                key={collection.title}
                className="group relative min-h-[250px] overflow-hidden rounded-xl bg-[#E9DFD2] sm:min-h-[320px]"
              >
                <img
                  src={collection.image}
                  alt={collection.title}
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#250D16]/85 via-black/5 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <p className="text-xs text-[#E8D5B0]">
                    {collection.subtitle}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-white">
                    {collection.title}
                  </h3>
                  <p className="mt-3 text-sm text-white">
                    Explore collection →
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section
        id="featured"
        className="mx-auto max-w-7xl px-4 py-12 sm:px-8 sm:py-16"
      >
        <div className="mb-8">
          <p className="mb-2 text-xs font-bold tracking-[0.22em] text-[#94794F]">
            HANDPICKED FOR YOU
          </p>
          <h2 className="text-2xl font-semibold text-[#550022] sm:text-3xl">
            Featured Sarees
          </h2>
          <p className="mt-2 text-sm text-[#81736C]">
            A glimpse of the elegance that awaits you.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <article key={product.name} className="group">
              <div className="overflow-hidden rounded-xl bg-white">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-[330px] w-full object-cover transition duration-500 group-hover:scale-[1.03] sm:h-[380px]"
                />
              </div>
              <div className="flex items-start justify-between gap-3 pt-4">
                <div>
                  <p className="text-xs text-[#94794F]">{product.category}</p>
                  <h3 className="mt-1 font-semibold text-[#550022]">
                    {product.name}
                  </h3>
                </div>
                <p className="whitespace-nowrap text-sm font-bold">
                  {product.price}
                </p>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-6 text-xs leading-5 text-[#8B7B70]">
          Product names, images and prices shown here are sample content. Actual
          products will be loaded from your backend later.
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-[#3D0019] text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <p className="font-semibold tracking-[0.16em]">MAYURI SILKS</p>
            <p className="mt-2 text-xs text-[#E8D5B0]">
              Timeless Indian elegance.
            </p>
          </div>
          <div className="flex flex-wrap gap-5 text-sm text-[#F8F0E4]">
            <Link href="/login" className="hover:text-[#D8B878]">
              Sign In
            </Link>
            <Link href="/register" className="hover:text-[#D8B878]">
              Create Account
            </Link>
          </div>
          <p className="text-xs text-[#D5C0B8]">© 2026 Mayuri Silks</p>
        </div>
      </footer>
    </main>
  );
}
