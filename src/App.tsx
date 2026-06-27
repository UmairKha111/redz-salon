import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useCMSData } from "./data/cmsData";
import Header from "./components/Header";
import Footer from "./components/Footer";
import InstagramWidget from "./components/InstagramWidget";
import PortfolioGrid from "./components/PortfolioGrid";
import BookingForm from "./components/BookingForm";
import AdminPanel from "./components/AdminPanel";
import {
  Sparkles,
  Award,
  ShieldCheck,
  Star,
  ArrowRight,
  Phone,
  Clock,
  MapPin,
  ChevronDown,
  ExternalLink,
  Instagram,
  Heart,
} from "lucide-react";

export default function App() {
  const { brandInfo, heroSection, highlights, services, testimonials, FAQs } = useCMSData();
  const [currentPage, setCurrentPage] = useState<string>("home");
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  
  // Track selected category on portfolio page
  const [portfolioCategory, setPortfolioCategory] = useState<string>("all");

  useEffect(() => {
    const handleOpenAdmin = () => setIsAdminOpen(true);
    window.addEventListener("open-redz-admin", handleOpenAdmin);

    // Detect /admin in URL path or hash to launch the console privately
    const path = window.location.pathname;
    const hash = window.location.hash;
    if (path === "/admin" || path === "/admin/" || hash === "#/admin" || hash === "#admin") {
      setIsAdminOpen(true);
      // Clean up the address bar path to "/" to prevent 404s on page refresh
      try {
        window.history.replaceState(null, "", window.location.origin + window.location.search);
      } catch (e) {
        // Fallback if replaceState fails
      }
    }

    return () => {
      window.removeEventListener("open-redz-admin", handleOpenAdmin);
    };
  }, []);

  const toggleFAQ = (index: number) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  const handleExploreLook = (categoryId: string) => {
    setPortfolioCategory(categoryId);
    setCurrentPage("portfolio");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white text-stone-900 font-sans flex flex-col selection:bg-stone-950 selection:text-white">
      {/* Dynamic Header */}
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {/* Main Content Area with Smooth Page Transitions */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {currentPage === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="space-y-24 pb-24"
            >
              {/* Luxury Hero Banner */}
              <section className="relative overflow-hidden bg-white py-16 md:py-24" id="home-hero">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Hero Text content */}
                    <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
                      <div>
                        <span className="inline-block px-3.5 py-1 bg-stone-100 text-[10px] font-bold uppercase tracking-widest rounded-sm text-stone-900 border border-stone-200/50">
                          VLCC Certified Beauty Specialist
                        </span>
                      </div>
                      
                      <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-sans font-extrabold text-stone-950 tracking-tighter leading-[0.95]">
                        Crafting <br />
                        <span className="text-stone-300">Flawless</span> <br />
                        Elegance.
                      </h1>
                      
                      <p className="text-stone-500 text-base md:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                        {heroSection.subtitle}
                      </p>

                      <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2">
                        <button
                          onClick={() => setCurrentPage("bookings")}
                          className="px-8 py-3.5 bg-black hover:bg-stone-800 text-white rounded-full text-xs font-bold tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-sm"
                          id="hero-primary-btn"
                        >
                          <span>{heroSection.primaryButtonText}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleExploreLook("all")}
                          className="px-8 py-3.5 bg-white border border-stone-200 hover:border-stone-400 text-stone-900 hover:bg-stone-50 rounded-full text-xs font-bold tracking-wider transition-all duration-300 cursor-pointer"
                          id="hero-secondary-btn"
                        >
                          {heroSection.secondaryButtonText}
                        </button>
                      </div>

                      {/* Little inline stats trust indicators */}
                      <div className="grid grid-cols-3 gap-6 pt-10 max-w-lg mx-auto lg:mx-0 border-t border-stone-100">
                        <div>
                          <p className="text-3xl md:text-4xl font-sans font-extrabold text-stone-950 tracking-tighter">300+</p>
                          <p className="text-[9px] uppercase font-bold tracking-widest text-stone-400 mt-2">Brides Transformed</p>
                        </div>
                        <div>
                          <p className="text-3xl md:text-4xl font-sans font-extrabold text-stone-950 tracking-tighter">5+ Yrs</p>
                          <p className="text-[9px] uppercase font-bold tracking-widest text-stone-400 mt-2">Experience</p>
                        </div>
                        <div>
                          <p className="text-3xl md:text-4xl font-sans font-extrabold text-stone-950 tracking-tighter">4.9★</p>
                          <p className="text-[9px] uppercase font-bold tracking-widest text-stone-400 mt-2">Client Reviews</p>
                        </div>
                      </div>
                    </div>

                    {/* Hero Large Image Panel */}
                    <div className="lg:col-span-5 relative" id="hero-img-panel">
                      <div className="absolute inset-0 bg-stone-100 rounded-3xl rotate-1 scale-95 opacity-50" />
                      <div className="relative rounded-3xl overflow-hidden shadow-sm aspect-square sm:aspect-video lg:aspect-[4/5] border border-stone-100 bg-stone-50">
                        <img
                          src={heroSection.heroImage}
                          alt="Luxury bridal makeup highlight"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-stone-100 shadow-sm flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-stone-950 text-white flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-stone-950 leading-none">Safe & Certified Styling</p>
                            <p className="text-[9px] text-stone-400 mt-1">Premium hypoallergenic luxury cosmetics</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Instagram-inspired highlights list (Circle Reels Section) */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16" id="home-specialties">
                <div className="text-center space-y-4">
                  <span className="inline-block px-3 py-1 bg-stone-100 text-[10px] font-bold uppercase tracking-widest rounded-sm text-stone-900 border border-stone-200/50">
                    Services Showcase
                  </span>
                  <h2 className="text-3xl md:text-4xl font-sans font-extrabold text-stone-950 tracking-tighter">
                    Specialized Beauty Highlights
                  </h2>
                  <p className="text-stone-500 text-xs sm:text-sm max-w-2xl mx-auto font-medium">
                    Inspired by our direct Aligarh Instagram studio showcase, explore each signature look category curated to meet your specific cosmetic vision.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {highlights.map((highlight) => (
                    <div
                      key={highlight.id}
                      className="group bg-white border border-stone-100 rounded-3xl p-8 hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 flex flex-col justify-between"
                      id={`card-highlight-${highlight.id}`}
                    >
                      <div className="space-y-5">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden border border-stone-200 mx-auto sm:mx-0">
                          <img
                            src={highlight.image}
                            alt={highlight.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="space-y-2 text-center sm:text-left">
                          <h3 className="font-sans font-extrabold text-lg text-stone-900 tracking-tight">
                            {highlight.title}
                          </h3>
                          <p className="text-stone-400 text-xs leading-relaxed font-medium">
                            {highlight.description}
                          </p>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-stone-100 mt-6 flex justify-center sm:justify-start">
                        <button
                          onClick={() => handleExploreLook(highlight.id)}
                          className="text-stone-950 hover:text-stone-500 font-extrabold text-xs tracking-wider uppercase flex items-center gap-1.5 transition-colors focus:outline-none"
                        >
                          <span>Explore Looks</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Certified Banner Section */}
              <section className="bg-[#FAF9F6] py-16 border-y border-stone-200/60" id="home-credentials">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex flex-col lg:flex-row gap-12 items-center justify-between">
                    <div className="space-y-4 max-w-2xl text-center lg:text-left">
                      <h2 className="text-3xl font-serif font-bold text-stone-900 leading-tight">
                        Certified Professional Craftsmanship
                      </h2>
                      <p className="text-stone-600 text-sm leading-relaxed">
                        To guarantee the safest, most professional, and photogenic makeup and styling services, Nikita Mohini maintains a prestigious certification from the VLCC Institute, backed by continuous workshops in advanced hair Nanoplastia, professional nail art, and elite bridal transformations.
                      </p>
                      <div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-2">
                        {brandInfo.certifications.map((cert) => (
                          <span
                            key={cert}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-stone-200 text-stone-700"
                          >
                            <Award className="w-3.5 h-3.5 text-stone-950" />
                            <span>{cert}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto justify-center">
                      <button
                        onClick={() => setCurrentPage("about")}
                        className="px-8 py-3.5 bg-black hover:bg-stone-800 text-white rounded-full text-xs font-bold tracking-wider transition-all duration-300 shadow-sm cursor-pointer"
                      >
                        Read Artist Biography
                      </button>
                      <button
                        onClick={() => setCurrentPage("bookings")}
                        className="px-8 py-3.5 bg-white border border-stone-200 hover:border-stone-400 text-stone-900 rounded-full text-xs font-bold tracking-wider transition-all duration-300 cursor-pointer"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Client Testimonials Section */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16" id="home-testimonials">
                <div className="text-center space-y-4">
                  <span className="inline-block px-3 py-1 bg-stone-100 text-[10px] font-bold uppercase tracking-widest rounded-sm text-stone-900 border border-stone-200/50">
                    Client Praise
                  </span>
                  <h2 className="text-3xl md:text-4xl font-sans font-extrabold text-stone-950 tracking-tighter">
                    Words from Our Brides
                  </h2>
                  <p className="text-stone-500 text-xs sm:text-sm max-w-2xl mx-auto font-medium">
                    Read the real, unsolicited feedback from clients who experienced the signature Redz Salon luxury transformation.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {testimonials.map((t) => (
                    <div
                      key={t.id}
                      className="bg-white border border-stone-100 rounded-3xl p-8 hover:shadow-[0_8px_30px_rgb(0,0,0,0.015)] transition-all duration-300 flex flex-col justify-between"
                      id={`testimonial-card-${t.id}`}
                    >
                      <div className="space-y-6">
                        <div className="flex gap-1 text-stone-950">
                          {[...Array(t.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-stone-950" />
                          ))}
                        </div>
                        <p className="text-stone-600 text-xs sm:text-sm italic leading-relaxed font-medium">
                          "{t.review}"
                        </p>
                      </div>

                      <div className="pt-6 border-t border-stone-100 mt-8 flex justify-between items-center text-xs">
                        <div>
                          <p className="font-extrabold text-stone-900">{t.name}</p>
                          <p className="text-stone-400 mt-0.5 font-medium">{t.role}</p>
                        </div>
                        <span className="text-stone-400 font-mono text-[10px] font-semibold">{t.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* FAQ Accordion Section */}
              <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12" id="home-faqs">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl md:text-4xl font-sans font-extrabold text-stone-950 tracking-tighter">
                    Frequently Asked Questions
                  </h2>
                  <p className="text-stone-500 text-xs sm:text-sm font-medium">
                    Have questions about dates, cosmetics, booking procedures, or safety standards? We have you covered.
                  </p>
                </div>

                <div className="space-y-4 border-t border-stone-100 pt-8">
                  {FAQs.map((faq, idx) => {
                    const isOpen = activeFAQ === idx;
                    return (
                      <div
                        key={idx}
                        className="bg-white border border-stone-100 rounded-2xl overflow-hidden transition-all duration-300"
                        id={`faq-${idx}`}
                      >
                        <button
                          onClick={() => toggleFAQ(idx)}
                          className="w-full px-6 py-5 text-left flex justify-between items-center gap-4 hover:bg-stone-50/50 transition focus:outline-none"
                          id={`faq-btn-${idx}`}
                        >
                          <span className="font-sans font-extrabold text-stone-900 text-sm sm:text-base tracking-tight">
                            {faq.question}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-stone-400 shrink-0 transition-transform duration-300 ${
                              isOpen ? "rotate-180 text-stone-950" : ""
                            }`}
                          />
                        </button>
                        
                        {isOpen && (
                          <div className="px-6 pb-5 text-stone-500 text-xs sm:text-sm leading-relaxed border-t border-stone-50 pt-4 animate-fade-in font-medium">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Call to Action Booking Panel */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="home-cta">
                <div className="bg-stone-950 text-white rounded-3xl p-10 md:p-16 text-center space-y-8 relative overflow-hidden">
                  <div className="relative z-10 max-w-2xl mx-auto space-y-5">
                    <h2 className="text-3xl md:text-5xl font-sans font-extrabold tracking-tighter leading-tight">
                      Ready to Create Your Dream Bridal Look?
                    </h2>
                    <p className="text-stone-400 text-xs sm:text-sm leading-relaxed font-medium">
                      Dates for the upcoming wedding season are filling up quickly. Fill out our simple booking form to calculate your customized pricing options instantly.
                    </p>
                    <div className="pt-6 flex flex-wrap justify-center gap-4">
                      <button
                        onClick={() => setCurrentPage("bookings")}
                        className="px-8 py-3.5 bg-white hover:bg-stone-100 text-stone-950 rounded-full text-xs font-bold tracking-wider transition-all duration-300 cursor-pointer shadow-sm"
                      >
                        Calculate Package & Book
                      </button>
                      <button
                        onClick={() => setCurrentPage("portfolio")}
                        className="px-8 py-3.5 bg-stone-900 hover:bg-stone-800 text-white border border-stone-800 rounded-full text-xs font-bold tracking-wider transition-all duration-300 cursor-pointer"
                      >
                        Explore Looks Library
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {currentPage === "portfolio" && (
            <motion.div
              key="portfolio"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12"
            >
              <div className="text-center space-y-4">
                <span className="inline-block px-3 py-1 bg-stone-100 text-[10px] font-bold uppercase tracking-widest rounded-sm text-stone-900 border border-stone-200/50">
                  Look Portfolio
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-extrabold text-stone-950 tracking-tighter">
                  Our Bridal & Glam Library
                </h1>
                <p className="text-stone-500 text-xs sm:text-sm max-w-xl mx-auto font-medium">
                  Filter through our premium beauty gallery. Click any look card to view styling secrets, accessory details, and specialized cosmetics notes.
                </p>
              </div>

              <PortfolioGrid
                selectedCategory={portfolioCategory}
                setSelectedCategory={setPortfolioCategory}
              />
            </motion.div>
          )}

          {currentPage === "services" && (
            <motion.div
              key="services"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-16"
            >
              <div className="text-center space-y-4">
                <span className="inline-block px-3 py-1 bg-stone-100 text-[10px] font-bold uppercase tracking-widest rounded-sm text-stone-900 border border-stone-200/50">
                  Pricing & Workshops
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-extrabold text-stone-950 tracking-tighter">
                  Transparent Packages
                </h1>
                <p className="text-stone-500 text-xs sm:text-sm max-w-xl mx-auto font-medium">
                  Premium luxury services designed to match various events and learning curves. All bookings include clean hygiene protocols.
                </p>
              </div>

              {/* Service Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="services-packages-grid">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className={`bg-white border rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                      service.popular
                        ? "border-stone-950 shadow-md ring-1 ring-stone-950/20 relative"
                        : "border-stone-100"
                    }`}
                    id={`package-${service.id}`}
                  >
                    {service.popular && (
                      <span className="absolute top-0 right-8 -translate-y-1/2 bg-stone-950 text-white text-[9px] font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm">
                        Most Requested Look
                      </span>
                    )}

                    <div className="space-y-6">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400 font-mono block">
                          {service.category} SPEC
                        </span>
                        <h3 className="text-2xl font-sans font-extrabold text-stone-900 mt-1.5 tracking-tight">
                          {service.title}
                        </h3>
                        <p className="text-stone-500 text-xs mt-1.5 leading-relaxed font-medium">
                          {service.description}
                        </p>
                      </div>

                      {/* Pricing */}
                      <div className="flex items-baseline gap-1.5 py-4 border-y border-stone-100">
                        <span className="text-3xl md:text-4xl font-sans font-extrabold text-stone-950 tracking-tighter">
                          {service.price}
                        </span>
                        {service.priceSuffix && (
                          <span className="text-xs text-stone-400 italic font-medium">
                            / {service.priceSuffix}
                          </span>
                        )}
                      </div>

                      {/* Inclusions */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider font-mono">
                          What's Included:
                        </h4>
                        <ul className="space-y-2 text-stone-550 text-xs sm:text-sm font-medium">
                          {service.inclusions.map((inc, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                              <span className="text-stone-950 font-bold text-xs shrink-0 mt-0.5">✓</span>
                              <span>{inc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-stone-100 mt-8 flex flex-col gap-3">
                      <button
                        onClick={() => setCurrentPage("bookings")}
                        className={`w-full font-bold py-3.5 px-4 rounded-full text-xs tracking-wider uppercase transition-all duration-300 text-center shadow-sm ${
                          service.popular
                            ? "bg-black hover:bg-stone-800 text-white"
                            : "bg-white hover:bg-stone-50 border border-stone-200 text-stone-950"
                        }`}
                      >
                        Select package & calculate
                      </button>
                      <a
                        href={`https://wa.me/910000000000?text=Hi%20Nikita%20Mohini%20|%20Redz%20Salon!%20I%20would%20like%20to%20ask%20about%20availability%20for%20the%20%22${encodeURIComponent(service.title)}%22%20package.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full text-center text-[10px] font-extrabold uppercase tracking-widest text-stone-950 hover:text-stone-500 transition-colors pt-2"
                      >
                        Ask questions on WhatsApp
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {currentPage === "about" && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-16"
            >
              {/* Instagram Profile widget explicitly requested via screenshot */}
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <span className="inline-block px-3 py-1 bg-stone-100 text-[10px] font-bold uppercase tracking-widest rounded-sm text-stone-900 border border-stone-200/50">
                    Social Identity
                  </span>
                  <h1 className="text-4xl md:text-5xl font-sans font-extrabold text-stone-950 tracking-tighter">
                    Verified Instagram Profile
                  </h1>
                  <p className="text-stone-500 text-xs sm:text-sm max-w-xl mx-auto font-medium">
                    Direct access to our digital studio portfolio. View real-time milestones, follower interactions, and highlight category selections.
                  </p>
                </div>

                <InstagramWidget
                  onSelectCategory={handleExploreLook}
                  activeCategory={portfolioCategory}
                />
              </div>

              {/* Bio Storytelling and Philosophy */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-12 border-t border-stone-200/60 items-center">
                <div className="lg:col-span-5 relative">
                  <div className="aspect-[3/4] rounded-3xl overflow-hidden border border-stone-100 bg-stone-50 shadow-sm relative">
                    <img
                      src="https://i.ibb.co/CKMXMVML/050ae39d-1887-4cd6-82a3-09918b30b043.png"
                      alt="Nikita Mohini in her salon"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-6">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest font-mono block">
                    The Artist Philosophy
                  </span>
                  
                  <h2 className="text-3xl md:text-4xl font-sans font-extrabold text-stone-950 leading-tight tracking-tight">
                    "Highlighting Your Natural Radiance, Never Masking It"
                  </h2>

                  <div className="text-stone-550 text-xs sm:text-sm space-y-4 leading-relaxed font-medium">
                    {brandInfo.bio.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>

                  <div className="space-y-4 pt-4 border-t border-stone-150">
                    <h3 className="font-sans font-extrabold text-stone-900 text-base">
                      Professional Standards Guaranteed:
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-500 font-medium">
                      <div className="flex items-center gap-2.5">
                        <span className="text-stone-950 font-bold">✓</span>
                        <span>Dermatologist tested hypoallergenic bases</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-stone-950 font-bold">✓</span>
                        <span>Fully sanitized single-use spoolies & brushes</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-stone-950 font-bold">✓</span>
                        <span>Tailored color profiles for South Asian undertones</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-stone-950 font-bold">✓</span>
                        <span>Outstation bridal travel ready across India</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentPage === "bookings" && (
            <motion.div
              key="bookings"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12"
            >
              <div className="text-center space-y-4">
                <span className="inline-block px-3 py-1 bg-stone-100 text-[10px] font-bold uppercase tracking-widest rounded-sm text-stone-900 border border-stone-200/50">
                  Secure Calendar Booking
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-extrabold text-stone-950 tracking-tighter">
                  Inquire Event Schedule
                </h1>
                <p className="text-stone-500 text-xs sm:text-sm max-w-xl mx-auto font-medium">
                  Provide your wedding/event date and cosmetics profile. We will calculate an immediate estimate and formulate a direct message booking contract.
                </p>
              </div>

              <BookingForm />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Dynamic Footer */}
      <Footer setCurrentPage={setCurrentPage} />

      {/* Admin Panel Console */}
      <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
    </div>
  );
}
