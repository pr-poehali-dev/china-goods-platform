import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { LOGO_IMAGE } from "@/components/SiteHeader";

const socials = [
  {
    title: "ВКонтакте", href: "https://vk.com/",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14C20.67 22 22 20.67 22 15.07V8.93C22 3.33 20.67 2 15.07 2zm3.08 13.37h-1.5c-.57 0-.74-.45-1.76-1.48-.88-.86-1.27-.97-1.49-.97-.3 0-.39.09-.39.52v1.35c0 .37-.12.59-1.1.59-1.62 0-3.41-.98-4.67-2.8C5.79 10.37 5.25 8.5 5.25 8.1c0-.22.09-.43.52-.43h1.5c.39 0 .54.18.69.6.76 2.19 2.03 4.11 2.55 4.11.2 0 .29-.09.29-.59V9.54c-.06-1.05-.61-1.14-.61-1.51 0-.18.15-.37.39-.37h2.37c.33 0 .45.18.45.56v3c0 .33.15.45.24.45.2 0 .37-.12.74-.49 1.14-1.28 1.96-3.25 1.96-3.25.11-.22.29-.43.68-.43h1.5c.45 0 .55.23.45.56-.19.86-2.03 3.48-2.03 3.48-.16.26-.22.37 0 .66.16.2.68.66 1.03 1.06.64.72 1.13 1.33 1.26 1.75.12.41-.09.62-.52.62z"/></svg>,
    hover: "hover:bg-[#0077FF]/60",
  },
  {
    title: "MAX", href: "https://max.ru/",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 13h-2v-6h2v6zm0-8h-2V5h2v2z"/></svg>,
    hover: "hover:bg-[#FF6B35]/60",
  },
  {
    title: "Telegram", href: "https://t.me/",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8l-1.68 7.93c-.12.56-.46.7-.93.43l-2.57-1.9-1.24 1.19c-.14.13-.25.25-.51.25l.18-2.6 4.72-4.26c.21-.18-.04-.28-.32-.1L7.7 14.07l-2.53-.79c-.55-.17-.56-.55.12-.82l9.87-3.8c.46-.17.86.11.48.14z"/></svg>,
    hover: "hover:bg-[#2AABEE]/60",
  },
];

export default function SiteFooter() {
  return (
    <footer style={{background: "hsl(220,45%,18%)"}} className="py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">

          {/* Бренд */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <Link to="/" className="flex items-center gap-2.5">
              <img src={LOGO_IMAGE} alt="ChinaCarts" className="w-10 h-10 rounded-xl object-cover" />
              <span className="text-2xl" style={{color:"#fff", fontFamily:"'ZCOOL XiaoWei', serif", letterSpacing:"0.02em"}}>
                China<span style={{color:"#ff4444"}}>Carts</span>
              </span>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed"></p>
            <a href="tel:89191861222" className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
              <Icon name="Phone" size={14} className="text-red-400 flex-shrink-0" />
              8 919 186-12-22
            </a>
            <a href="mailto:info@chinacarts.ru" className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
              <Icon name="Mail" size={14} className="text-red-400 flex-shrink-0" />
              info@chinacarts.ru
            </a>
          </div>

          {/* Каталог */}
          <div>
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-4">Каталог</h4>
            <ul className="space-y-2">
              {[
                { label: "Товары", to: "/products" },
                { label: "Поставщики", to: "/sellers" },
                { label: "Начать закупку", to: "/start-purchase" },
              ].map(l => (
                <li key={l.to}><Link to={l.to} className="text-sm text-white/60 hover:text-white transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Компания */}
          <div>
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-4">Компания</h4>
            <ul className="space-y-2">
              {[
                { label: "Как это работает", to: "/how-it-works" },
                { label: "Личный кабинет", to: "/account" },
                { label: "Стать поставщиком", to: "/account" },
              ].map((l, i) => (
                <li key={i}><Link to={l.to} className="text-sm text-white/60 hover:text-white transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Соцсети */}
          <div>
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-4">Мы в соцсетях</h4>
            <div className="flex gap-2">
              {socials.map(s => (
                <a key={s.title} href={s.href} target="_blank" rel="noopener noreferrer"
                  className={`w-9 h-9 rounded-xl bg-white/10 ${s.hover} flex items-center justify-center transition-all text-white`}
                  title={s.title}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-sm text-white/50">© 2025 ChinaCarts. Все права защищены.</span>
          <span className="text-sm text-white/40">🇨🇳 → 🇷🇺 Прямые поставки из Китая в Россию</span>
        </div>
      </div>
    </footer>
  );
}