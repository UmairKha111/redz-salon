import React, { useState, useRef } from "react";
import { useCMSData, PortfolioItem, ServicePackage, BrandInfo } from "../data/cmsData";
import { 
  Lock, 
  Settings, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  Upload, 
  RefreshCw, 
  Copy, 
  Check, 
  X, 
  Image as ImageIcon,
  CheckCircle,
  FileText,
  Sparkles,
  Link as LinkIcon
} from "lucide-react";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "gallery" | "services" | "profile" | "export";

export default function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const { 
    brandInfo, 
    portfolioItems, 
    services, 
    updateBrandInfo, 
    updatePortfolioItems, 
    updateServices,
    resetAllToDefaults,
    exportAsTSCode 
  } = useCMSData();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("gallery");
  
  // Exporter states
  const [isCopied, setIsCopied] = useState(false);

  // Editing state for portfolio items
  const [isAddingPortfolio, setIsAddingPortfolio] = useState(false);
  const [editingPortfolioId, setEditingPortfolioId] = useState<string | null>(null);
  const [portfolioForm, setPortfolioForm] = useState<Partial<PortfolioItem>>({
    title: "",
    category: "nails",
    image: "",
    description: "",
    tags: []
  });

  // Editing state for services
  const [isAddingService, setIsAddingService] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceForm, setServiceForm] = useState<Partial<ServicePackage>>({
    title: "",
    price: "",
    priceSuffix: "",
    description: "",
    popular: false,
    inclusions: [],
    category: "nails"
  });

  // Profile Form state
  const [profileForm, setProfileForm] = useState<BrandInfo>({ ...brandInfo });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string>("");

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === "redz@123") {
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Incorrect passcode. Hint: use 'redz@123'.");
    }
  };

  // Image upload to base64 conversion with lightweight compression
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Use a friendly canvas-based downscaler/compressor
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Max dimension for portfolio presentation (perfectly sharp on screens)
        const MAX_WIDTH = 900;
        const MAX_HEIGHT = 900;
        
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Export as compressed JPEG (0.7 quality is extremely lightweight and crisp)
          const base64String = canvas.toDataURL('image/jpeg', 0.7);
          setPreviewImage(base64String);
          setPortfolioForm(prev => ({ ...prev, image: base64String }));
        } else {
          // Fallback if canvas context fails
          const base64String = event.target?.result as string;
          setPreviewImage(base64String);
          setPortfolioForm(prev => ({ ...prev, image: base64String }));
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Portfolio actions
  const handleSavePortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!portfolioForm.title || !portfolioForm.description) {
      alert("Please fill in the title and description.");
      return;
    }

    const itemImage = portfolioForm.image || "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80";

    if (editingPortfolioId) {
      // Edit
      const updated = portfolioItems.map(item => 
        item.id === editingPortfolioId 
          ? { ...item, ...portfolioForm, image: itemImage } as PortfolioItem
          : item
      );
      updatePortfolioItems(updated);
      setEditingPortfolioId(null);
    } else {
      // Add
      const newItem: PortfolioItem = {
        id: "p_" + Date.now(),
        title: portfolioForm.title,
        category: portfolioForm.category as any,
        image: itemImage,
        description: portfolioForm.description,
        tags: portfolioForm.tags || []
      };
      updatePortfolioItems([newItem, ...portfolioItems]);
      setIsAddingPortfolio(false);
    }

    // Reset form
    setPortfolioForm({
      title: "",
      category: "nails",
      image: "",
      description: "",
      tags: []
    });
    setPreviewImage("");
  };

  const handleEditPortfolioClick = (item: PortfolioItem) => {
    setEditingPortfolioId(item.id);
    setIsAddingPortfolio(false);
    setPortfolioForm(item);
    setPreviewImage(item.image);
    setActiveTab("gallery");
  };

  const handleDeletePortfolio = (id: string) => {
    if (confirm("Are you sure you want to delete this portfolio item?")) {
      const updated = portfolioItems.filter(item => item.id !== id);
      updatePortfolioItems(updated);
    }
  };

  // Service actions
  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.title || !serviceForm.price) {
      alert("Please fill in the title and price.");
      return;
    }

    if (editingServiceId) {
      const updated = services.map(s => 
        s.id === editingServiceId 
          ? { ...s, ...serviceForm } as ServicePackage
          : s
      );
      updateServices(updated);
      setEditingServiceId(null);
    } else {
      const newService: ServicePackage = {
        id: "s_" + Date.now(),
        title: serviceForm.title || "",
        price: serviceForm.price || "",
        priceSuffix: serviceForm.priceSuffix || "session",
        description: serviceForm.description || "",
        popular: !!serviceForm.popular,
        inclusions: serviceForm.inclusions || [],
        category: (serviceForm.category || "nails") as any
      };
      updateServices([...services, newService]);
      setIsAddingService(false);
    }

    setServiceForm({
      title: "",
      price: "",
      priceSuffix: "",
      description: "",
      popular: false,
      inclusions: [],
      category: "nails"
    });
  };

  const handleEditServiceClick = (service: ServicePackage) => {
    setEditingServiceId(service.id);
    setIsAddingService(false);
    setServiceForm(service);
    setActiveTab("services");
  };

  const handleDeleteService = (id: string) => {
    if (confirm("Are you sure you want to delete this service package?")) {
      const updated = services.filter(s => s.id !== id);
      updateServices(updated);
    }
  };

  // Profile actions
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateBrandInfo(profileForm);
    alert("Profile saved successfully to your local cache!");
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(exportAsTSCode());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-stone-200" id="admin-panel-container">
        
        {/* Header Bar */}
        <div className="bg-stone-950 text-white px-6 py-4 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-stone-400" />
            <h2 className="font-sans font-extrabold text-lg tracking-tight">Redz Salon Admin Console</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-stone-400 hover:text-white transition p-1 hover:bg-stone-800 rounded-full"
            id="close-admin-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isAuthenticated ? (
          /* Authentication Screen */
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-stone-50">
            <form onSubmit={handleLogin} className="w-full max-w-sm bg-white border border-stone-200 p-8 rounded-2xl shadow-sm space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-900">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="font-sans font-extrabold text-xl text-stone-900">Enter Admin Passcode</h3>
                <p className="text-stone-400 text-xs font-medium">Please enter passcode to modify salon details</p>
              </div>

              <div className="space-y-1.5">
                <input 
                  type="password"
                  placeholder="Passcode (Hint: redz@123)"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 text-sm text-center focus:outline-none focus:ring-1 focus:ring-black focus:bg-white transition text-stone-900"
                  autoFocus
                />
                {loginError && <p className="text-rose-500 text-[11px] text-center font-semibold">{loginError}</p>}
              </div>

              <button 
                type="submit"
                className="w-full bg-black text-white hover:bg-stone-800 transition py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm"
              >
                Authenticate
              </button>
            </form>
          </div>
        ) : (
          /* Main Dashboard */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar Navigation */}
            <div className="w-full md:w-56 bg-stone-50 border-r border-stone-150 p-4 flex flex-row md:flex-col gap-1 md:gap-2 overflow-x-auto shrink-0">
              <button 
                onClick={() => { setActiveTab("gallery"); setIsAddingPortfolio(false); setEditingPortfolioId(null); }}
                className={`flex-1 md:flex-initial text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 ${activeTab === "gallery" ? "bg-black text-white" : "text-stone-600 hover:bg-stone-200/50 hover:text-stone-900"}`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Gallery & Images</span>
              </button>
              <button 
                onClick={() => { setActiveTab("services"); setIsAddingService(false); setEditingServiceId(null); }}
                className={`flex-1 md:flex-initial text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 ${activeTab === "services" ? "bg-black text-white" : "text-stone-600 hover:bg-stone-200/50 hover:text-stone-900"}`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Services</span>
              </button>
              <button 
                onClick={() => setActiveTab("profile")}
                className={`flex-1 md:flex-initial text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 ${activeTab === "profile" ? "bg-black text-white" : "text-stone-600 hover:bg-stone-200/50 hover:text-stone-900"}`}
              >
                <FileText className="w-4 h-4" />
                <span>Salon Bio</span>
              </button>
              <button 
                onClick={() => setActiveTab("export")}
                className={`flex-1 md:flex-initial text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 ${activeTab === "export" ? "bg-black text-white text-emerald-300" : "text-stone-600 hover:bg-stone-200/50 hover:text-stone-900"}`}
              >
                <RefreshCw className="w-4 h-4" />
                <span>Vercel Export</span>
              </button>

              <div className="hidden md:block mt-auto pt-6 border-t border-stone-200">
                <button 
                  onClick={() => {
                    if (confirm("Reset all customizations? This restores the initial VLCC/Redz Salon default settings.")) {
                      resetAllToDefaults();
                      setProfileForm({ ...brandInfo });
                      alert("Successfully restored defaults.");
                    }
                  }}
                  className="w-full text-left text-stone-400 hover:text-rose-600 transition px-4 py-2.5 text-[10px] uppercase font-bold tracking-widest"
                >
                  Reset Defaults
                </button>
              </div>
            </div>

            {/* Sub-tab view area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-white">
              
              {/* GALLERY MANAGER */}
              {activeTab === "gallery" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                    <div>
                      <h3 className="font-sans font-extrabold text-xl text-stone-900">Manage Portfolio Images</h3>
                      <p className="text-stone-400 text-xs font-medium">Upload custom designs or choose categories</p>
                    </div>
                    {!isAddingPortfolio && !editingPortfolioId && (
                      <button 
                        onClick={() => {
                          setIsAddingPortfolio(true);
                          setPortfolioForm({ title: "", category: "nails", image: "", description: "", tags: [] });
                          setPreviewImage("");
                        }}
                        className="bg-black hover:bg-stone-800 text-white rounded-full px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add New Item
                      </button>
                    )}
                  </div>

                  {/* Form for adding/editing a portfolio item */}
                  {(isAddingPortfolio || editingPortfolioId) ? (
                    <form onSubmit={handleSavePortfolio} className="bg-stone-50 p-6 rounded-2xl border border-stone-200 space-y-5">
                      <h4 className="font-sans font-extrabold text-base text-stone-900">
                        {editingPortfolioId ? "Edit Look Item" : "Create New Look Item"}
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block">Look Title</label>
                            <input 
                              type="text"
                              value={portfolioForm.title || ""}
                              onChange={e => setPortfolioForm(prev => ({ ...prev, title: e.target.value }))}
                              placeholder="e.g., Luxury Gold Glitter Nail Set"
                              className="w-full bg-white border border-stone-200 rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:ring-1 focus:ring-black text-stone-900"
                              required
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block">Category</label>
                            <select 
                              value={portfolioForm.category || "nails"}
                              onChange={e => setPortfolioForm(prev => ({ ...prev, category: e.target.value as any }))}
                              className="w-full bg-white border border-stone-200 rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:ring-1 focus:ring-black text-stone-700"
                            >
                              <option value="nails">Nails & Extensions</option>
                              <option value="hair">Hair Treatments</option>
                              <option value="makeup">Makeup & Glam</option>
                              <option value="mehendi">Bridal Mehendi</option>
                              <option value="skin">Skin Care</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block">Tags (comma-separated)</label>
                            <input 
                              type="text"
                              value={portfolioForm.tags?.join(", ") || ""}
                              onChange={e => setPortfolioForm(prev => ({ ...prev, tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) }))}
                              placeholder="e.g., Acrylic, Gold, Glamour"
                              className="w-full bg-white border border-stone-200 rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:ring-1 focus:ring-black text-stone-900"
                            />
                          </div>
                        </div>

                        {/* Image Uploader */}
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block">Image Source</label>
                            
                            <div className="flex gap-2">
                              <input 
                                type="text"
                                value={portfolioForm.image || ""}
                                onChange={e => {
                                  setPortfolioForm(prev => ({ ...prev, image: e.target.value }));
                                  setPreviewImage(e.target.value);
                                }}
                                placeholder="Paste Image URL or select file upload below"
                                className="flex-1 bg-white border border-stone-200 rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:ring-1 focus:ring-black text-stone-900"
                              />
                            </div>

                            <div className="pt-2">
                              <input 
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageFileChange}
                                accept="image/*"
                                className="hidden"
                              />
                              <button 
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full border-2 border-dashed border-stone-200 hover:border-black rounded-xl p-6 flex flex-col items-center justify-center gap-2 bg-white transition group cursor-pointer"
                              >
                                {previewImage ? (
                                  <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-stone-100 shadow-sm">
                                    <img src={previewImage} className="w-full h-full object-cover" alt="Preview" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                      <Upload className="w-4 h-4 text-white" />
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <Upload className="w-6 h-6 text-stone-400 group-hover:text-black transition" />
                                    <span className="text-xs font-bold text-stone-500 group-hover:text-black">Upload Real Image (converts to Base64)</span>
                                    <span className="text-[9px] text-stone-400">Lightweight JPG/PNG under 2MB recommended</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1 pt-1">
                        <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block">Description & Styling Notes</label>
                        <textarea 
                          value={portfolioForm.description || ""}
                          onChange={e => setPortfolioForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Provide a detailed description of the custom work, cosmetic standards, and materials used."
                          className="w-full bg-white border border-stone-200 rounded-xl py-3 px-4 text-xs focus:outline-none focus:ring-1 focus:ring-black text-stone-900 h-24 resize-none"
                          required
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-4 border-t border-stone-200/50">
                        <button 
                          type="button"
                          onClick={() => {
                            setIsAddingPortfolio(false);
                            setEditingPortfolioId(null);
                            setPreviewImage("");
                          }}
                          className="px-6 py-2.5 rounded-full border border-stone-200 text-stone-600 hover:bg-stone-50 transition text-xs font-bold uppercase tracking-wider"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit"
                          className="px-6 py-2.5 rounded-full bg-black hover:bg-stone-800 text-white transition text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
                        >
                          <Save className="w-3.5 h-3.5" />
                          Save Look
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* Look Cards list */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {portfolioItems.map((item) => (
                        <div key={item.id} className="border border-stone-150 rounded-2xl p-4 flex gap-4 hover:border-stone-400 transition bg-stone-50/50">
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-20 h-20 rounded-xl object-cover shrink-0 bg-stone-100"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start gap-2">
                                <h5 className="font-sans font-extrabold text-sm text-stone-900 line-clamp-1">{item.title}</h5>
                                <span className="bg-stone-200 text-stone-800 text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-sm shrink-0">
                                  {item.category}
                                </span>
                              </div>
                              <p className="text-stone-400 text-xs line-clamp-2 mt-1">{item.description}</p>
                            </div>
                            
                            <div className="flex justify-end gap-2 pt-2 border-t border-stone-100 mt-2">
                              <button 
                                onClick={() => handleEditPortfolioClick(item)}
                                className="text-stone-500 hover:text-stone-950 p-1 rounded hover:bg-stone-100 transition text-[10px] font-bold uppercase flex items-center gap-0.5"
                              >
                                <Edit className="w-3 h-3" />
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDeletePortfolio(item.id)}
                                className="text-rose-500 hover:text-rose-700 p-1 rounded hover:bg-stone-100 transition text-[10px] font-bold uppercase flex items-center gap-0.5"
                              >
                                <Trash2 className="w-3 h-3" />
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SERVICES MANAGER */}
              {activeTab === "services" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                    <div>
                      <h3 className="font-sans font-extrabold text-xl text-stone-900">Manage Service Packages</h3>
                      <p className="text-stone-400 text-xs font-medium">Add services, edit pricing, and listing specifications</p>
                    </div>
                    {!isAddingService && !editingServiceId && (
                      <button 
                        onClick={() => {
                          setIsAddingService(true);
                          setServiceForm({ title: "", price: "", priceSuffix: "session", description: "", popular: false, inclusions: [], category: "nails" });
                        }}
                        className="bg-black hover:bg-stone-800 text-white rounded-full px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Service
                      </button>
                    )}
                  </div>

                  {(isAddingService || editingServiceId) ? (
                    <form onSubmit={handleSaveService} className="bg-stone-50 p-6 rounded-2xl border border-stone-200 space-y-5">
                      <h4 className="font-sans font-extrabold text-base text-stone-900">
                        {editingServiceId ? "Edit Service" : "Create New Service"}
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block">Service Title</label>
                            <input 
                              type="text"
                              value={serviceForm.title || ""}
                              onChange={e => setServiceForm(prev => ({ ...prev, title: e.target.value }))}
                              placeholder="e.g., Luxury Acrylic Extension & Overlay"
                              className="w-full bg-white border border-stone-200 rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:ring-1 focus:ring-black text-stone-900"
                              required
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block">Price (e.g., ₹3,500)</label>
                              <input 
                                type="text"
                                value={serviceForm.price || ""}
                                onChange={e => setServiceForm(prev => ({ ...prev, price: e.target.value }))}
                                placeholder="₹3,500"
                                className="w-full bg-white border border-stone-200 rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:ring-1 focus:ring-black text-stone-900"
                                required
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block">Suffix (e.g., full set)</label>
                              <input 
                                type="text"
                                value={serviceForm.priceSuffix || ""}
                                onChange={e => setServiceForm(prev => ({ ...prev, priceSuffix: e.target.value }))}
                                placeholder="full set"
                                className="w-full bg-white border border-stone-200 rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:ring-1 focus:ring-black text-stone-900"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block">Category</label>
                              <select 
                                value={serviceForm.category || "nails"}
                                onChange={e => setServiceForm(prev => ({ ...prev, category: e.target.value as any }))}
                                className="w-full bg-white border border-stone-200 rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:ring-1 focus:ring-black text-stone-750"
                              >
                                <option value="nails">Nails</option>
                                <option value="hair">Hair Treatments</option>
                                <option value="makeup">Makeup & Glam</option>
                                <option value="mehendi">Bridal Mehendi</option>
                                <option value="skin">Skin Care</option>
                              </select>
                            </div>
                            <div className="flex items-center pt-5 pl-1 gap-2">
                              <input 
                                type="checkbox"
                                id="popular-chk"
                                checked={!!serviceForm.popular}
                                onChange={e => setServiceForm(prev => ({ ...prev, popular: e.target.checked }))}
                                className="w-4 h-4 accent-black"
                              />
                              <label htmlFor="popular-chk" className="text-xs font-bold text-stone-700 uppercase cursor-pointer">Most Requested</label>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block">Inclusions / Bullet Points (one per line)</label>
                            <textarea 
                              value={serviceForm.inclusions?.join("\n") || ""}
                              onChange={e => setServiceForm(prev => ({ ...prev, inclusions: e.target.value.split("\n").map(l => l.trim()).filter(Boolean) }))}
                              placeholder="Premium acrylic extensions&#10;Cuticle prep & file&#10;High durability top coat"
                              className="w-full bg-white border border-stone-200 rounded-xl py-3 px-4 text-xs focus:outline-none focus:ring-1 focus:ring-black text-stone-900 h-40 resize-none"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block">Service Short Description</label>
                        <input 
                          type="text"
                          value={serviceForm.description || ""}
                          onChange={e => setServiceForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Short summary of the package details..."
                          className="w-full bg-white border border-stone-200 rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:ring-1 focus:ring-black text-stone-900"
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-4 border-t border-stone-200/50">
                        <button 
                          type="button"
                          onClick={() => {
                            setIsAddingService(false);
                            setEditingServiceId(null);
                          }}
                          className="px-6 py-2.5 rounded-full border border-stone-200 text-stone-600 hover:bg-stone-50 transition text-xs font-bold uppercase tracking-wider"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit"
                          className="px-6 py-2.5 rounded-full bg-black hover:bg-stone-800 text-white transition text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
                        >
                          <Save className="w-3.5 h-3.5" />
                          Save Service
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* Services list */
                    <div className="space-y-3">
                      {services.map(s => (
                        <div key={s.id} className="border border-stone-150 rounded-2xl p-4 flex items-center justify-between bg-stone-50/50 hover:border-stone-400 transition">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] uppercase font-extrabold text-stone-400 tracking-wider block font-mono">
                                {s.category}
                              </span>
                              {s.popular && (
                                <span className="bg-stone-950 text-white text-[7px] font-extrabold uppercase px-1.5 py-0.5 rounded-full">
                                  Popular
                                </span>
                              )}
                            </div>
                            <h4 className="font-sans font-extrabold text-base text-stone-900 mt-1">{s.title}</h4>
                            <p className="text-stone-500 text-xs mt-0.5">{s.description}</p>
                            <span className="text-stone-900 font-extrabold text-xs block mt-1.5">{s.price} / {s.priceSuffix}</span>
                          </div>

                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleEditServiceClick(s)}
                              className="text-stone-500 hover:text-stone-950 p-2 rounded-lg hover:bg-stone-100 transition"
                              title="Edit service"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteService(s.id)}
                              className="text-rose-500 hover:text-rose-700 p-2 rounded-lg hover:bg-stone-100 transition"
                              title="Delete service"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* PROFILE & BIO MANAGER */}
              {activeTab === "profile" && (
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div className="border-b border-stone-100 pb-4">
                    <h3 className="font-sans font-extrabold text-xl text-stone-900">Salon Profile & Bio</h3>
                    <p className="text-stone-400 text-xs font-medium">Update brand identity, phone numbers, and social media handles</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block">Salon/Brand Name</label>
                        <input 
                          type="text"
                          value={profileForm.name}
                          onChange={e => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:ring-1 focus:ring-black text-stone-900"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block">Tagline</label>
                        <input 
                          type="text"
                          value={profileForm.tagline}
                          onChange={e => setProfileForm(prev => ({ ...prev, tagline: e.target.value }))}
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:ring-1 focus:ring-black text-stone-900"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block">Instagram Handle</label>
                        <input 
                          type="text"
                          value={profileForm.handle}
                          onChange={e => setProfileForm(prev => ({ ...prev, handle: e.target.value }))}
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:ring-1 focus:ring-black text-stone-900"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block">Location Description</label>
                        <input 
                          type="text"
                          value={profileForm.location}
                          onChange={e => setProfileForm(prev => ({ ...prev, location: e.target.value }))}
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:ring-1 focus:ring-black text-stone-900"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block">WhatsApp Link / Number API URL</label>
                        <input 
                          type="text"
                          value={profileForm.socials.whatsapp}
                          onChange={e => setProfileForm(prev => ({ ...prev, socials: { ...prev.socials, whatsapp: e.target.value } }))}
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:ring-1 focus:ring-black text-stone-900"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block">Telephone Contact Label</label>
                        <input 
                          type="text"
                          value={profileForm.socials.phone}
                          onChange={e => setProfileForm(prev => ({ ...prev, socials: { ...prev.socials, phone: e.target.value } }))}
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:ring-1 focus:ring-black text-stone-900"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block">Email Address</label>
                        <input 
                          type="email"
                          value={profileForm.socials.email}
                          onChange={e => setProfileForm(prev => ({ ...prev, socials: { ...prev.socials, email: e.target.value } }))}
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:ring-1 focus:ring-black text-stone-900"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block">Instagram Link URL</label>
                        <input 
                          type="text"
                          value={profileForm.socials.instagram}
                          onChange={e => setProfileForm(prev => ({ ...prev, socials: { ...prev.socials, instagram: e.target.value } }))}
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:ring-1 focus:ring-black text-stone-900"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block">Bio Paragraph (Comma-separated lines representing biography paragraphs)</label>
                    <textarea 
                      value={profileForm.bio.join("\n\n")}
                      onChange={e => setProfileForm(prev => ({ ...prev, bio: e.target.value.split("\n\n").map(p => p.trim()).filter(Boolean) }))}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 text-xs focus:outline-none focus:ring-1 focus:ring-black text-stone-900 h-28 resize-none"
                      required
                    />
                  </div>

                  <div className="flex justify-end pt-4 border-t border-stone-150">
                    <button 
                      type="submit"
                      className="px-8 py-3 bg-black hover:bg-stone-800 text-white transition rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
                    >
                      <Save className="w-4 h-4" />
                      Save Brand Profile
                    </button>
                  </div>
                </form>
              )}

              {/* VERCEL CODE EXPORTER */}
              {activeTab === "export" && (
                <div className="space-y-6">
                  <div className="border-b border-stone-100 pb-4">
                    <h3 className="font-sans font-extrabold text-xl text-stone-900 text-emerald-700 flex items-center gap-1.5">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                      Vercel Deployment Code Sync
                    </h3>
                    <p className="text-stone-400 text-xs font-medium">Keep uploaded images and customizations permanently frozen inside your Vercel/GitHub code!</p>
                  </div>

                  <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 space-y-4">
                    <h4 className="text-sm font-bold text-stone-800 uppercase tracking-wider font-mono">How does this solve Vercel persistence?</h4>
                    <p className="text-xs text-stone-500 leading-relaxed font-medium">
                      Standard platforms like Vercel have read-only filesystems and reset your browser's local cache if you open the site in a new browser or clear cookie history.
                    </p>
                    <p className="text-xs text-stone-500 leading-relaxed font-medium">
                      By clicking <strong className="text-stone-900">"Copy Configuration Code"</strong> below, you get the complete generated <code className="bg-stone-200 px-1 py-0.5 rounded text-stone-800">cmsData.ts</code> code representing your real-time modifications. You can simply paste it and overwrite the <code className="bg-stone-200 px-1 py-0.5 rounded text-stone-800">src/data/cmsData.ts</code> file in your workspace, and redeploy to Vercel. 
                    </p>
                    <p className="text-xs text-emerald-600 font-bold">
                      ✓ Any images you uploaded visually are converted and hardcoded directly as lightweight Base64 data strings—requiring NO database setups!
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xs text-stone-400 font-mono font-bold">Code length: ~{exportAsTSCode().length} characters</span>
                    <button 
                      onClick={handleCopyCode}
                      className="bg-black hover:bg-stone-800 text-white rounded-full px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all duration-300"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          Copied to Clipboard!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy Configuration Code
                        </>
                      )}
                    </button>
                  </div>

                  <div className="relative">
                    <div className="absolute top-2 right-2 bg-stone-950 text-stone-400 text-[9px] font-mono px-2 py-1 rounded select-none">
                      TYPESCRIPT
                    </div>
                    <pre className="bg-stone-950 text-stone-300 text-[10px] font-mono p-4 rounded-xl h-64 overflow-auto border border-stone-850 shadow-inner select-all leading-normal">
                      {exportAsTSCode()}
                    </pre>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
