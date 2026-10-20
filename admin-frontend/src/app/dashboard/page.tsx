"use client";

import { useState } from "react";
import { Button } from "@heroui/react";

const menuItems = [
  { name: "Overview", icon: "◫" },
  { name: "Products", icon: "◇" },
  { name: "Categories", icon: "▦" },
  { name: "Inventory", icon: "▤" },
  { name: "Orders", icon: "↗" },
  { name: "Customers", icon: "♙" },
  { name: "Banners", icon: "▧" },
  { name: "Settings", icon: "⚙" },
];

const stats = [
  { label: "Total Revenue", value: "₹2,48,650", change: "+12.8%", icon: "↗" },
  { label: "Total Orders", value: "1,248", change: "+8.2%", icon: "▤" },
  { label: "Total Products", value: "356", change: "+4.5%", icon: "◇" },
  { label: "Total Customers", value: "892", change: "+10.3%", icon: "♙" },
];

const orders = [
  {
    id: "#MY-1048",
    customer: "Ananya Reddy",
    product: "Kanjivaram Silk Saree",
    amount: "₹12,499",
    status: "Delivered",
  },
  {
    id: "#MY-1047",
    customer: "Priya Sharma",
    product: "Banarasi Silk Saree",
    amount: "₹8,999",
    status: "Processing",
  },
  {
    id: "#MY-1046",
    customer: "Kavya Rao",
    product: "Mysore Silk Saree",
    amount: "₹6,499",
    status: "Pending",
  },
  {
    id: "#MY-1045",
    customer: "Meera Nair",
    product: "Soft Silk Saree",
    amount: "₹4,999",
    status: "Delivered",
  },
];

export default function DashboardPage() {
  const [activeMenu, setActiveMenu] = useState("Overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  function logout() {
    window.location.href = "/";
  }

  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#30231F]">
      {mobileMenuOpen && (
        <button
          aria-label="Close menu"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[255px] flex-col border-r border-[#EAE2D7] bg-white transition-transform duration-300 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex h-[86px] items-center gap-3 border-b border-[#F0EAE2] px-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#550022] text-xl text-[#D8B878]">
            M
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-[0.12em] text-[#550022]">
              MAYURI
            </h1>
            <p className="text-[10px] font-semibold tracking-[0.27em] text-[#9B826C]">
              SILKS · ADMIN
            </p>
          </div>
        </div>

        <div className="px-5 pt-7">
          <p className="mb-3 px-3 text-[10px] font-bold tracking-[0.2em] text-[#A4978B]">
            STORE MANAGEMENT
          </p>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setActiveMenu(item.name);
                  setMobileMenuOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${
                  activeMenu === item.name
                    ? "bg-[#550022] text-white shadow-md shadow-[#550022]/15"
                    : "text-[#74665F] hover:bg-[#F8F5F0] hover:text-[#550022]"
                }`}
              >
                <span className="flex h-6 w-6 items-center justify-center text-lg">
                  {item.icon}
                </span>
                {item.name}
                {item.name === "Orders" && (
                  <span
                    className={`ml-auto rounded-full px-2 py-0.5 text-[10px] ${
                      activeMenu === item.name
                        ? "bg-white/20 text-white"
                        : "bg-[#F5E7D1] text-[#550022]"
                    }`}
                  >
                    8
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-5">
          <div className="rounded-2xl bg-[#F8F5F0] p-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <p className="text-xs font-bold">Store overview</p>
            </div>
            <p className="text-xs leading-5 text-[#8A7A70]">
              Manage your products, orders and customers in one place.
            </p>
          </div>
          <p className="mt-4 text-center text-[10px] text-[#A4978B]">
            MAYURI SILKS © 2026
          </p>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-[255px]">
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-[#EAE2D7] bg-white/95 px-4 backdrop-blur-md sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#EAE2D7] text-xl lg:hidden"
            >
              ☰
            </button>
            <div>
              <p className="text-xs text-[#A4978B]">Mayuri Silks / Admin</p>
              <h2 className="text-lg font-bold">{activeMenu}</h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              aria-label="Notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#EAE2D7] text-lg hover:bg-[#F8F5F0]"
            >
              ♧
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#550022]" />
            </button>
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-[#F8F5F0]"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#550022] text-sm font-bold text-[#D8B878]">
                  A
                </span>
                <span className="hidden text-left sm:block">
                  <span className="block text-xs font-bold">Administrator</span>
                  <span className="block text-[10px] text-[#A4978B]">
                    Store admin
                  </span>
                </span>
                <span className="text-xs">⌄</span>
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-12 w-48 rounded-xl border border-[#EAE2D7] bg-white p-2 shadow-xl">
                  <button
                    onClick={() => {
                      setActiveMenu("Settings");
                      setProfileOpen(false);
                    }}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-[#F8F5F0]"
                  >
                    ⚙️ Settings
                  </button>
                  <button
                    onClick={logout}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm text-[#9B173B] hover:bg-red-50"
                  >
                    ↪ Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1500px] p-4 sm:p-8">
          <div className="mayuri-animate-in mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-sm font-semibold text-[#9B826C]">
                YOUR STORE AT A GLANCE
              </p>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Welcome back, Admin <span className="text-[#550022]">✦</span>
              </h1>
              <p className="mt-2 text-sm text-[#8A7A70]">
                Here&apos;s what&apos;s happening with your store today.
              </p>
            </div>
            <p className="text-sm text-[#8A7A70]">Saturday, October 17, 2026</p>
          </div>

          {activeMenu !== "Overview" && (
            <div className="mb-6 rounded-xl border border-[#EAE2D7] bg-white p-4 text-sm text-[#74665F]">
              <strong className="text-[#550022]">{activeMenu}</strong> section
              selected. Its management screen and backend integration will be
              added next.
            </div>
          )}

          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="mayuri-animate-in rounded-2xl border border-[#EAE2D7] bg-white p-5 sm:p-6"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-sm font-medium text-[#8A7A70]">
                    {stat.label}
                  </p>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8F0E4] text-xl text-[#550022]">
                    {stat.icon}
                  </span>
                </div>
                <div className="flex flex-wrap items-end justify-between gap-2">
                  <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    {stat.value}
                  </h3>
                  <span className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">
                    {stat.change}
                  </span>
                </div>
                <p className="mt-3 text-xs text-[#A4978B]">
                  Sample dashboard figures
                </p>
              </div>
            ))}
          </div>

          <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
            <section className="rounded-2xl border border-[#EAE2D7] bg-white p-5 sm:p-6">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold">Revenue overview</h3>
                  <p className="mt-1 text-xs text-[#A4978B]">
                    Illustrative weekly sales
                  </p>
                </div>
                <span className="rounded-lg border border-[#EAE2D7] px-3 py-2 text-xs font-semibold">
                  This week⌄
                </span>
              </div>
              <div className="flex h-[210px] items-end gap-3 border-b border-l border-[#F0EAE2] px-3 sm:gap-5">
                {[38, 58, 45, 75, 52, 88, 68].map((height, index) => (
                  <div
                    key={index}
                    className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                  >
                    <div className="flex w-full flex-1 items-end">
                      <div
                        className={`w-full rounded-t-lg transition-all duration-500 hover:opacity-75 ${
                          index === 5 ? "bg-[#550022]" : "bg-[#D8B878]"
                        }`}
                        style={{ height: `${height}%` }}
                        title={`Illustrative value: ${height}`}
                      />
                    </div>
                    <span className="pb-2 text-[10px] text-[#A4978B]">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-[#A4978B]">
                Connect the backend to display actual revenue data.
              </p>
            </section>

            <section className="rounded-2xl border border-[#EAE2D7] bg-white p-5 sm:p-6">
              <div className="mb-6">
                <h3 className="text-lg font-bold">Order status</h3>
                <p className="mt-1 text-xs text-[#A4978B]">
                  Overview of sample orders
                </p>
              </div>
              <div className="space-y-5">
                {[
                  { label: "Delivered", count: 68, color: "bg-emerald-500" },
                  { label: "Processing", count: 22, color: "bg-[#D8B878]" },
                  { label: "Pending", count: 10, color: "bg-orange-400" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-[#74665F]">{item.label}</span>
                      <span className="font-bold">{item.count}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[#F0EAE2]">
                      <div
                        className={`h-full rounded-full ${item.color}`}
                        style={{ width: `${item.count}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-7 rounded-xl bg-[#F8F5F0] p-4">
                <p className="text-sm font-bold">Store performance</p>
                <p className="mt-1 text-xs leading-5 text-[#8A7A70]">
                  These visual indicators use placeholder data until the API is
                  connected.
                </p>
              </div>
            </section>
          </div>

          <section className="overflow-hidden rounded-2xl border border-[#EAE2D7] bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 p-5 sm:p-6">
              <div>
                <h3 className="text-lg font-bold">Recent orders</h3>
                <p className="mt-1 text-xs text-[#A4978B]">
                  Latest sample order activity
                </p>
              </div>
              <Button
                onPress={() => setActiveMenu("Orders")}
                className="rounded-xl bg-[#550022] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#3D0019]"
              >
                View all orders →
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left text-sm">
                <thead className="bg-[#FAF8F5] text-xs text-[#8A7A70]">
                  <tr>
                    <th className="px-6 py-4 font-semibold">ORDER ID</th>
                    <th className="px-6 py-4 font-semibold">CUSTOMER</th>
                    <th className="px-6 py-4 font-semibold">PRODUCT</th>
                    <th className="px-6 py-4 font-semibold">AMOUNT</th>
                    <th className="px-6 py-4 font-semibold">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EAE2]">
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="transition hover:bg-[#FFFCF8]"
                    >
                      <td className="px-6 py-4 font-bold text-[#550022]">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {order.customer}
                      </td>
                      <td className="px-6 py-4 text-[#74665F]">
                        {order.product}
                      </td>
                      <td className="px-6 py-4 font-bold">{order.amount}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${
                            order.status === "Delivered"
                              ? "bg-emerald-50 text-emerald-700"
                              : order.status === "Processing"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-orange-50 text-orange-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-[#F0EAE2] px-6 py-4 text-xs text-[#A4978B]">
              Demo data only · Live orders will come from your backend API.
            </div>
          </section>

          <footer className="py-8 text-center text-xs text-[#A4978B]">
            Crafted for Mayuri Silks · Admin Dashboard
          </footer>
        </main>
      </div>
    </div>
  );
}
