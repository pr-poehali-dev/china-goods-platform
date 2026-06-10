import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import SellersSection from "@/components/SellersSection";

const MASCOT_IMAGE = "https://cdn.poehali.dev/projects/edb6cf3c-b4b5-4994-bb1e-ca5122151314/files/47da4abf-8071-42d0-a7b6-732be8d56989.jpg";

export default function Sellers() {
  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-accent border-2 border-brand-navy flex items-center justify-center overflow-hidden">
              <img src={MASCOT_IMAGE} alt="TaoSeller" className="w-full h-full object-contain" />
            </div>
            <span className="font-display font-bold text-xl tracking-wide text-brand-navy">
              Tao<span className="text-primary">Seller</span>
            </span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 px-5 py-2 bg-white border-2 border-border rounded-xl text-sm font-bold text-brand-navy hover:border-brand-navy transition-all"
          >
            <Icon name="ArrowLeft" size={16} /> На главную
          </Link>
        </div>
      </nav>

      {/* HEADER */}
      <section className="pt-28 pb-10 px-4 bg-hero-soft">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-accent rounded-full text-primary text-sm font-bold mb-4">
            <Icon name="Store" size={16} /> Каталог продавцов
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-brand-navy uppercase">
            ПРОВЕРЕННЫЕ <span className="marker-yellow">ПРОДАВЦЫ</span> ИЗ КИТАЯ
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
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center overflow-hidden">
              <img src={MASCOT_IMAGE} alt="TaoSeller" className="w-full h-full object-contain" />
            </div>
            <span className="font-display font-bold text-xl text-white">Tao<span className="text-primary">Seller</span></span>
          </Link>
          <span className="text-sm text-white/60">© 2025 TaoSeller · 🇨🇳 → 🇷🇺 Закупки из Китая в Россию</span>
        </div>
      </footer>
    </div>
  );
}