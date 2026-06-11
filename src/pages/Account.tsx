import Icon from "@/components/ui/icon";
import BuyerAccount from "@/components/BuyerAccount";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function Account() {
  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <SiteHeader />

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

      <section className="py-10 px-4 bg-cream min-h-[60vh]">
        <div className="container mx-auto">
          <BuyerAccount />
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
