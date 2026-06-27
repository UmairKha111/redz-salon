import React, { useState } from "react";
import { useCMSData } from "../data/cmsData";
import { Calendar, User, Phone, Mail, Sparkles, Check, HelpCircle, ArrowRight, MessageSquare, Heart } from "lucide-react";

export default function BookingForm() {
  const { services, brandInfo } = useCMSData();
  const [formData, setFormData] = useState(() => ({
    name: "",
    phone: "",
    email: "",
    date: "",
    packageId: services[0]?.id || "",
    skinType: "normal",
    guestCount: "1",
    notes: ""
  }));

  const [submitted, setSubmitted] = useState(false);

  const selectedService = services.find((s) => s.id === formData.packageId) || services[0] || { price: "₹0", title: "" };

  // Simple pricing calculation logic
  const calculateEstimate = () => {
    let basePrice = parseInt(selectedService.price.replace(/[^\d]/g, ""), 10);
    let guestAddition = 0;
    const count = parseInt(formData.guestCount, 10);

    if (count > 1) {
      // each guest gets standard guest price (approx ₹4,000)
      guestAddition = (count - 1) * 4500;
    }

    return basePrice + guestAddition;
  };

  const formattedEstimate = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(calculateEstimate());

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getWhatsAppMessage = () => {
    const formattedDate = formData.date
      ? new Date(formData.date).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric"
        })
      : "Not specified yet";

    const text = `Hi Nikita Mohini | Redz Salon! 🌸

I would like to inquire about booking my beauty/styling session! Here are my event details:

✨ *Name*: ${formData.name || "Client"}
📞 *Contact*: ${formData.phone || "Not specified"}
📧 *Email*: ${formData.email || "Not specified"}
📅 *Event Date*: ${formattedDate}
💄 *Selected Look/Service*: ${selectedService.title} (${selectedService.price})
🧴 *Skin Profile*: ${formData.skinType.toUpperCase()}
👥 *Total Members*: ${formData.guestCount} person(s)

📝 *Special Requests/Notes*: 
"${formData.notes || "No special requests"}"

Could you please confirm your availability and share package brochures for my dates? Thank you!`;

    return encodeURIComponent(text);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.date) {
      alert("Please fill in all mandatory fields: Name, Phone, and Event Date.");
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="bg-white border border-stone-200/60 rounded-3xl overflow-hidden shadow-md max-w-5xl mx-auto flex flex-col lg:flex-row" id="booking-form-container">
      {/* Dynamic Summary Card (Left on Large screens) */}
      <div className="bg-stone-50 p-8 lg:w-2/5 border-b lg:border-b-0 lg:border-r border-stone-200/60 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-1.5 bg-stone-100 px-3.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest text-stone-900 border border-stone-200/50">
            <span>Real-time Estimate</span>
          </div>

          <div>
            <h3 className="text-[10px] uppercase font-bold tracking-widest text-stone-400 font-mono">
              Inquiry Summary
            </h3>
            <p className="text-xl font-sans font-extrabold text-stone-900 mt-1.5 tracking-tight">
              {selectedService.title}
            </p>
            <p className="text-stone-550 text-xs mt-1.5 leading-relaxed font-medium">
              {selectedService.description}
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-stone-200/60">
            <div className="flex justify-between items-center text-xs sm:text-sm text-stone-500 font-medium">
              <span>Base Package Fee:</span>
              <span className="font-bold text-stone-900">{selectedService.price}</span>
            </div>
            {parseInt(formData.guestCount, 10) > 1 && (
              <div className="flex justify-between items-center text-xs sm:text-sm text-stone-500 font-medium">
                <span>Guest Add-ons ({parseInt(formData.guestCount, 10) - 1} person):</span>
                <span className="font-bold text-stone-900">
                  + ₹{((parseInt(formData.guestCount, 10) - 1) * 4500).toLocaleString("en-IN")}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center pt-3 border-t border-stone-200/60">
              <span className="text-xs sm:text-sm font-bold text-stone-900">Estimated Quote:</span>
              <span className="text-2xl font-sans font-extrabold text-stone-950 tracking-tighter">
                {formattedEstimate}
              </span>
            </div>
            <p className="text-[9px] text-stone-400 italic mt-1 leading-normal font-medium">
              *Taxes and travel outstation allowances will be calculated dynamically based on location details.
            </p>
          </div>
        </div>

        {/* Info list */}
        <div className="pt-8 border-t border-stone-200/60 space-y-3.5">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold">
              ✓
            </div>
            <p className="text-xs text-stone-500 leading-relaxed font-semibold">
              Premium eyelashes and basic draping are included.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold">
              ✓
            </div>
            <p className="text-xs text-stone-500 leading-relaxed font-semibold">
              Sanitizer and double-dipping safety protocols strictly maintained.
            </p>
          </div>
        </div>
      </div>

      {/* Main Form Fields */}
      <div className="p-8 flex-1">
        {submitted ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-10 space-y-6 animate-fade-in" id="success-view">
            <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-900 border border-stone-200 flex items-center justify-center">
              <Check className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-sans font-extrabold text-stone-900 tracking-tight">
                Thank you, {formData.name}!
              </h3>
              <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto font-medium">
                Your details have been calculated and saved locally. For immediate confirmation, please click below to send your details directly via WhatsApp.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3 w-full max-w-md justify-center">
              <a
                href={`https://wa.me/910000000000?text=${getWhatsAppMessage()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-black hover:bg-stone-800 text-white font-bold px-6 py-3.5 rounded-full transition-all duration-300 text-xs uppercase tracking-wider shadow-sm w-full"
                id="submit-wa-btn"
              >
                <MessageSquare className="w-4 h-4" />
                Send via WhatsApp
              </a>
              <button
                onClick={() => setSubmitted(false)}
                className="bg-stone-100 hover:bg-stone-200 text-stone-950 font-bold px-6 py-3.5 rounded-full transition-all duration-300 text-xs uppercase tracking-wider w-full"
              >
                Edit Reservation
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6" id="booking-form-element">
            <div className="space-y-2">
              <h2 className="text-2xl font-sans font-extrabold text-stone-950 tracking-tight">
                Secure Your Event Date
              </h2>
              <p className="text-stone-400 text-xs font-semibold">
                Fill out the secure form below to calculate your package and generate a direct schedule proposal.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block font-mono">
                  Full Name <span className="text-stone-950 font-extrabold">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:bg-white transition"
                    id="input-name"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block font-mono">
                  Phone / WhatsApp <span className="text-stone-950 font-extrabold">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="E.g., +91 98765-43210"
                    required
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:bg-white transition"
                    id="input-phone"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block font-mono">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="yourname@gmail.com"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:bg-white transition"
                    id="input-email"
                  />
                </div>
              </div>

              {/* Event Date */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block font-mono">
                  Event / Wedding Date <span className="text-stone-950 font-extrabold">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:bg-white transition text-stone-700"
                    id="input-date"
                  />
                </div>
              </div>

              {/* Selected Package */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block font-mono">
                  Look Theme / Package
                </label>
                <select
                  name="packageId"
                  value={formData.packageId}
                  onChange={handleInputChange}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:bg-white transition text-stone-700"
                  id="select-package"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title} ({s.price})
                    </option>
                  ))}
                </select>
              </div>

              {/* Skin Profile */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block font-mono">
                  Skin Profile / Sensitivity
                </label>
                <select
                  name="skinType"
                  value={formData.skinType}
                  onChange={handleInputChange}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:bg-white transition text-stone-700"
                  id="select-skintype"
                >
                  <option value="normal">Normal / Combined Skin</option>
                  <option value="oily">Oily Skin (Mattifying Base needed)</option>
                  <option value="dry">Dry Skin (Extreme Hydration needed)</option>
                  <option value="sensitive">Sensitive / Acne-prone (Certified skin-friendly)</option>
                </select>
              </div>

              {/* Total Members */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block font-mono">
                  Total Persons Requiring Makeup
                </label>
                <select
                  name="guestCount"
                  value={formData.guestCount}
                  onChange={handleInputChange}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:bg-white transition text-stone-700"
                  id="select-guests"
                >
                  <option value="1">Just Me (1 Person)</option>
                  <option value="2">Bride + 1 Guest (2 Persons)</option>
                  <option value="3">Bride + 2 Guests (3 Persons)</option>
                  <option value="4">Bride + 3 Guests (4 Persons)</option>
                  <option value="5">Group Booking (5+ Persons)</option>
                </select>
              </div>
            </div>

            {/* Special Requests */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block font-mono">
                Special Requests & Outfit Details (Optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                placeholder="Share information about your lehenga / saree shade, jewelry metal theme, hair preference, or specific times..."
                className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:bg-white transition resize-none"
                id="input-notes"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-black hover:bg-stone-800 text-white font-bold py-4 px-6 rounded-full transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm group text-xs uppercase tracking-wider"
              id="submit-form-btn"
            >
              <span>Calculate & Prepare Booking</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
