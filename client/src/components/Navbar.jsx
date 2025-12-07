"use client";
import React, { useState, useEffect } from "react";
import {
  Home,
  MessageCircle,
  Users,
  Calendar,
  ShoppingBag,
  ShoppingCart,
  Menu,
  X,
  PawPrint,
} from "lucide-react";
import Link from "next/link";
import { getToken, getUserByToken } from "../../actions/userActions";
import CartSidebar from "./CartSidebar";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        let token = await getToken("userToken");
        let type = "user";

        if (!token) {
          token = await getToken("sellerToken");
          type = "seller";
        }

        if (token) {
          const res = await getUserByToken(token, type);
          if (res.success) {
            setUser({ ...res.user, type });
          }
        }
      } catch (error) {
        console.error("Error fetching user", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const navLinks = [
    { name: "Community", href: "/community", icon: Users },
    { name: "Chat", href: "/chat", icon: MessageCircle },
    { name: "Store", href: "/store", icon: ShoppingBag },
    { name: "Events", href: "/events", icon: Calendar },
  ];

  return (
    <div>
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <PawPrint className="text-accent group-hover:scale-110 transition-transform" size={28} />
              <span className="titlefont text-2xl font-bold tracking-wide">
                FurEver
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-2 hover:text-accent transition-colors text-sm font-medium uppercase tracking-wider">
                  <link.icon size={18} />
                  {link.name}
                </Link>
              ))}
              
              <button 
                onClick={() => setCartOpen(true)}
                className="flex items-center gap-2 hover:text-accent transition-colors text-sm font-medium uppercase tracking-wider"
              >
                <ShoppingCart size={18} />
                Cart
              </button>

              <Link href="/profile" className="ml-4 group">
                {user?.profilePicture ? (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-accent group-hover:border-white transition-colors">
                    <img
                      src={user.profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-accent text-primary font-bold flex items-center justify-center border-2 border-transparent group-hover:border-white transition-colors">
                    {user ? getInitials(user.name) : "U"}
                  </div>
                )}
              </Link>
            </nav>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-white hover:text-accent transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 flex flex-col space-y-4 border-t border-gray-700 mt-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-3 px-2 py-2 hover:bg-white/10 rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}>
                  <link.icon size={20} className="text-accent" />
                  {link.name}
                </Link>
              ))}
              <button
                  className="flex items-center gap-3 px-2 py-2 hover:bg-white/10 rounded-md transition-colors w-full text-left"
                  onClick={() => {
                      setCartOpen(true);
                      setMobileMenuOpen(false);
                  }}>
                  <ShoppingCart size={20} className="text-accent" />
                  Cart
              </button>
              <Link
                href="/profile"
                className="flex items-center gap-3 px-2 py-2 hover:bg-white/10 rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}>
                {user?.profilePicture ? (
                  <div className="w-6 h-6 rounded-full overflow-hidden">
                    <img
                      src={user.profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-accent text-primary text-xs flex items-center justify-center">
                    {user ? getInitials(user.name) : "U"}
                  </div>
                )}
                Profile
              </Link>
            </nav>
          )}
        </div>
      </header>
    </div>
  );
};

export default Navbar;
