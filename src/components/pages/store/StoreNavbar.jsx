import React from "react";
import { useRouter } from "next/navigation";
import { Home, ShoppingCart, CreditCard, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const StoreNavbar = ({ cart = [], setMobileMenuOpen, mobileMenuOpen }) => {
  const router = useRouter();

  const NavItem = ({ icon, label, onClick }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className="flex flex-col items-center justify-center text-[#E3DAC9] hover:bg-[#2E8B57] transition-colors rounded-full h-12 w-12"
            onClick={onClick}>
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="bg-[#2E8B57] text-[#E3DAC9] border-none">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <>
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={() => setMobileMenuOpen(false)}>
          <div
            className="w-64 h-full bg-[#355E3B] text-[#E3DAC9] p-4 ml-auto"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Menu</h2>
              <Button variant="ghost" onClick={() => setMobileMenuOpen(false)}>
                <X size={24} />
              </Button>
            </div>

            <div className="space-y-4">
              <Button
                variant="ghost"
                className="w-full justify-start text-[#E3DAC9] hover:bg-[#2E8B57]"
                onClick={() => router.push("/")}>
                <Home size={20} className="mr-2" /> Home
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-[#E3DAC9] hover:bg-[#2E8B57]">
                <ShoppingCart size={20} className="mr-2" /> Cart ({cart.length})
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-[#E3DAC9] hover:bg-[#2E8B57]">
                <CreditCard size={20} className="mr-2" /> Checkout
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-[#E3DAC9] hover:bg-[#2E8B57]"
                onClick={() => router.push("/profile")}>
                <User size={20} className="mr-2" /> Profile
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Toggle Button */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#355E3B]">
          Our Products
        </h1>
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 rounded-full hover:bg-[#2E8B57] bg-[#355E3B] text-white">
          <Menu size={20} />
        </button>
      </div>

      {/* Floating Bottom Bar */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-[#355E3B] rounded-full px-6 py-3 shadow-lg flex items-center space-x-4 z-20">
        <NavItem
          icon={<Home size={20} />}
          label="All Products"
          onClick={() => router.push("/")}
        />

        <NavItem
          icon={<ShoppingCart size={20} />}
          label={`Cart (${cart.length})`}
          onClick={() => {}}
        />
        <NavItem
          icon={<CreditCard size={20} />}
          label={`Checkout (${cart.length})`}
          onClick={() => {}}
        />

        <NavItem
          icon={<User size={20} />}
          label="History"
          onClick={() => router.push("/profile")}
        />
      </div>
    </>
  );
};

export default StoreNavbar;
