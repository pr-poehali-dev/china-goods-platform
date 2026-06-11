import Icon from "@/components/ui/icon";
import SellersSection from "@/components/SellersSection";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function Sellers() {
  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <SiteHeader />

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

      <section className="py-12 px-4 bg-cream">
        <div className="container mx-auto">
          <SellersSection embedded />
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
