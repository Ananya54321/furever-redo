"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
  {
    title: "Overview",
    href: "/dashboard/seller",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/dashboard/seller/products",
    icon: ShoppingBag,
  },
  {
    title: "Orders & Transactions",
    href: "/dashboard/seller/transactions",
    icon: Package,
  },
  {
    title: "Settings",
    href: "/dashboard/seller/settings",
    icon: Settings,
  },
];

export default function SellerDashboardLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="hidden w-64 flex-col bg-white border-r md:flex">
        <div className="p-6 border-b">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-700 to-yellow-900">
              Seller Hub
            </span>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="grid gap-1 px-2">
            {sidebarItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-yellow-900",
                  pathname === item.href
                    ? "bg-yellow-50 text-yellow-900"
                    : "text-gray-500 hover:bg-gray-100"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
                {pathname === item.href && (
                  <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
                )}
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-500">
              <LogOut className="h-4 w-4" />
              <span>Seller Mode</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
          <main className="flex-1 p-6">
              {children}
          </main>
      </div>
    </div>
  );
}
