import React from "react";
import { useCMSData } from "../data/cmsData";
import { Sparkles, Instagram, Mail, Phone, MapPin, Heart } from "lucide-react";

interface FooterProps {
  setCurrentPage: (page: string) => void;
}

export default function Footer({ setCurrentPage }: FooterProps) {
  const { brandInfo } = useCMSData();
  const currentYear = new Date().getFullYear();

  const handleNavClick = (pageId: string) => {
    setCurrentPage(pageId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-stone-50 border-t border-stone-200/50 pt-16 pb-8 text-stone-600" id="main-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-200/60">
          
          {/* Column 1: Brand & Bio Summary */}
          <div className="space-y-4 md:col-span-1.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-xs font-bold tracking-tighter shrink-0">
                R
              </div>
              <h3 className="font-sans font-extrabold text-lg text-stone-900 tracking-tight">
                REDZ
              </h3>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed max-w-sm font-medium">
              REDZ BEAUTY SALON by Nikita Mohini provides luxurious, comprehensive beauty and salon solutions with strict hygiene standards.
            </p>
            <div className="flex items-center gap-2 text-stone-700 font-semibold text-xs">
              <MapPin className="w-4 h-4 text-stone-400" />
              <span>Aligarh, Uttar Pradesh, India</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider font-mono">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <button onClick={() => handleNavClick("home")} className="hover:text-stone-900 transition">
                  Home Page
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick("portfolio")} className="hover:text-stone-900 transition">
                  Portfolio Gallery
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick("services")} className="hover:text-stone-900 transition">
                  Pricing & Packages
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick("about")} className="hover:text-stone-900 transition">
                  About Artist
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick("bookings")} className="hover:text-stone-900 transition">
                  Bookings / Rates
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Certifications Summary */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider font-mono">
              Professional Status
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-500 font-semibold">
              <li className="flex items-start gap-1.5">
                <span className="text-stone-950 font-bold">✓</span>
                <span>Certified from VLCC Institute</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-stone-950 font-bold">✓</span>
                <span>HD Airbrush Expert</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-stone-950 font-bold">✓</span>
                <span>300+ Bridal Deliveries</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-stone-950 font-bold">✓</span>
                <span>Hygienic Premium Cosmetics Only</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Socials */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider font-mono">
              Contact & Social
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <a
                  href={brandInfo.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-stone-900 transition"
                >
                  <Instagram className="w-4 h-4 text-pink-600" />
                  <span>@redz_salon_</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${brandInfo.socials.email}`}
                  className="flex items-center gap-2 hover:text-stone-900 transition"
                >
                  <Mail className="w-4 h-4 text-stone-400" />
                  <span>{brandInfo.socials.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={brandInfo.socials.whatsapp}
                  className="flex items-center gap-2 hover:text-stone-900 transition"
                >
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>{brandInfo.socials.phone}</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Lower copyright bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>© {currentYear} Redz Salon. All rights reserved.</p>
          <div className="flex items-center gap-1.5">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for authentic elegance</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
