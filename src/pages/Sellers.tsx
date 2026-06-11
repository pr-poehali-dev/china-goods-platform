import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import SellersSection from "@/components/SellersSection";
import AccountNavButton from "@/components/AccountNavButton";

const MASCOT_IMAGE = "https://cdn.poehali.dev/projects/edb6cf3c-b4b5-4994-bb1e-ca5122151314/files/47da4abf-8071-42d0-a7b6-732be8d56989.jpg";

export default function Sellers() {
  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/40 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="https://cdn.poehali.dev/projects/edb6cf3c-b4b5-4994-bb1e-ca5122151314/files/682fb5e7-10e7-4c3f-b81a-814ca7f6bf12.jpg" alt="ChinaCarts" className="w-10 h-10 rounded-xl object-cover" />
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
      <section className="pt-28 pb-10 px-4 bg-hero-soft">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full text-primary text-sm font-bold mb-4 shadow-sm">
            <Icon name="Store" size={16} /> Каталог продавцов
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4 text-brand-navy">
            Проверенные <span className="text-grad">продавцы</span> из Китая
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Зарегистрируйтесь как поставщик — и ваш профиль с описанием, товарами и видео сразу появится на сайте. Покупатели смогут написать вам напрямую.
          </p>
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
            <img src="https://cdn.poehali.dev/projects/edb6cf3c-b4b5-4994-bb1e-ca5122151314/files/682fb5e7-10e7-4c3f-b81a-814ca7f6bf12.jpg" alt="ChinaCarts" className="w-9 h-9 rounded-xl object-cover" />
            <span className="font-bold text-xl text-white" style={{fontFamily:"'Playfair Display', serif"}}>China<span style={{color:"hsl(200,80%,65%)"}}>Carts</span></span>
          </Link>
          <span className="text-sm text-white/60">© 2025 ChinaCarts · 🇨🇳 → 🇷🇺 Закупки из Китая в Россию</span>
        </div>
      </footer>
    </div>
  );
}