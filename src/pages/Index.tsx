import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import AccountNavButton from "@/components/AccountNavButton";

const SELLERS_URL = "https://functions.poehali.dev/d6dd7774-7d1c-436f-a1ac-d5342ecb46b4";

interface SellerCard {
  id: number;
  company_name: string;
  city: string;
  avatar_url: string;
  description: string;
}

const HERO_IMAGE = "https://cdn.poehali.dev/projects/edb6cf3c-b4b5-4994-bb1e-ca5122151314/files/61cb79c7-649f-463e-b3ac-2da8e1dc13d9.jpg";
const DRAGON_IMAGE = "https://cdn.poehali.dev/projects/edb6cf3c-b4b5-4994-bb1e-ca5122151314/files/039ee8c0-b2b5-43f3-b255-98f11b27d55a.jpg";
const ORNAMENT_IMAGE = "https://cdn.poehali.dev/projects/edb6cf3c-b4b5-4994-bb1e-ca5122151314/files/5b125bbc-8e0c-4a31-84ad-dd9479d9bceb.jpg";
const MARKET_IMAGE = "https://cdn.poehali.dev/projects/edb6cf3c-b4b5-4994-bb1e-ca5122151314/files/9f7c44b7-9693-4e80-a84a-faf56a26d175.jpg";
const DELIVERY_IMAGE = "https://cdn.poehali.dev/projects/edb6cf3c-b4b5-4994-bb1e-ca5122151314/files/2ec59105-66a4-4c71-8c50-ef5bc2590bb9.jpg";
const MASCOT_IMAGE = "https://cdn.poehali.dev/projects/edb6cf3c-b4b5-4994-bb1e-ca5122151314/files/47da4abf-8071-42d0-a7b6-732be8d56989.jpg";


const services = [
  {
    emoji: "🔍",
    title: "Поиск товаров",
    desc: "Найдём лучших поставщиков на Alibaba, 1688, Taobao и других площадках. Проверим качество и репутацию фабрики.",
    steps: ["Подбор поставщиков", "Проверка качества", "Сравнение цен", "Переговоры"],
    gradFrom: "hsl(354,78%,52%)",
    gradTo: "hsl(20,85%,58%)",
    accent: "hsl(354,78%,52%)",
    price: "от 3 000 ₽",
  },
  {
    emoji: "🛒",
    title: "Выкуп товаров",
    desc: "Выкупим товар от вашего имени, проведём оплату в юанях, оформим все документы и проверим вложение.",
    steps: ["Оплата в юанях", "Приёмка товара", "Фотоотчёт", "Упаковка"],
    gradFrom: "hsl(220,45%,22%)",
    gradTo: "hsl(200,70%,40%)",
    accent: "hsl(200,70%,40%)",
    price: "от 7%",
  },
  {
    emoji: "✈️",
    title: "Доставка в Россию",
    desc: "Доставим груз любым удобным способом: авиа, авто или ж/д. Таможенное оформление под ключ.",
    steps: ["Авиа / авто / ж/д", "Таможня под ключ", "Страхование груза", "Доставка до двери"],
    gradFrom: "hsl(174,55%,38%)",
    gradTo: "hsl(200,75%,50%)",
    accent: "hsl(174,55%,38%)",
    price: "от 5$/кг",
  },
];

const reviews = [
  { name: "Алексей Петров", city: "Москва", text: "Заказал партию электроники. Всё прошло гладко, товар пришёл в срок и без повреждений. Менеджеры всегда на связи.", rating: 5, avatar: "А", product: "Смартфоны Xiaomi" },
  { name: "Марина Соколова", city: "Санкт-Петербург", text: "Уже третий раз работаем с TaoSeller. Качество проверки товара на высоте, ни разу не было проблем с браком.", rating: 5, avatar: "М", product: "Одежда оптом" },
  { name: "Дмитрий Кузнецов", city: "Новосибирск", text: "Помогли найти уникальных поставщиков по хорошей цене. Сэкономил почти 40% по сравнению с другими агентами.", rating: 5, avatar: "Д", product: "Автозапчасти" },
  { name: "Ольга Иванова", city: "Екатеринбург", text: "Быстро, чётко, профессионально. Особенно понравился фотоотчёт о состоянии товара перед отправкой.", rating: 5, avatar: "О", product: "Товары для дома" },
  { name: "Игорь Смирнов", city: "Казань", text: "Доставили груз на 3 дня раньше обещанного срока. Таможня прошла без задержек. Рекомендую!", rating: 4, avatar: "И", product: "Спортивное снаряжение" },
  { name: "Елена Волкова", city: "Краснодар", text: "Личный кабинет очень удобный — вижу все этапы заказа в реальном времени. Полная прозрачность.", rating: 5, avatar: "Е", product: "Косметика" },
];

const articles = [
  { title: "Как не нарваться на мошенников на Alibaba", tag: "Безопасность", time: "7 мин", emoji: "🛡️", date: "12 мая 2025" },
  { title: "5 секретов переговоров с китайскими поставщиками", tag: "Советы", time: "5 мин", emoji: "🤝", date: "3 мая 2025" },
  { title: "Таможенные правила 2025: что изменилось", tag: "Таможня", time: "10 мин", emoji: "📋", date: "28 апр 2025" },
  { title: "Какие товары выгоднее всего везти из Китая", tag: "Аналитика", time: "8 мин", emoji: "📊", date: "20 апр 2025" },
];

export default function Index() {
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", phone: "", message: "" });
  const [formSent, setFormSent] = useState(false);
  const [sellers, setSellers] = useState<SellerCard[]>([]);
  const [heroVideos, setHeroVideos] = useState<{url: string; seller: string; avatar: string}[]>([]);
  const [heroVideoIdx, setHeroVideoIdx] = useState(0);
  const [heroVideoFs, setHeroVideoFs] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    fetch(`${SELLERS_URL}?action=list`)
      .then(r => r.json())
      .then(data => {
        setSellers(data.sellers || []);
        const vids: {url: string; seller: string; avatar: string}[] = [];
        (data.sellers || []).forEach((s: {company_name: string; avatar_url: string; videos: {video_url: string}[]}) => {
          (s.videos || []).forEach(v => {
            vids.push({ url: v.video_url, seller: s.company_name, avatar: s.avatar_url });
          });
        });
        setHeroVideos(vids);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrollY(window.scrollY));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            // плавная задержка для эффекта "по очереди" внутри одной группы
            const siblings = Array.from(el.parentElement?.children || []).filter((c) =>
              c.classList.contains("reveal")
            );
            const idx = siblings.indexOf(el);
            el.style.transitionDelay = `${Math.min(idx, 8) * 90}ms`;
            el.classList.remove("opacity-0-init");
            el.classList.add("revealed");
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    observerRef.current = observer;

    const scan = () => {
      document.querySelectorAll(".reveal:not(.revealed)").forEach((el) => {
        el.classList.add("opacity-0-init");
        observer.observe(el);
      });
    };
    scan();
    // повторное сканирование для контента, который подгружается позже (видео продавцов)
    const t1 = setTimeout(scan, 800);
    const t2 = setTimeout(scan, 2000);

    return () => {
      observer.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [activeSection]);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const navLinks = [
    { id: "home", label: "Главная" },
    { id: "about", label: "О нас" },
    { id: "blog", label: "Блог" },
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-body">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/40 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => scrollTo("home")} className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center" style={{background: "linear-gradient(135deg, hsl(200,75%,85%), hsl(200,65%,92%))", border: "1.5px solid rgba(255,255,255,0.8)", boxShadow: "0 2px 8px rgba(176,220,240,0.4)"}}>
              <img src="https://cdn.poehali.dev/projects/edb6cf3c-b4b5-4994-bb1e-ca5122151314/files/93bdd06c-4b49-4aeb-b7a8-70ac53ba5b16.jpg" alt="ChinaCarts" className="w-full h-full object-cover scale-110" />
            </div>
            <span className="font-display font-bold text-xl tracking-wide text-brand-navy">
              China<span className="text-primary">Carts</span>
            </span>
          </button>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeSection === link.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {link.label}
              </button>
            ))}

          </div>

          <div className="flex items-center gap-3">
            <AccountNavButton className="hidden lg:flex" />
            <button
              onClick={() => scrollTo("contacts")}
              className="hidden lg:flex btn-modern px-5 py-2 text-white font-bold text-sm rounded-xl"
            >Поставщики </button>
            <button
              className="lg:hidden p-2 rounded-lg bg-secondary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Icon name={mobileMenuOpen ? "X" : "Menu"} size={20} />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-card border-t border-border px-4 py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="text-left px-4 py-3 rounded-lg hover:bg-secondary transition-all font-medium"
              >
                {link.label}
              </button>
            ))}

            <Link
              to="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="text-left px-4 py-3 rounded-lg hover:bg-secondary transition-all font-medium"
            >
              Личный кабинет
            </Link>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="home" className="relative flex items-center overflow-hidden pt-24 pb-20" style={{background: "linear-gradient(180deg, hsl(200,75%,82%) 0%, hsl(200,65%,90%) 45%, hsl(200,55%,96%) 100%)"}}>
        {/* Облака — фоновые */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* большие облака */}
          <div className="absolute -top-6 left-[5%] w-64 h-40 rounded-full bg-white/80 blur-2xl" style={{ transform: `translateY(${scrollY * 0.06}px)` }} />
          <div className="absolute top-10 left-[20%] w-96 h-28 rounded-full bg-white/70 blur-3xl" style={{ transform: `translateY(${scrollY * 0.04}px)` }} />
          <div className="absolute top-4 right-[5%] w-72 h-36 rounded-full bg-white/75 blur-2xl" style={{ transform: `translateY(${scrollY * 0.07}px)` }} />
          <div className="absolute top-16 right-[25%] w-56 h-24 rounded-full bg-white/65 blur-2xl" style={{ transform: `translateY(${scrollY * 0.05}px)` }} />
          {/* маленькие облачка */}
          <div className="absolute top-32 left-[45%] w-36 h-16 rounded-full bg-white/60 blur-xl" style={{ transform: `translateY(${scrollY * 0.09}px)` }} />
          <div className="absolute bottom-10 left-[10%] w-44 h-20 rounded-full bg-white/50 blur-2xl" style={{ transform: `translateY(${scrollY * -0.05}px)` }} />
          <div className="absolute bottom-16 right-[15%] w-52 h-24 rounded-full bg-white/55 blur-2xl" style={{ transform: `translateY(${scrollY * -0.04}px)` }} />
          {/* красный акцент */}
          <div className="absolute top-1/2 left-[2%] w-24 h-24 rounded-full bg-primary/10 blur-2xl" />
          <div className="absolute bottom-0 right-[5%] w-32 h-32 rounded-full bg-primary/8 blur-3xl" />

        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl will-change-transform" style={{ transform: `translateY(${scrollY * 0.06}px)` }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-white/60 rounded-full text-sm text-primary font-semibold mb-6 animate-fade-in shadow-sm">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                🇨🇳 → 🇷🇺 Доставляем из Китая в Россию
              </div>
              <h1 className="font-display md:text-5xl leading-[1.12] mb-6 animate-fade-in-up text-brand-navy font-extrabold text-left text-7xl">
                Платформа для <span className="text-grad">закупок</span> в Китае
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg animate-fade-in-up delay-200">
                Найдём, выкупим и доставим любой товар из Китая. Проверенные поставщики, таможня под ключ, полная прозрачность на каждом этапе.
              </p>
              <div className="flex flex-wrap gap-4 animate-fade-in-up delay-300">
                <button
                  onClick={() => scrollTo("contacts")}
                  className="btn-modern px-8 py-4 text-white font-body font-bold text-lg rounded-2xl shadow-lg"
                >
                  Начать закупку
                </button>
                <button
                  onClick={() => scrollTo("services")}
                  className="px-8 py-4 bg-white/80 backdrop-blur-sm border border-white/60 font-body font-semibold text-lg rounded-2xl hover:scale-[1.02] hover:bg-white/90 transition-all flex items-center gap-2 text-brand-navy shadow-sm"
                >
                  <Icon name="Play" size={18} className="text-primary" />
                  Как это работает
                </button>
              </div>

              {/* Статистика под кнопками */}
              <div className="flex gap-8 mt-10 animate-fade-in-up delay-400">
                {[
                  { value: "500+", label: "проверенных фабрик" },
                  { value: "4.9★", label: "рейтинг клиентов" },
                  { value: "5 лет", label: "на рынке" },
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="font-display font-bold text-2xl text-brand-navy">{stat.value}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero — дракон */}
            <div className="relative animate-fade-in-up delay-200 flex items-center justify-center">
              <div
                className="relative will-change-transform w-full max-w-lg mx-auto"
                style={{ transform: `translateY(${scrollY * -0.06}px)` }}
              >


                {/* Слайдер видео поставщиков / дракон-заглушка */}
                {heroVideos.length > 0 ? (
                  <div className="relative w-56 md:w-64 mx-auto">
                    {/* Карточка видео */}
                    <div
                      className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl shadow-sky-400/30 border-4 border-white/70"
                    >
                      <video
                        key={heroVideos[heroVideoIdx].url}
                        src={heroVideos[heroVideoIdx].url}
                        muted
                        loop
                        playsInline
                        controls
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                      {/* Подпись */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-white/80 flex-shrink-0 bg-white/20">
                          {heroVideos[heroVideoIdx].avatar
                            ? <img src={heroVideos[heroVideoIdx].avatar} alt="" className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-white font-bold text-xs">{heroVideos[heroVideoIdx].seller?.[0]}</div>
                          }
                        </div>
                        <span className="text-white text-xs font-semibold drop-shadow truncate">{heroVideos[heroVideoIdx].seller}</span>
                      </div>
                    </div>

                    {/* Стрелки */}
                    {heroVideos.length > 1 && (
                      <div className="flex items-center justify-center gap-3 mt-3">
                        <button
                          onClick={() => setHeroVideoIdx(i => (i - 1 + heroVideos.length) % heroVideos.length)}
                          className="w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow transition-all"
                        >
                          <Icon name="ChevronLeft" size={16} className="text-brand-navy" />
                        </button>
                        <div className="flex gap-1.5">
                          {heroVideos.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setHeroVideoIdx(i)}
                              className="h-1.5 rounded-full transition-all"
                              style={{width: i === heroVideoIdx ? 16 : 5, background: i === heroVideoIdx ? "hsl(354,78%,52%)" : "rgba(0,0,0,0.2)"}}
                            />
                          ))}
                        </div>
                        <button
                          onClick={() => setHeroVideoIdx(i => (i + 1) % heroVideos.length)}
                          className="w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow transition-all"
                        >
                          <Icon name="ChevronRight" size={16} className="text-brand-navy" />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <img
                    src={DRAGON_IMAGE}
                    alt="Китайский дракон — символ удачи в торговле"
                    className="w-full animate-float drop-shadow-2xl object-contain rounded-xl"
                    style={{ animationDuration: "6s", filter: "drop-shadow(0 30px 50px rgba(180,30,30,0.25))" }}
                  />
                )}

                {/* Плавающая карточка — доставлено */}
                <div
                  className="absolute top-[15%] -left-6 bg-white rounded-2xl border border-white shadow-xl shadow-sky-300/25 px-4 py-3 flex items-center gap-3 animate-float z-20"
                  style={{ animationDelay: "0.8s", transform: `translateY(${scrollY * 0.08}px)` }}
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-mint flex items-center justify-center">
                    <Icon name="PackageCheck" size={20} className="text-brand-teal" />
                  </div>
                  <div>
                    <div className="font-display font-bold text-lg text-brand-navy leading-none">47</div>
                    <div className="text-[11px] text-muted-foreground">доставлено сегодня</div>
                  </div>
                </div>

                {/* Плавающая карточка — рейтинг */}
                <div
                  className="absolute bottom-[12%] -right-4 bg-white rounded-2xl border border-white shadow-xl shadow-sky-300/25 px-4 py-3 flex items-center gap-3 animate-float z-20"
                  style={{ animationDelay: "1.4s", transform: `translateY(${scrollY * -0.06}px)` }}
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                    <Icon name="Star" size={20} className="text-amber-500 fill-amber-500" />
                  </div>
                  <div>
                    <div className="font-display font-bold text-lg text-brand-navy leading-none">4.9</div>
                    <div className="text-[11px] text-muted-foreground">рейтинг клиентов</div>
                  </div>
                </div>

                {/* Плавающая карточка — фабрики */}
                <div
                  className="absolute top-[48%] -right-6 bg-white rounded-2xl border border-white shadow-xl shadow-sky-300/25 px-3.5 py-2.5 flex items-center gap-2 animate-float hidden sm:flex z-20"
                  style={{ animationDelay: "0.4s", transform: `translateY(calc(-50% + ${scrollY * 0.05}px))` }}
                >
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                    <Icon name="Store" size={16} className="text-primary" />
                  </div>
                  <div>
                    <div className="font-display font-bold text-sm text-brand-navy leading-none">500+</div>
                    <div className="text-[10px] text-muted-foreground">фабрик</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Волнистый переход */}
        <div className="absolute bottom-0 left-0 right-0 h-12 overflow-hidden">
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0 48V24C240 0 480 48 720 24C960 0 1200 48 1440 24V48H0Z" fill="hsl(200,60%,97%)" />
          </svg>
        </div>
      </section>



      {/* QUICK SERVICES GRID (портальная сетка) */}
      <section className="px-1 py-0" style={{background: "hsl(200,60%,97%)"}}>
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { icon: "Search", label: "Поиск товара", emoji: "🔍", action: () => navigate("/service/search") },
              { icon: "ShoppingCart", label: "Taobao", emoji: "🛒", img: "https://cdn.poehali.dev/projects/edb6cf3c-b4b5-4994-bb1e-ca5122151314/files/24af0b7d-b621-40d3-8eed-a085ffc71844.jpg", action: () => navigate("/service/buyout") },
              { icon: "Truck", label: "Доставка", emoji: "✈️", action: () => navigate("/service/delivery") },
              { icon: "Store", label: "Продавцы", emoji: "🏪", action: () => navigate("/service/suppliers") },
              { icon: "MessageSquare", label: "Чат с поставщиком", emoji: "💬", action: () => navigate("/sellers") },
              { icon: "FileText", label: "Оставить заявку", emoji: "📋", action: () => navigate("/account") },
            ].map((s, i) => (
              <button
                key={i}
                onClick={s.action}
                className="reveal group flex flex-col items-center gap-3 p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                style={{
                  animationDelay: `${i * 0.06}s`,
                  background: "rgba(255,255,255,0.72)",
                  backdropFilter: "blur(12px)",
                  border: "1.5px solid rgba(255,255,255,0.8)",
                  boxShadow: "0 4px 20px rgba(176,220,240,0.35), 0 1px 4px rgba(0,0,0,0.06)",
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 8px 32px rgba(176,220,240,0.55), 0 2px 8px rgba(0,0,0,0.08)")}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(176,220,240,0.35), 0 1px 4px rgba(0,0,0,0.06)")}
              >
                <div className="w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300"
                  style={{background: "linear-gradient(135deg, hsl(200,75%,88%), hsl(200,65%,94%))"}}>
                  {('img' in s && s.img)
                    ? <img src={s.img as string} alt={s.label} className="w-full h-full object-cover" />
                    : s.emoji}
                </div>
                <span className="text-sm font-semibold text-brand-navy text-center leading-tight">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* services anchor */}
      <div id="services" />

      {/* ABOUT */}
      <section id="about" className="py-24 px-4 relative overflow-hidden" style={{background: "hsl(200,60%,97%)"}}>
        {/* облака-декор */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 right-[5%] w-80 h-40 rounded-full bg-white/70 blur-3xl" />
          <div className="absolute bottom-0 left-[8%] w-64 h-32 rounded-full bg-white/60 blur-2xl" />
          <img src={ORNAMENT_IMAGE} alt="" className="absolute bottom-6 right-8 w-28 opacity-20 pointer-events-none select-none" style={{filter:"sepia(0.3) saturate(1.5)"}} />
        </div>

        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Левая — фото / карточки статистики */}
            <div className="reveal relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-sky-300/25 border-4 border-white/80">
                <img src={MARKET_IMAGE} alt="О компании ChinaCarts" className="w-full h-80 object-cover" />
                <div className="absolute inset-0" style={{background: "linear-gradient(to top, hsl(220,45%,18%,0.6) 0%, transparent 55%)"}} />
                <div className="absolute bottom-6 left-6 right-6 flex gap-3">
                  {[
                    { value: "2017", label: "год основания" },
                    { value: "500+", label: "фабрик" },
                    { value: "4.9★", label: "рейтинг" },
                  ].map((s, i) => (
                    <div key={i} className="flex-1 rounded-2xl px-3 py-2.5 text-center" style={{background:"rgba(255,255,255,0.18)", backdropFilter:"blur(10px)", border:"1px solid rgba(255,255,255,0.35)"}}>
                      <div className="font-display font-bold text-xl text-white leading-none">{s.value}</div>
                      <div className="text-[11px] text-white/80 mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* плавающая карточка — гарантия */}
              <div className="absolute -bottom-6 -right-4 bg-white rounded-2xl px-4 py-3 shadow-xl shadow-sky-300/20 border border-white flex items-center gap-3 animate-float" style={{animationDuration:"5s"}}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{background:"linear-gradient(135deg,hsl(354,78%,52%,0.12),hsl(25,85%,55%,0.18))"}}>🛡️</div>
                <div>
                  <div className="font-display font-bold text-sm text-brand-navy">Гарантия качества</div>
                  <div className="text-[11px] text-slate-500">фотоотчёт каждой поставки</div>
                </div>
              </div>
            </div>

            {/* Правая — текст */}
            <div className="reveal">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-5 text-primary" style={{background:"hsl(200,80%,90%)"}}>
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

              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { emoji: "🏭", title: "500+ фабрик", desc: "проверенная база поставщиков" },
                  { emoji: "🚀", title: "7 лет", desc: "опыта в закупках из Китая" },
                  { emoji: "📦", title: "10 000+", desc: "успешных поставок" },
                  { emoji: "⭐", title: "4.9 из 5", desc: "средний рейтинг клиентов" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-2xl transition-all" style={{background:"rgba(255,255,255,0.75)", backdropFilter:"blur(12px)", border:"1.5px solid rgba(255,255,255,0.85)", boxShadow:"0 4px 16px rgba(176,220,240,0.25)"}}>
                    <span className="text-2xl">{item.emoji}</span>
                    <div>
                      <div className="font-display font-bold text-brand-navy text-sm">{item.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => scrollTo("contacts")}
                className="btn-modern px-8 py-3.5 text-white font-bold rounded-2xl shadow-lg"
              >
                Начать закупку
              </button>
            </div>
          </div>
        </div>
      </section>

      <div id="reviews" />

      {/* SUPPLIERS */}
      {sellers.length > 0 && (
        <section className="pt-10 pb-20 px-4" style={{background: "hsl(200,60%,97%)"}}>
          <div className="container mx-auto">
            <div className="text-center mb-10 reveal">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold text-primary" style={{background:"hsl(200,80%,90%)"}}>
                Поставщики товаров
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {sellers.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => navigate(`/supplier/${s.id}`)}
                  className="reveal group flex flex-col items-center gap-0 transition-all duration-300 hover:-translate-y-1"
                  style={{ animationDelay: `${i * 0.07}s` }}
                >
                  <div
                    className="w-full aspect-square overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:shadow-sky-300/30"
                    style={{
                      borderRadius: "22px",
                      background: "rgba(255,255,255,0.85)",
                      border: "2px solid rgba(255,255,255,0.9)",
                      boxShadow: "0 4px 16px rgba(176,220,240,0.3), 0 1px 4px rgba(0,0,0,0.06)",
                    }}
                  >
                    {s.avatar_url ? (
                      <img
                        src={s.avatar_url}
                        alt={s.company_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl font-display font-bold text-primary" style={{background:"linear-gradient(135deg,hsl(200,70%,88%),hsl(200,60%,94%))"}}>
                        {s.company_name?.[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="mt-2.5 text-center">
                    <div className="text-sm font-bold text-brand-navy leading-tight line-clamp-1">{s.company_name}</div>
                    <div className="text-xs text-slate-500 mt-0.5 leading-tight">{s.city || "Китай"}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}



      {/* BLOG */}
      <section id="blog" className="py-24 px-4" style={{background: "hsl(200,60%,97%)"}}>
        <div className="container mx-auto">
          <div className="text-center mb-16 reveal">
            <div className="inline-block px-4 py-1 bg-accent rounded-full text-primary text-sm font-medium mb-4">Блог</div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-brand-navy">Советы и статьи <span className="text-grad">по закупкам</span></h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {articles.map((a, i) => (
              <div key={i} className="reveal card-soft bg-white rounded-2xl overflow-hidden cursor-pointer group" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="h-32 flex items-center justify-center text-5xl" style={{background: "linear-gradient(135deg, hsl(200,70%,90%), hsl(200,60%,94%)"}}>
                  {a.emoji}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs px-2 py-1 bg-accent text-primary rounded-full">{a.tag}</span>
                    <span className="text-xs text-muted-foreground">{a.time} чтения</span>
                  </div>
                  <h4 className="font-semibold text-sm leading-snug mb-3 text-brand-navy group-hover:text-primary transition-colors">{a.title}</h4>
                  <div className="text-xs text-muted-foreground">{a.date}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10 reveal">
            <button className="px-6 py-3 bg-white border border-border rounded-2xl text-sm font-medium hover:bg-secondary transition-all text-slate-600">
              Все статьи →
            </button>
          </div>
        </div>
      </section>

      <div id="contacts" />

      {/* FOOTER */}
      <footer className="py-12 px-4" style={{background: "hsl(220,45%,18%)"}}>
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl overflow-hidden" style={{background: "linear-gradient(135deg, hsl(200,75%,85%), hsl(200,65%,92%))"}}>
                  <img src={DRAGON_IMAGE} alt="ChinaCarts" className="w-full h-full object-cover scale-110" />
                </div>
                <span className="font-display font-bold text-xl text-white">China<span className="text-primary">Carts</span></span>
              </div>
              <p className="text-sm text-white/60 leading-relaxed">Полный цикл закупок в Китае. Работаем с 2017 года.</p>
            </div>
            {[
              { title: "Услуги", links: ["Поиск товаров", "Выкуп", "Доставка", "Таможня"] },
              { title: "Компания", links: ["О нас", "Отзывы", "Блог", "Партнёры"] },
              { title: "Поддержка", links: ["FAQ", "Контакты", "Конфиденциальность", "Оферта"] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="font-display font-bold text-sm uppercase tracking-wider mb-4 text-white">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((l, j) => (
                    <li key={j}><button className="text-sm text-white/60 hover:text-primary transition-colors">{l}</button></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-6 border-t border-white/15 flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-sm text-white/60">© 2025 ChinaCarts. Все права защищены.</span>
            <span className="text-sm text-white/60">🇨🇳 → 🇷🇺 Закупки из Китая в Россию</span>
          </div>
        </div>
      </footer>

      {/* Фуллскрин видео */}
      {heroVideoFs && heroVideos[heroVideoIdx] && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setHeroVideoFs(false)}
        >
          <button
            onClick={() => setHeroVideoFs(false)}
            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center z-20"
          >
            <Icon name="X" size={22} className="text-white" />
          </button>
          {heroVideos.length > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); setHeroVideoIdx(i => (i - 1 + heroVideos.length) % heroVideos.length); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center z-20"
              >
                <Icon name="ChevronLeft" size={24} className="text-white" />
              </button>
              <button
                onClick={e => { e.stopPropagation(); setHeroVideoIdx(i => (i + 1) % heroVideos.length); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center z-20"
              >
                <Icon name="ChevronRight" size={24} className="text-white" />
              </button>
            </>
          )}
          <video
            key={heroVideos[heroVideoIdx].url + "-fs"}
            src={heroVideos[heroVideoIdx].url}
            autoPlay
            loop
            controls
            playsInline
            className="max-w-full max-h-full rounded-2xl"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}

    </div>
  );
}