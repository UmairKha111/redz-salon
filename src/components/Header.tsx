import React, { useState } from "react";
import { useCMSData } from "../data/cmsData";
import { Sparkles, Menu, X, Instagram, Phone } from "lucide-react";

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export default function Header({ currentPage, setCurrentPage }: HeaderProps) {
  const { brandInfo } = useCMSData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "portfolio", label: "Portfolio" },
    { id: "services", label: "Services" },
    { id: "about", label: "About Artist" },
    { id: "bookings", label: "Bookings" }
  ];

  const handleNavClick = (pageId: string) => {
    setCurrentPage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-100 shadow-[0_1px_2px_rgba(0,0,0,0.01)]" id="main-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Brand Logo / Typography */}
          <button
            onClick={() => handleNavClick("home")}
            className="flex items-center gap-3 group focus:outline-none"
            id="brand-logo-btn"
          >
            <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-white text-sm font-bold tracking-tighter group-hover:scale-105 transition-transform duration-300">
              R
            </div>
            <div className="text-left">
              <h1 className="text-lg md:text-xl font-sans font-extrabold text-stone-950 tracking-tighter leading-none">
                REDZ
              </h1>
              <span className="text-[9px] text-stone-400 uppercase tracking-widest font-mono font-bold block mt-0.5">
                Salon
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative text-xs uppercase font-semibold tracking-widest transition duration-200 py-1 focus:outline-none ${
                    isActive ? "text-stone-950 border-b-2 border-stone-950 pb-0.5" : "text-stone-400 hover:text-stone-950"
                  }`}
                  id={`nav-${link.id}`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Desktop Call to Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href={brandInfo.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-400 hover:text-stone-950 transition p-2 focus:outline-none"
              title="Instagram Profile"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <button
              onClick={() => handleNavClick("bookings")}
              className="px-6 py-2.5 bg-black hover:bg-stone-800 text-white rounded-full text-xs font-semibold tracking-wider transition-all duration-300 focus:outline-none flex items-center gap-1.5"
              id="header-booking-btn"
            >
              <Phone className="w-3 h-3" />
              Book Artist
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-stone-600 hover:text-stone-900 p-2 focus:outline-none"
              aria-label="Toggle Menu"
              id="mobile-hamburger"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-24 left-0 right-0 bg-white border-b border-stone-200 py-4 px-6 shadow-lg flex flex-col gap-4 animate-fade-in" id="mobile-menu-panel">
          {navLinks.map((link) => {
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-left text-sm font-semibold tracking-wider uppercase py-2.5 px-3 rounded-lg transition ${
                  isActive ? "bg-stone-100 text-stone-950 font-bold" : "text-stone-500 hover:bg-stone-50 hover:text-stone-950"
                }`}
                id={`mobile-nav-${link.id}`}
              >
                {link.label}
              </button>
            );
          })}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
            <a
              href={brandInfo.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-stone-500 hover:text-stone-950 text-xs font-semibold tracking-wide"
            >
              <Instagram className="w-4 h-4 text-stone-600" />
              @redz_salon_
            </a>
            <button
              onClick={() => handleNavClick("bookings")}
              className="bg-black hover:bg-stone-800 text-white text-xs font-bold px-5 py-2.5 rounded-full transition"
            >
              Inquire Booking
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
