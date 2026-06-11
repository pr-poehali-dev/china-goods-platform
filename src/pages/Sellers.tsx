import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import SellersSection from "@/components/SellersSection";
import AccountNavButton from "@/components/AccountNavButton";

const MASCOT_IMAGE = "https://cdn.poehali.dev/projects/edb6cf3c-b4b5-4994-bb1e-ca5122151314/bucket/logos/f146b4f7b76b4789a405ce2176a4d4af.png";

export default function Sellers() {
  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/40 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={MASCOT_IMAGE} alt="ChinaCarts" className="w-10 h-10 object-contain" />
            <span className="font-bold text-xl tracking-wide" style={{color:"hsl(220,45%,18%)", fontFamily:"'Playfair Display', serif"}}>
              China<span style={{color:"hsl(200,80%,45%)"}}>Carts</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <AccountNavButton />
            <Link
              to="/"
              className="flex items-center gap-2 px-5 py-2 glass rounded-xl text-sm font-bold text-brand-navy hover:scale-[1.02] transition-all"
            >
              <Icon name="ArrowLeft" size={16} /> <span className="hidden sm:inline">На главную</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* HEADER */}
      <section className="pt-28 pb-12 px-4" style={{background: "linear-gradient(180deg, hsl(200,75%,88%) 0%, hsl(200,60%,96%) 100%)"}}>
        <div className="container mx-auto text-center max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-primary text-sm font-bold mb-5 shadow-sm" style={{background:"hsl(200,80%,90%)"}}>
            <Icon name="Store" size={15} /> Маркетплейс B2B
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-extrabold mb-4 text-brand-navy leading-tight">
            Поставщики <span className="text-grad">из Китая</span>
          </h1>
          <p className="text-slate-500 text-lg mb-8 leading-relaxed">
            Прямые контакты с проверенными фабриками и оптовиками. Пишите напрямую, без посредников.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/80 text-sm font-semibold text-brand-navy shadow-sm">
              <Icon name="ShieldCheck" size={15} className="text-emerald-500" /> Верифицированные
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/80 text-sm font-semibold text-brand-navy shadow-sm">
              <Icon name="MessageCircle" size={15} className="text-primary" /> Прямой чат
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/80 text-sm font-semibold text-brand-navy shadow-sm">
              <Icon name="Package" size={15} className="text-violet-500" /> Оптовые цены
            </div>
          </div>
        </div>
      </section>

      {/* SELLERS CATALOG + CABINET */}
      <section className="py-12 px-4 bg-cream">
        <div className="container mx-auto">
          <SellersSection embedded />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-navy py-10 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={MASCOT_IMAGE} alt="ChinaCarts" className="w-9 h-9 object-contain" />
            <span className="font-bold text-xl text-white" style={{fontFamily:"'Playfair Display', serif"}}>China<span style={{color:"hsl(200,80%,65%)"}}>Carts</span></span>
          </Link>
          <span className="text-sm text-white/60">© 2025 ChinaCarts · 🇨🇳 → 🇷🇺 Закупки из Китая в Россию</span>
        </div>
      </footer>
    </div>
  );
}