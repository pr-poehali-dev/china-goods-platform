import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import SellerVideos from "@/components/SellerVideos";
import AccountNavButton from "@/components/AccountNavButton";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/edb6cf3c-b4b5-4994-bb1e-ca5122151314/files/61cb79c7-649f-463e-b3ac-2da8e1dc13d9.jpg";
const DRAGON_IMAGE = "https://cdn.poehali.dev/projects/edb6cf3c-b4b5-4994-bb1e-ca5122151314/files/039ee8c0-b2b5-43f3-b255-98f11b27d55a.jpg";
const ORNAMENT_IMAGE = "https://cdn.poehali.dev/projects/edb6cf3c-b4b5-4994-bb1e-ca5122151314/files/5b125bbc-8e0c-4a31-84ad-dd9479d9bceb.jpg";
const MARKET_IMAGE = "https://cdn.poehali.dev/projects/edb6cf3c-b4b5-4994-bb1e-ca5122151314/files/9f7c44b7-9693-4e80-a84a-faf56a26d175.jpg";
const DELIVERY_IMAGE = "https://cdn.poehali.dev/projects/edb6cf3c-b4b5-4994-bb1e-ca5122151314/files/2ec59105-66a4-4c71-8c50-ef5bc2590bb9.jpg";
const MASCOT_IMAGE = "https://cdn.poehali.dev/projects/edb6cf3c-b4b5-4994-bb1e-ca5122151314/files/47da4abf-8071-42d0-a7b6-732be8d56989.jpg";


const services = [
  {
    icon: "Search",
    title: "Поиск товаров",
    desc: "Найдём лучших поставщиков на Alibaba, 1688, Taobao и других площадках. Проверим качество и репутацию фабрики.",
    steps: ["Подбор поставщиков", "Проверка качества", "Сравнение цен", "Переговоры"],
    bg: "bg-white",
    iconBg: "bg-[hsl(354,78%,52%)]",
    accent: "text-[hsl(354,78%,52%)]",
    price: "от 3 000 ₽",
  },
  {
    icon: "ShoppingCart",
    title: "Выкуп товаров",
    desc: "Выкупим товар от вашего имени, проведём оплату в юанях, оформим все документы и проверим вложение.",
    steps: ["Оплата в юанях", "Приёмка товара", "Фотоотчёт", "Упаковка"],
    bg: "bg-white",
    iconBg: "bg-[hsl(220,45%,14%)]",
    accent: "text-[hsl(220,45%,14%)]",
    price: "от 7%",
  },
  {
    icon: "Truck",
    title: "Доставка в Россию",
    desc: "Доставим груз любым удобным способом: авиа, авто или ж/д. Таможенное оформление под ключ.",
    steps: ["Авиа / авто / ж/д", "Таможня под ключ", "Страхование груза", "Доставка до двери"],
    bg: "bg-white",
    iconBg: "bg-[hsl(174,55%,38%)]",
    accent: "text-[hsl(174,55%,38%)]",
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
  const observerRef = useRef<IntersectionObserver | null>(null);
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

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
    { id: "services", label: "Услуги" },
    { id: "reviews", label: "Отзывы" },
    { id: "blog", label: "Блог" },
    { id: "contacts", label: "Контакты" },
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
            <div className="w-10 h-10 rounded-xl bg-accent border border-border flex items-center justify-center overflow-hidden">
              <img src={MASCOT_IMAGE} alt="TaoSeller" className="w-full h-full object-contain" />
            </div>
            <span className="font-display font-bold text-xl tracking-wide text-brand-navy">
              Tao<span className="text-primary">Seller</span>
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
            <Link
              to="/sellers"
              className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
            >
              Продавцы
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <AccountNavButton className="hidden lg:flex" />
            <button
              onClick={() => scrollTo("contacts")}
              className="hidden lg:flex btn-modern px-5 py-2 text-white font-bold text-sm rounded-xl"
            >Продавцам</button>
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
              to="/sellers"
              onClick={() => setMobileMenuOpen(false)}
              className="text-left px-4 py-3 rounded-lg hover:bg-secondary transition-all font-medium"
            >Продавцам </Link>
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
              <h1 className="font-display text-4xl md:text-5xl font-bold leading-[1.12] mb-6 animate-fade-in-up text-brand-navy">
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
                {/* Золотой орнамент — слева снизу */}
                <img
                  src={ORNAMENT_IMAGE}
                  alt=""
                  className="absolute -bottom-8 -left-10 w-32 opacity-60 animate-float select-none pointer-events-none"
                  style={{ animationDuration: "7s", animationDelay: "1s", filter: "sepia(0.3) saturate(1.5)" }}
                />
                {/* Золотой орнамент — справа сверху */}
                <img
                  src={ORNAMENT_IMAGE}
                  alt=""
                  className="absolute -top-6 -right-8 w-24 opacity-50 animate-float select-none pointer-events-none"
                  style={{ animationDuration: "8s", animationDelay: "0.5s", transform: "scaleX(-1) rotate(20deg)", filter: "sepia(0.3) saturate(1.5)" }}
                />

                {/* Сам дракон */}
                <img
                  src={DRAGON_IMAGE}
                  alt="Китайский дракон — символ удачи в торговле"
                  className="w-full object-contain animate-float drop-shadow-2xl"
                  style={{
                    animationDuration: "6s",
                    filter: "drop-shadow(0 30px 50px rgba(180,30,30,0.25))",
                  }}
                />

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

      {/* MARQUEE */}
      <div className="overflow-hidden py-3 border-y border-white/40" style={{background: "hsl(220,45%,18%)"}}>
        <div className="animate-marquee whitespace-nowrap flex gap-12 text-white/90 font-display font-medium text-sm">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="flex gap-12">
              <span>🔍 ПОИСК ПОСТАВЩИКОВ</span>
              <span>•</span>
              <span>💰 ВЫКУП В ЮАНЯХ</span>
              <span>•</span>
              <span>✈️ АВИАДОСТАВКА</span>
              <span>•</span>
              <span>🚛 АВТОДОСТАВКА</span>
              <span>•</span>
              <span>🚂 Ж/Д ДОСТАВКА</span>
              <span>•</span>
              <span>📋 ТАМОЖНЯ ПОД КЛЮЧ</span>
              <span>•</span>
              <span>📦 СТРАХОВАНИЕ ГРУЗА</span>
              <span>•</span>
              <span>🏭 500+ ФАБРИК</span>
              <span>•</span>
            </span>
          ))}
        </div>
      </div>

      {/* QUICK SERVICES GRID (портальная сетка) */}
      <section className="pt-20 pb-16 px-4" style={{background: "hsl(200,60%,97%)"}}>
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { icon: "Search", label: "Поиск товара", color: "bg-brand-sky", action: () => scrollTo("services") },
              { icon: "ShoppingCart", label: "Выкуп", color: "bg-brand-mint", action: () => scrollTo("services") },
              { icon: "Truck", label: "Доставка", color: "bg-brand-lilac", action: () => scrollTo("services") },
              { icon: "Store", label: "Продавцы", color: "bg-brand-peach", action: () => navigate("/sellers") },
              { icon: "MessageSquare", label: "Чат с поставщиком", color: "bg-brand-sky", action: () => navigate("/sellers") },
              { icon: "FileText", label: "Оставить заявку", color: "bg-brand-mint", action: () => scrollTo("contacts") },
            ].map((s, i) => (
              <button
                key={i}
                onClick={s.action}
                className="reveal card-soft group flex flex-col items-center gap-3 p-5 rounded-2xl bg-white"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className={`w-16 h-16 rounded-2xl ${s.color} flex items-center justify-center group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300`}>
                  <Icon name={s.icon} size={28} className="text-brand-navy" />
                </div>
                <span className="text-sm font-semibold text-brand-navy text-center leading-tight">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SELLER VIDEOS */}
      <SellerVideos />

      {/* MYTH vs REALITY */}
      <section className="py-24 px-4" style={{background: "linear-gradient(160deg, hsl(200,65%,95%), hsl(354,50%,96%)"}}>
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 reveal">
            <h2 className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-brand-navy leading-tight whitespace-nowrap">
              Думаете, закупки в Китае — <span className="text-grad">это сложно?</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Развеиваем главные мифы о заказах напрямую с фабрик</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 reveal">
            {/* MYTH */}
            <div className="bg-white rounded-2xl border border-border shadow-lg shadow-blue-500/10 overflow-hidden">
              <div className="bg-primary px-6 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                  <Icon name="X" size={18} className="text-primary" />
                </div>
                <span className="font-display font-bold text-xl text-white tracking-wide">МИФ</span>
              </div>
              <div className="p-6 space-y-4">
                {[
                  "Нужно лететь в Китай лично",
                  "Языковой барьер всё усложняет",
                  "Высокий риск нарваться на брак",
                  "Растаможка — это головная боль",
                ].map((t, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Icon name="X" size={18} className="text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-brand-navy font-medium">{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* REALITY */}
            <div className="bg-white rounded-2xl border border-border shadow-lg shadow-blue-500/10 overflow-hidden">
              <div className="bg-brand-teal px-6 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                  <Icon name="Check" size={18} className="text-brand-teal" />
                </div>
                <span className="font-display font-bold text-xl text-white tracking-wide">РЕАЛЬНОСТЬ</span>
              </div>
              <div className="p-6 space-y-4">
                {[
                  "Мы делаем всё за вас удалённо",
                  "Ведём переговоры на китайском",
                  "Проверяем товар и шлём фотоотчёт",
                  "Таможня под ключ — без забот",
                ].map((t, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Icon name="Check" size={18} className="text-brand-teal mt-0.5 flex-shrink-0" />
                    <span className="text-brand-navy font-medium">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 bg-brand-navy rounded-2xl px-6 py-5 flex items-center justify-center gap-3 reveal">
            <span className="text-2xl">💡</span>
            <p className="font-display font-bold text-lg md:text-xl text-white text-center">
              ЗАКАЗЫВАЙТЕ ИЗ КИТАЯ <span className="marker-yellow">ВЫГОДНО</span> — БЕЗ ПОЕЗДОК И РИСКОВ
            </p>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24 px-4" style={{background: "hsl(200,60%,97%)"}}>
        <div className="container mx-auto">
          <div className="text-center mb-16 reveal">
            <div className="inline-block px-4 py-1 bg-accent rounded-full text-primary text-sm font-bold mb-4">Наши услуги</div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-brand-navy">Полный цикл <span className="text-grad">закупок</span></h2>
            <p className="text-muted-foreground max-w-lg mx-auto">От поиска поставщика до доставки к вашей двери — берём на себя весь процесс</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <div key={i} className={`reveal card-soft ${s.bg} rounded-2xl overflow-hidden`} style={{ animationDelay: `${i * 0.15}s` }}>
                <div className={`h-1.5 w-full ${s.iconBg}`} />
                <div className="p-8">
                  <div className={`w-14 h-14 rounded-2xl ${s.iconBg} flex items-center justify-center mb-6 shadow-md`}>
                    <Icon name={s.icon} size={28} className="text-white" />
                  </div>
                  <h3 className="font-display font-bold text-2xl mb-3 text-brand-navy">{s.title}</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">{s.desc}</p>
                  <div className="space-y-2 mb-6">
                    {s.steps.map((step, j) => (
                      <div key={j} className="flex items-center gap-3 text-sm text-slate-600">
                        <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                          <Icon name="Check" size={12} className={s.accent} />
                        </div>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-slate-500 text-sm">Стоимость</span>
                    <span className={`font-display font-bold text-xl ${s.accent}`}>{s.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 bg-white rounded-2xl p-10 reveal card-soft">
            <h3 className="font-display font-bold text-2xl md:text-3xl text-center mb-10 text-brand-navy">Как мы работаем</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {[
                { n: "01", label: "Заявка", icon: "FileText" },
                { n: "02", label: "Поиск товара", icon: "Search" },
                { n: "03", label: "Согласование", icon: "MessageSquare" },
                { n: "04", label: "Выкуп и доставка", icon: "Package" },
                { n: "05", label: "Вы получаете", icon: "Home" },
              ].map((step, i) => (
                <div key={i} className="text-center relative">
                  {i < 4 && (
                    <div className="hidden md:block absolute top-6 left-[60%] w-full h-px bg-gradient-to-r from-primary/40 to-transparent" />
                  )}
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-3 relative z-10 shadow-md shadow-blue-500/25">
                    <Icon name={step.icon} size={20} className="text-white" />
                  </div>
                  <div className="font-display font-bold text-primary text-xs mb-1">{step.n}</div>
                  <div className="text-sm font-medium text-slate-600">{step.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="py-24 px-4" style={{background: "linear-gradient(180deg, hsl(200,70%,92%) 0%, hsl(200,60%,96%) 100%)"}}>
        <div className="container mx-auto">
          <div className="text-center mb-16 reveal">
            <div className="inline-block px-4 py-1 bg-accent rounded-full text-primary text-sm font-medium mb-4">Отзывы</div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-brand-navy">Что говорят <span className="text-grad">клиенты</span></h2>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => <span key={i} className="text-amber-400 text-xl">★</span>)}
              </div>
              <span className="font-display font-bold text-2xl text-brand-navy">4.9</span>
              <span className="text-muted-foreground">из 5 на основе 1 240 отзывов</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <div key={i} className="reveal card-soft bg-white rounded-2xl p-6" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center font-display font-bold text-white">
                      {r.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-brand-navy">{r.name}</div>
                      <div className="text-xs text-muted-foreground">{r.city}</div>
                    </div>
                  </div>
                  <div className="flex">
                    {[...Array(r.rating)].map((_, j) => <span key={j} className="text-amber-400 text-sm">★</span>)}
                  </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">"{r.text}"</p>
                <div className="flex items-center gap-2 pt-3 border-t border-border">
                  <Icon name="Package" size={14} className="text-primary" />
                  <span className="text-xs text-primary font-medium">{r.product}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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

      {/* CONTACTS */}
      <section id="contacts" className="py-24 px-4 relative overflow-hidden" style={{background: "linear-gradient(180deg, hsl(200,65%,92%) 0%, hsl(200,55%,96%) 100%)"}}>
        {/* облачный декор */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-8 left-[10%] w-64 h-32 rounded-full bg-white/60 blur-3xl" />
          <div className="absolute top-20 right-[8%] w-80 h-36 rounded-full bg-white/50 blur-3xl" />
          <div className="absolute bottom-10 left-[30%] w-56 h-24 rounded-full bg-white/55 blur-2xl" />
        </div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16 reveal">
            <div className="inline-block px-4 py-1 bg-accent rounded-full text-primary text-sm font-medium mb-4">Контакты</div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-brand-navy">Оставьте <span className="text-grad">заявку</span></h2>
            <p className="text-muted-foreground">Свяжемся в течение 30 минут и рассчитаем стоимость</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="reveal">
              <img src={DELIVERY_IMAGE} alt="delivery" className="w-full h-56 object-cover rounded-3xl mb-8 shadow-lg" />
              <div className="space-y-4">
                {[
                  { icon: "Phone", label: "+7 (800) 000-00-00", desc: "Бесплатно по России" },
                  { icon: "MessageCircle", label: "@taoseller_ru", desc: "Telegram (быстрее всего)" },
                  { icon: "Mail", label: "info@taoseller.ru", desc: "Email" },
                  { icon: "Clock", label: "09:00 — 21:00 МСК", desc: "Ежедневно" },
                ].map((c, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon name={c.icon} size={18} className="text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-brand-navy">{c.label}</div>
                      <div className="text-sm text-muted-foreground">{c.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="reveal bg-white card-soft rounded-2xl p-8">
              {formSent ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="font-display font-bold text-2xl mb-2 text-brand-navy">Заявка отправлена!</h3>
                  <p className="text-muted-foreground">Свяжемся с вами в течение 30 минут</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <h3 className="font-display font-bold text-2xl mb-6 text-brand-navy">ПОЛУЧИТЬ РАСЧЁТ</h3>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Ваше имя</label>
                    <input
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="Иван Иванов"
                      className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Телефон или Telegram</label>
                    <input
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      placeholder="+7 999 000 00 00"
                      className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Что нужно найти / заказать?</label>
                    <textarea
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Опишите товар, примерное количество и бюджет..."
                      rows={4}
                      className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full btn-modern py-4 text-white font-body font-bold text-lg rounded-2xl"
                  >
                    Отправить заявку
                  </button>
                  <p className="text-xs text-muted-foreground text-center">Нажимая кнопку, вы соглашаетесь на обработку персональных данных</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-4" style={{background: "hsl(220,45%,18%)"}}>
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center overflow-hidden">
                  <img src={MASCOT_IMAGE} alt="TaoSeller" className="w-full h-full object-contain" />
                </div>
                <span className="font-display font-bold text-xl text-white">Tao<span className="text-primary">Seller</span></span>
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
            <span className="text-sm text-white/60">© 2025 TaoSeller. Все права защищены.</span>
            <span className="text-sm text-white/60">🇨🇳 → 🇷🇺 Закупки из Китая в Россию</span>
          </div>
        </div>
      </footer>

    </div>
  );
}