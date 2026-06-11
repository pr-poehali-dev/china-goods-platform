import { useNavigate } from "react-router-dom";

const ORNAMENT_IMAGE = "https://cdn.poehali.dev/projects/edb6cf3c-b4b5-4994-bb1e-ca5122151314/files/5ee6ffe6-6dee-47e9-831b-18b6966d28b1.jpg";
const MARKET_IMAGE = "https://cdn.poehali.dev/projects/edb6cf3c-b4b5-4994-bb1e-ca5122151314/files/39bffd80-1854-4029-b2bc-7d4b1a9b3b92.jpg";

const StartPurchase = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ background: "hsl(200,60%,97%)" }}>
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 right-[5%] w-80 h-40 rounded-full bg-white/70 blur-3xl" />
          <div className="absolute bottom-0 left-[8%] w-64 h-32 rounded-full bg-white/60 blur-2xl" />
          <img src={ORNAMENT_IMAGE} alt="" className="absolute bottom-6 right-8 w-28 opacity-20 pointer-events-none select-none" style={{ filter: "sepia(0.3) saturate(1.5)" }} />
        </div>

        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Левая — фото / карточки статистики */}
            <div className="relative mb-0 sm:mb-8 lg:mb-0">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-sky-300/25 border-4 border-white/80">
                <img src={MARKET_IMAGE} alt="О компании ChinaCarts" className="w-full h-80 object-cover" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, hsl(220,45%,18%,0.6) 0%, transparent 55%)" }} />
                <div className="absolute bottom-6 left-6 right-6 flex gap-3">
                  {[
                    { value: "2017", label: "год основания" },
                    { value: "500+", label: "фабрик" },
                    { value: "4.9★", label: "рейтинг" },
                  ].map((s, i) => (
                    <div key={i} className="flex-1 rounded-2xl px-3 py-2.5 text-center" style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.35)" }}>
                      <div className="font-display font-bold text-xl text-white leading-none">{s.value}</div>
                      <div className="text-[11px] text-white/80 mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hidden sm:flex absolute -bottom-6 -right-4 bg-white rounded-2xl px-4 py-3 shadow-xl shadow-sky-300/20 border border-white items-center gap-3 animate-float" style={{ animationDuration: "5s" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: "linear-gradient(135deg,hsl(354,78%,52%,0.12),hsl(25,85%,55%,0.18))" }}>🛡️</div>
                <div>
                  <div className="font-display font-bold text-sm text-brand-navy">Гарантия качества</div>
                  <div className="text-[11px] text-slate-500">фотоотчёт каждой поставки</div>
                </div>
              </div>
            </div>

            {/* Правая — текст */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-5 text-primary" style={{ background: "hsl(200,80%,90%)" }}>
                О компании
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-5 text-brand-navy leading-tight">
                Закупаем из Китая <span className="text-grad">с 2017 года</span>
              </h2>
              <p className="text-slate-500 leading-relaxed mb-6">
                TaoSeller — агентство полного цикла закупок из Китая. Мы работаем напрямую с фабриками на Alibaba, 1688 и Taobao, ведём переговоры на китайском языке и берём на себя весь путь товара — от поиска до вашего склада.
              </p>
              <p className="text-slate-500 leading-relaxed mb-8">
                За 7 лет мы выстроили сеть из 500+ проверенных поставщиков и помогли тысячам предпринимателей сэкономить на закупках до 40%.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {[
                  { emoji: "🏭", title: "500+ фабрик", desc: "проверенная база поставщиков" },
                  { emoji: "🚀", title: "7 лет", desc: "опыта в закупках из Китая" },
                  { emoji: "📦", title: "10 000+", desc: "успешных поставок" },
                  { emoji: "⭐", title: "4.9 из 5", desc: "средний рейтинг клиентов" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-2xl transition-all" style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(12px)", border: "1.5px solid rgba(255,255,255,0.85)", boxShadow: "0 4px 16px rgba(176,220,240,0.25)" }}>
                    <span className="text-2xl">{item.emoji}</span>
                    <div>
                      <div className="font-display font-bold text-brand-navy text-sm">{item.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate("/sellers")}
                className="btn-modern px-8 py-3.5 text-white font-bold rounded-2xl shadow-lg"
              >
                Начать закупку
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StartPurchase;
