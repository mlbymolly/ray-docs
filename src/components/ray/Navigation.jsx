import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const NAV_ITEMS = [
{ id: "hero", label: "Overview" },
{ id: "architecture", label: "Architecture" },
{ id: "scheduling", label: "Scheduling" },
{ id: "object-store", label: "Object Store" },
{ id: "fault-tolerance", label: "Fault Tolerance" },
{ id: "performance", label: "Performance" },
{ id: "gcs", label: "GCS" },
{ id: "lineage", label: "Lineage" }];


export default function Navigation() {
  const [active, setActive] = useState("hero");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      const sections = NAV_ITEMS.map((item) => ({
        id: item.id,
        el: document.getElementById(item.id)
      })).filter((s) => s.el);

      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i].el.getBoundingClientRect().top <= 120) {
          setActive(sections[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-200 ${scrolled ? "shadow-sm border-b border-border" : "border-b border-border"}`}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          <span className="font-display font-bold text-sm text-foreground tracking-tight">Ray Deep Dive</span>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-0.5">
            {NAV_ITEMS.map((item) =>
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)} className="px-3 py-1.5 rounded text-xs font-sans transition-colors text-muted-foreground hover:text-foreground hidden">





              
                {item.label}
              </button>
            )}
          </div>

          <button className="md:hidden text-foreground p-1" onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open &&
      <div className="md:hidden bg-white border-t border-border">
          <div className="px-6 py-3 space-y-0.5">
            {NAV_ITEMS.map((item) =>
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className={`block w-full text-left px-3 py-2 rounded text-sm ${
            active === item.id ? "text-primary font-medium" : "text-muted-foreground"}`
            }>
            
                {item.label}
              </button>
          )}
          </div>
        </div>
      }
    </nav>);

}