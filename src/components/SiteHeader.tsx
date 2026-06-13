import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import AccountNavButton from "@/components/AccountNavButton";

export const LOGO_IMAGE = "https://cdn.poehali.dev/projects/edb6cf3c-b4b5-4994-bb1e-ca5122151314/files/64d7e36c-4e12-4611-aea9-1312bab43508.jpg";

const navItems = [
  { label: "Товары", to: "/products", icon: "ShoppingBag" },
  { label: "Поставщики", to: "/sellers", icon: "Store" },
  { label: "Как это работает", to: "/how-it-works", icon: "Info" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/40 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">

        {/* Логотип */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-white shadow-md border border-gray-100 flex flex-col items-center justify-center" style={{padding:"2px"}}>
            <span className="font-black text-[10px] leading-none" style={{color:"#1a2b4a"}}>B2B</span>
            <div className="relative mt-0.5">
              <Icon name="ShoppingCart" size={14} style={{color:"#1a2b4a"}} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white" />
            </div>
            <span className="font-bold text-[6px] leading-none mt-0.5" style={{color:"#1a2b4a"}}>ChinaCarts</span>
          </div>
          <span className="font-bold text-xl" style={{color:"#111", fontFamily:"'Inter','Manrope',sans-serif", letterSpacing:"-0.03em"}}>
            China<span style={{color:"#cc0000"}}>Carts</span>
          </span>
        </Link>

        {/* Десктоп меню */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map(item => (
            <Link key={item.to} to={item.to}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
              <Icon name={item.icon} size={14} />
              {item.label}
            </Link>
          ))}
        </div>

        {/* Правая часть */}
        <div className="flex items-center gap-2">
          <AccountNavButton className="hidden lg:flex" />
          <button className="lg:hidden p-2 rounded-lg bg-secondary" onClick={() => setOpen(!open)}>
            <Icon name={open ? "X" : "Menu"} size={20} />
          </button>
        </div>
      </div>

      {/* Мобильное меню */}
      {open && (
        <div className="lg:hidden bg-card border-t border-border px-4 py-3 flex flex-col gap-1">
          {navItems.map(item => (
            <Link key={item.to} to={item.to}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-secondary transition-all font-medium text-sm">
              <Icon name={item.icon} size={16} />
              {item.label}
            </Link>
          ))}
          <div className="pt-1 border-t border-border mt-1">
            <button onClick={() => { setOpen(false); navigate("/account"); }}
              className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-secondary transition-all font-medium text-sm w-full text-left">
              <Icon name="UserRound" size={16} />
              Личный кабинет
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}