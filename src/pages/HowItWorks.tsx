import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const steps = [
  {
    num: "01",
    icon: "UserPlus",
    color: "hsl(210,70%,90%)",
    iconColor: "hsl(210,70%,45%)",
    title: "Поставщик регистрируется",
    desc: "Китайский поставщик создаёт профиль, добавляет товары с фото, ценами и условиями оптовых партий. Верификация занимает до 24 часов.",
    tag: "Для поставщиков",
  },
  {
    num: "02",
    icon: "Search",
    color: "hsl(260,60%,90%)",
    iconColor: "hsl(260,60%,50%)",
    title: "Покупатель находит товар",
    desc: "Российский покупатель просматривает каталог, фильтрует по категориям и ценам, смотрит профиль поставщика и его ассортимент.",
    tag: "Для покупателей",
  },
  {
    num: "03",
    icon: "MessageCircle",
    color: "hsl(142,60%,88%)",
    iconColor: "hsl(142,60%,38%)",
    title: "Прямой диалог",
    desc: "Покупатель пишет поставщику напрямую в чате на платформе — без посредников, на русском и китайском языках. Договариваетесь об условиях сами.",
    tag: "Без посредников",
  },
  {
    num: "04",
    icon: "ShoppingCart",
    color: "hsl(42,95%,85%)",
    iconColor: "hsl(42,80%,42%)",
    title: "Оформление заказа",
    desc: "Согласовываете объём, упаковку и сроки. Поставщик отгружает товар, вы получаете трек-номер и отслеживаете доставку.",
    tag: "Сделка",
  },
];

const forSuppliers = [
  { icon: "Globe", text: "Выход на рынок России и СНГ без посредников" },
  { icon: "Store", text: "Бесплатный профиль с каталогом товаров" },
  { icon: "MessageCircle", text: "Прямые переговоры с покупателями" },
  { icon: "TrendingUp", text: "Больше заказов — без агентских комиссий" },
];

const forBuyers = [
  { icon: "ShieldCheck", text: "Только верифицированные поставщики" },
  { icon: "BadgePercent", text: "Оптовые цены напрямую от производителя" },
  { icon: "MessageCircle", text: "Чат с поставщиком без переплат" },
  { icon: "PackageSearch", text: "Тысячи товаров в одном месте" },
];

const HowItWorks = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ background: "hsl(200,60%,97%)" }}>

      {/* Hero */}
      <section className="pt-16 pb-12 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold text-primary mb-5" style={{ background: "hsl(200,80%,90%)" }}>
            Маркетплейс B2B
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-brand-navy leading-tight mb-5">
            Как работает платформа
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed mb-8">
            Мы соединяем китайских поставщиков и российских покупателей напрямую — без посредников, агентов и наценок. Поставщик выставляет товары, покупатель находит нужное и договаривается напрямую.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigate("/sellers")}
              className="btn-modern px-7 py-3.5 text-white font-bold rounded-2xl shadow-lg"
            >
              Каталог поставщиков
            </button>
            <button
              onClick={() => navigate("/account")}
              className="px-7 py-3.5 bg-white border border-slate-200 font-bold rounded-2xl hover:bg-slate-50 transition-all text-brand-navy shadow-sm"
            >
              Зарегистрироваться как поставщик
            </button>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((s) => (
              <div key={s.num} className="bg-white rounded-3xl p-6 shadow-sm border border-white/80 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: s.color }}>
                    <Icon name={s.icon} size={20} style={{ color: s.iconColor }} />
                  </div>
                  <span className="text-3xl font-display font-extrabold text-slate-100">{s.num}</span>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-primary uppercase tracking-wide mb-1">{s.tag}</div>
                  <div className="font-bold text-brand-navy text-base mb-2">{s.title}</div>
                  <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For whom */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-6">

            {/* Поставщикам */}
            <div className="rounded-3xl p-8" style={{ background: "linear-gradient(135deg, hsl(210,60%,94%), hsl(200,70%,90%))" }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-2xl bg-white/70 flex items-center justify-center">
                  <Icon name="Factory" size={22} className="text-primary" />
                </div>
                <div>
                  <div className="font-display font-extrabold text-xl text-brand-navy">Поставщикам</div>
                  <div className="text-xs text-slate-500">из Китая</div>
                </div>
              </div>
              <ul className="space-y-3 mb-7">
                {forSuppliers.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-xl bg-white/80 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon name={item.icon} size={14} className="text-primary" />
                    </div>
                    <span className="text-sm text-brand-navy font-medium leading-snug">{item.text}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate("/account")}
                className="w-full py-3 rounded-2xl bg-white font-bold text-primary text-sm shadow-sm hover:shadow-md transition-all"
              >
                Зарегистрироваться как поставщик
              </button>
            </div>

            {/* Покупателям */}
            <div className="rounded-3xl p-8" style={{ background: "linear-gradient(135deg, hsl(142,40%,92%), hsl(160,50%,88%))" }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-2xl bg-white/70 flex items-center justify-center">
                  <Icon name="ShoppingBag" size={22} className="text-emerald-600" />
                </div>
                <div>
                  <div className="font-display font-extrabold text-xl text-brand-navy">Покупателям</div>
                  <div className="text-xs text-slate-500">из России и СНГ</div>
                </div>
              </div>
              <ul className="space-y-3 mb-7">
                {forBuyers.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-xl bg-white/80 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon name={item.icon} size={14} className="text-emerald-600" />
                    </div>
                    <span className="text-sm text-brand-navy font-medium leading-snug">{item.text}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate("/sellers")}
                className="w-full py-3 rounded-2xl bg-white font-bold text-emerald-600 text-sm shadow-sm hover:shadow-md transition-all"
              >
                Найти поставщика
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="font-display font-extrabold text-3xl text-brand-navy mb-4">Готовы начать?</h2>
          <p className="text-slate-500 mb-8">Зарегистрируйтесь как поставщик или сразу найдите нужный товар в каталоге</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigate("/account")}
              className="btn-modern px-7 py-3.5 text-white font-bold rounded-2xl shadow-lg"
            >
              <span className="flex items-center gap-2"><Icon name="Store" size={17} />Я поставщик</span>
            </button>
            <button
              onClick={() => navigate("/sellers")}
              className="px-7 py-3.5 bg-white border border-slate-200 font-bold rounded-2xl hover:bg-slate-50 transition-all text-brand-navy shadow-sm flex items-center gap-2"
            >
              <Icon name="Search" size={17} />Ищу товар
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HowItWorks;
