import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import BuyerAccount from "@/components/BuyerAccount";

const MASCOT_IMAGE = "https://cdn.poehali.dev/projects/edb6cf3c-b4b5-4994-bb1e-ca5122151314/bucket/logos/f146b4f7b76b4789a405ce2176a4d4af.png";

export default function Account() {
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
            <Link
              to="/sellers"
              className="hidden sm:flex items-center gap-2 px-5 py-2 glass rounded-xl text-sm font-bold text-brand-navy hover:scale-[1.02] transition-all"
            >
              <Icon name="Store" size={16} /> Продавцы
            </Link>
            <Link
              to="/"
              className="flex items-center gap-2 px-5 py-2 glass rounded-xl text-sm font-bold text-brand-navy hover:scale-[1.02] transition-all"
            >
              <Icon name="ArrowLeft" size={16} /> На главную
            </Link>
          </div>
        </div>
      </nav>

      {/* HEADER */}
      <section className="pt-28 pb-8 px-4 bg-hero-soft">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full text-primary text-sm font-bold mb-4 shadow-sm">
            <Icon name="UserRound" size={16} /> Личный кабинет
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-3 text-brand-navy">
            Кабинет <span className="text-grad">покупателя</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Здесь хранятся ваши переписки с продавцами. Пишите на русском — поставщики получают сообщения на китайском, ответы переводятся обратно.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-10 px-4 bg-cream min-h-[60vh]">
        <div className="container mx-auto">
          <BuyerAccount />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-navy py-10 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm text-white/60">© 2025 ChinaCarts · 🇨🇳 → 🇷🇺 Закупки из Китая в Россию</span>
          <div className="flex items-center gap-3">
            <a href="https://vk.com/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#0077FF]/60 flex items-center justify-center transition-all" title="ВКонтакте">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-white"><path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14C20.67 22 22 20.67 22 15.07V8.93C22 3.33 20.67 2 15.07 2zm3.08 13.37h-1.5c-.57 0-.74-.45-1.76-1.48-.88-.86-1.27-.97-1.49-.97-.3 0-.39.09-.39.52v1.35c0 .37-.12.59-1.1.59-1.62 0-3.41-.98-4.67-2.8C5.79 10.37 5.25 8.5 5.25 8.1c0-.22.09-.43.52-.43h1.5c.39 0 .54.18.69.6.76 2.19 2.03 4.11 2.55 4.11.2 0 .29-.09.29-.59V9.54c-.06-1.05-.61-1.14-.61-1.51 0-.18.15-.37.39-.37h2.37c.33 0 .45.18.45.56v3c0 .33.15.45.24.45.2 0 .37-.12.74-.49 1.14-1.28 1.96-3.25 1.96-3.25.11-.22.29-.43.68-.43h1.5c.45 0 .55.23.45.56-.19.86-2.03 3.48-2.03 3.48-.16.26-.22.37 0 .66.16.2.68.66 1.03 1.06.64.72 1.13 1.33 1.26 1.75.12.41-.09.62-.52.62z"/></svg>
            </a>
            <a href="https://max.ru/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#FF6B35]/60 flex items-center justify-center transition-all" title="MAX">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 13h-2v-6h2v6zm0-8h-2V5h2v2z"/></svg>
            </a>
            <a href="https://t.me/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#2AABEE]/60 flex items-center justify-center transition-all" title="Telegram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8l-1.68 7.93c-.12.56-.46.7-.93.43l-2.57-1.9-1.24 1.19c-.14.13-.25.25-.51.25l.18-2.6 4.72-4.26c.21-.18-.04-.28-.32-.1L7.7 14.07l-2.53-.79c-.55-.17-.56-.55.12-.82l9.87-3.8c.46-.17.86.11.48.14z"/></svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}