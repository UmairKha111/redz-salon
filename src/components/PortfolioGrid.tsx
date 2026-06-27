import React, { useState } from "react";
import { useCMSData, PortfolioItem } from "../data/cmsData";
import { Sparkles, Eye, X, Heart, ExternalLink } from "lucide-react";

interface PortfolioGridProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export default function PortfolioGrid({ selectedCategory, setSelectedCategory }: PortfolioGridProps) {
  const { portfolioItems } = useCMSData();
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const filterTabs = [
    { id: "all", label: "All Services" },
    { id: "nails", label: "Nails" },
    { id: "hair", label: "Hair Treatments" },
    { id: "makeup", label: "Makeup" },
    { id: "mehendi", label: "Bridal Mehendi" },
    { id: "skin", label: "Skin Care" }
  ];

  const filteredItems = selectedCategory === "all"
    ? portfolioItems
    : portfolioItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="space-y-10" id="portfolio-grid-container">
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2 border-b border-stone-100 pb-6">
        {filterTabs.map((tab) => {
          const isActive = selectedCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition duration-300 focus:outline-none ${
                isActive
                  ? "bg-black text-white shadow-sm"
                  : "bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-950"
              }`}
              id={`filter-tab-${tab.id}`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Looks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="portfolio-items-grid">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group bg-white border border-stone-100 rounded-3xl overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 flex flex-col cursor-pointer"
            onClick={() => setSelectedItem(item)}
            id={`look-${item.id}`}
          >
            {/* Look Image Thumbnail with Hover Overlays */}
            <div className="relative overflow-hidden aspect-[3/4] bg-stone-50">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-stone-950/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/25 backdrop-blur-md text-white flex items-center justify-center border border-white/30 transform scale-90 group-hover:scale-100 transition-transform duration-300">
                  <Eye className="w-5 h-5" />
                </div>
              </div>
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-sm text-[9px] font-bold text-stone-950 tracking-wider uppercase border border-stone-100">
                {item.category.replace("-", " ")}
              </div>
            </div>

            {/* Look Metadata */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="font-sans font-extrabold text-lg text-stone-950 leading-tight tracking-tight">
                  {item.title}
                </h3>
                <p className="text-stone-400 text-xs line-clamp-2 leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-sm font-semibold tracking-wide uppercase"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dynamic Detail Zoom Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-fade-in" id="look-modal">
          <div className="relative bg-white rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row shadow-2xl border border-stone-100 animate-slide-up">
            
            {/* Modal Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-stone-950/60 hover:bg-stone-950/80 text-white flex items-center justify-center transition focus:outline-none"
              id="close-modal-btn"
            >
              <X className="w-4 h-4" />
            </button>

            {/* High-Resolution Zoom Image */}
            <div className="md:w-1/2 aspect-[3/4] md:aspect-auto bg-stone-50 relative">
              <img
                src={selectedItem.image}
                alt={selectedItem.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Detailed Look Review Panel */}
            <div className="p-8 md:w-1/2 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <span className="inline-block px-3 py-1 bg-stone-100 text-[10px] font-bold uppercase tracking-widest rounded-sm text-stone-900 border border-stone-200/50">
                    {selectedItem.category.replace("-", " ")} Look Spec
                  </span>
                  <h2 className="text-2xl md:text-3xl font-sans font-extrabold text-stone-950 mt-4 leading-tight tracking-tight">
                    {selectedItem.title}
                  </h2>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider font-mono">
                    Artistry & Design Notes
                  </h4>
                  <p className="text-stone-550 text-xs sm:text-sm leading-relaxed font-medium">
                    {selectedItem.description}
                  </p>
                </div>

                <div className="space-y-3.5">
                  <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider font-mono">
                    Key Features Implemented
                  </h4>
                  <ul className="text-xs sm:text-sm text-stone-600 space-y-2.5 font-medium">
                    {selectedItem.tags.map((tag) => (
                      <li key={tag} className="flex items-center gap-2">
                        <span className="text-stone-950 font-bold text-xs shrink-0">✓</span>
                        <span>Professional {tag} custom blending</span>
                      </li>
                    ))}
                    <li className="flex items-center gap-2">
                      <span className="text-stone-950 font-bold text-xs shrink-0">✓</span>
                      <span>VLCC certified skin shielding pre-primer</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Action buttons inside Modal */}
              <div className="pt-8 border-t border-stone-100 flex gap-3">
                <a
                  href={`https://wa.me/910000000000?text=Hi%20Nikita%20Mohini%20|%20Redz%20Salon!%20I%20saw%20your%20service%20%22${encodeURIComponent(selectedItem.title)}%22%20on%20your%20website%20and%20wanted%20to%20inquire%20about%20booking%20this%20for%20my%20session.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-black hover:bg-stone-800 text-white rounded-full font-bold py-3.5 px-4 transition-all duration-300 text-center text-xs flex items-center justify-center gap-1.5 shadow-sm"
                >
                  Request Similar Look
                </a>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="border border-stone-200 text-stone-950 hover:bg-stone-50 font-bold py-3.5 px-5 rounded-full transition text-xs"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
