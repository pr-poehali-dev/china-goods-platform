import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/edb6cf3c-b4b5-4994-bb1e-ca5122151314/files/61cb79c7-649f-463e-b3ac-2da8e1dc13d9.jpg";
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

const products = [
  { id: 1, name: "Электроника и гаджеты", emoji: "📱", price: "от 200 ₽", rating: 4.9, count: 1240, category: "electronics" },
  { id: 2, name: "Одежда и обувь", emoji: "👗", price: "от 150 ₽", rating: 4.8, count: 3800, category: "clothes" },
  { id: 3, name: "Товары для дома", emoji: "🏠", price: "от 100 ₽", rating: 4.7, count: 2100, category: "home" },
  { id: 4, name: "Автозапчасти", emoji: "🚗", price: "от 300 ₽", rating: 4.9, count: 890, category: "auto" },
  { id: 5, name: "Игрушки и хобби", emoji: "🎮", price: "от 80 ₽", rating: 4.8, count: 1560, category: "toys" },
  { id: 6, name: "Красота и здоровье", emoji: "💄", price: "от 120 ₽", rating: 4.6, count: 2300, category: "beauty" },
  { id: 7, name: "Спорт и активный отдых", emoji: "⚽", price: "от 250 ₽", rating: 4.7, count: 670, category: "sport" },
  { id: 8, name: "Инструменты", emoji: "🔧", price: "от 180 ₽", rating: 4.8, count: 940, category: "tools" },
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

const stats = [
  { value: "8 лет", label: "на рынке" },
  { value: "15 000+", label: "выполненных заказов" },
  { value: "98%", label: "довольных клиентов" },
  { value: "500+", label: "проверенных поставщиков" },
];

const orderHistory = [
  { id: "CB-2841", date: "10 мая 2025", product: "Смартфоны Samsung (50 шт)", status: "Доставлен", statusColor: "text-emerald-600 bg-emerald-50", amount: "180 000 ₽" },
  { id: "CB-2756", date: "2 апр 2025", product: "Одежда (120 кг)", status: "На таможне", statusColor: "text-amber-600 bg-amber-50", amount: "95 000 ₽" },
  { id: "CB-2701", date: "15 мар 2025", product: "Автозапчасти", status: "Доставлен", statusColor: "text-emerald-600 bg-emerald-50", amount: "62 000 ₽" },
];

export default function Index() {
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [catalogFilter, setCatalogFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [contactForm, setContactForm] = useState({ name: "", phone: "", message: "" });
  const [formSent, setFormSent] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("opacity-0-init");
            entry.target.classList.add("animate-fade-in-up");
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => {
      el.classList.add("opacity-0-init");
      observerRef.current?.observe(el);
    });
    return () => observerRef.current?.disconnect();
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
    { id: "catalog", label: "Каталог" },
    { id: "reviews", label: "Отзывы" },
    { id: "blog", label: "Блог" },
    { id: "contacts", label: "Контакты" },
  ];

  const filteredProducts = products.filter((p) => {
    const matchFilter = catalogFilter === "all" || p.category === catalogFilter;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setShowLoginModal(false);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-body">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => scrollTo("home")} className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-accent border-2 border-brand-navy flex items-center justify-center overflow-hidden">
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
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <button
                onClick={() => scrollTo("cabinet")}
                className="hidden lg:flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg text-sm hover:bg-secondary/80 transition-all"
              >
                <div className="w-6 h-6 bg-gradient-brand rounded-full flex items-center justify-center text-xs font-bold text-white">А</div>
                <span>Кабинет</span>
              </button>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="hidden lg:flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg text-sm hover:bg-secondary/80 transition-all"
              >
                <Icon name="User" size={16} />
                <span>Войти</span>
              </button>
            )}
            <button
              onClick={() => scrollTo("contacts")}
              className="hidden lg:flex px-5 py-2 bg-primary text-white font-bold text-sm rounded-lg border-2 border-brand-navy shadow-[3px_3px_0_hsl(220,45%,14%)] hover:scale-105 transition-all"
            >
              Получить расчёт
            </button>
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
            <button
              onClick={() => { setShowLoginModal(true); setMobileMenuOpen(false); }}
              className="text-left px-4 py-3 rounded-lg hover:bg-secondary transition-all font-medium"
            >
              {isLoggedIn ? "Личный кабинет" : "Войти"}
            </button>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="home" className="relative flex items-center overflow-hidden pt-24 pb-16 bg-hero-soft">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent border border-primary/20 rounded-full text-sm text-primary font-medium mb-6 animate-fade-in">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                🇨🇳 → 🇷🇺 Доставляем из Китая в Россию
              </div>
              <h1 className="font-display text-5xl md:text-6xl font-bold leading-[1.15] mb-6 animate-fade-in-up text-brand-navy">
                ЗАКУПКИ В КИТАЕ{" "}
                <span className="marker-red">ПОД КЛЮЧ</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-lg animate-fade-in-up delay-200">
                Найдём, выкупим и доставим любой товар из Китая. Проверенные поставщики, таможня под ключ, полная прозрачность на каждом этапе.
              </p>
              <div className="flex flex-wrap gap-4 animate-fade-in-up delay-300">
                <button
                  onClick={() => scrollTo("contacts")}
                  className="px-8 py-4 bg-primary text-white font-display font-bold text-lg rounded-xl border-2 border-brand-navy transition-all hover:scale-105 shadow-[4px_4px_0_hsl(220,45%,14%)]"
                >
                  Начать закупку
                </button>
                <button
                  onClick={() => scrollTo("services")}
                  className="px-8 py-4 bg-white border border-border font-display font-semibold text-lg rounded-2xl hover:bg-secondary transition-all flex items-center gap-2 text-slate-600"
                >
                  <Icon name="Play" size={18} className="text-primary" />
                  Как это работает
                </button>
              </div>
              <div className="mt-12 flex flex-wrap gap-8 animate-fade-in-up delay-400">
                {stats.map((s) => (
                  <div key={s.label}>
                    <div className="font-display font-bold text-3xl text-primary">{s.value}</div>
                    <div className="text-sm text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero visual card */}
            <div className="relative animate-fade-in-up delay-200">
              <div className="rounded-2xl overflow-hidden bg-white border-2 border-brand-navy flex items-center justify-center p-8 shadow-[8px_8px_0_hsl(220,45%,14%)]">
                <img src={MASCOT_IMAGE} alt="TaoSeller маскот" className="w-full max-w-sm h-[360px] object-contain animate-float" />
              </div>
              <div className="absolute -top-4 -left-4 hidden md:block animate-float">
                <div className="bg-white rounded-xl p-4 border-2 border-brand-navy shadow-[3px_3px_0_hsl(220,45%,14%)]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                      <Icon name="TrendingUp" size={20} className="text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Сегодня доставлено</div>
                      <div className="font-display font-bold text-lg text-brand-navy">47 заказов</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 hidden md:block animate-float delay-500">
                <div className="bg-white rounded-xl p-4 border-2 border-brand-navy shadow-[3px_3px_0_hsl(220,45%,14%)]">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⭐</span>
                    <div>
                      <div className="text-xs text-muted-foreground">Средний рейтинг</div>
                      <div className="font-display font-bold text-lg text-brand-navy">4.9 / 5.0</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="overflow-hidden bg-navy py-3 border-y-2 border-brand-navy">
        <div className="animate-marquee whitespace-nowrap flex gap-12 text-white font-display font-medium text-sm">
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

      {/* MYTH vs REALITY */}
      <section className="py-24 px-4 bg-cream">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 reveal">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-brand-navy leading-tight">
              ДУМАЕТЕ, ЗАКУПКИ В КИТАЕ —{" "}
              <span className="marker-red">ЭТО СЛОЖНО?</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Развеиваем главные мифы о заказах напрямую с фабрик</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 reveal">
            {/* MYTH */}
            <div className="bg-white rounded-2xl border-2 border-brand-navy shadow-[5px_5px_0_hsl(220,45%,14%)] overflow-hidden">
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
            <div className="bg-white rounded-2xl border-2 border-brand-navy shadow-[5px_5px_0_hsl(220,45%,14%)] overflow-hidden">
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
      <section id="services" className="py-24 px-4 blob-bg">
        <div className="container mx-auto">
          <div className="text-center mb-16 reveal">
            <div className="inline-block px-4 py-1 bg-accent rounded-full text-primary text-sm font-bold mb-4">Наши услуги</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-brand-navy">ПОЛНЫЙ ЦИКЛ <span className="marker-red">ЗАКУПОК</span></h2>
            <p className="text-muted-foreground max-w-lg mx-auto">От поиска поставщика до доставки к вашей двери — берём на себя весь процесс</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <div key={i} className={`reveal card-soft ${s.bg} rounded-2xl overflow-hidden`} style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="p-8">
                  <div className={`w-14 h-14 rounded-xl ${s.iconBg} flex items-center justify-center mb-6 border-2 border-brand-navy`}>
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
            <h3 className="font-display font-bold text-3xl text-center mb-10 text-brand-navy">КАК МЫ РАБОТАЕМ</h3>
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
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-3 relative z-10 border-2 border-brand-navy shadow-[3px_3px_0_hsl(220,45%,14%)]">
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

      {/* CATALOG */}
      <section id="catalog" className="py-24 px-4 bg-secondary/40">
        <div className="container mx-auto">
          <div className="text-center mb-12 reveal">
            <div className="inline-block px-4 py-1 bg-accent rounded-full text-primary text-sm font-medium mb-4">Каталог</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-brand-navy">КАТЕГОРИИ <span className="marker-red">ТОВАРОВ</span></h2>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8 reveal">
            <div className="relative flex-1">
              <Icon name="Search" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Найти категорию товаров..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {["all", "electronics", "clothes", "home", "auto"].map((f) => (
                <button
                  key={f}
                  onClick={() => setCatalogFilter(f)}
                  className={`px-4 py-3 rounded-2xl text-sm font-medium whitespace-nowrap transition-all ${
                    catalogFilter === f ? "bg-primary text-primary-foreground" : "bg-white border border-border hover:bg-secondary text-slate-600"
                  }`}
                >
                  {{ all: "Все", electronics: "Электроника", clothes: "Одежда", home: "Дом", auto: "Авто" }[f as string]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filteredProducts.map((p, i) => (
              <div key={p.id} className="reveal card-soft bg-white rounded-2xl p-6 cursor-pointer" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-4xl mb-4">{p.emoji}</div>
                <h4 className="font-display font-semibold text-lg mb-2 leading-tight text-brand-navy">{p.name}</h4>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className={`text-xs ${j < Math.floor(p.rating) ? "text-amber-400" : "text-slate-300"}`}>★</span>
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">{p.rating}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-primary font-display font-bold">{p.price}</span>
                  <span className="text-xs text-muted-foreground">{p.count.toLocaleString()} поз.</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10 reveal">
            <button
              onClick={() => scrollTo("contacts")}
              className="px-8 py-4 bg-primary text-white font-display font-bold rounded-xl border-2 border-brand-navy shadow-[4px_4px_0_hsl(220,45%,14%)] hover:scale-105 transition-all"
            >
              Заказать подбор товара
            </button>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="py-24 px-4 blob-bg">
        <div className="container mx-auto">
          <div className="text-center mb-16 reveal">
            <div className="inline-block px-4 py-1 bg-accent rounded-full text-primary text-sm font-medium mb-4">Отзывы</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-brand-navy">ЧТО ГОВОРЯТ <span className="marker-red">КЛИЕНТЫ</span></h2>
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
      <section id="blog" className="py-24 px-4 bg-secondary/40">
        <div className="container mx-auto">
          <div className="text-center mb-16 reveal">
            <div className="inline-block px-4 py-1 bg-accent rounded-full text-primary text-sm font-medium mb-4">Блог</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-brand-navy">СОВЕТЫ И СТАТЬИ <span className="marker-red">ПО ЗАКУПКАМ</span></h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {articles.map((a, i) => (
              <div key={i} className="reveal card-soft bg-white rounded-2xl overflow-hidden cursor-pointer group" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="h-32 bg-accent flex items-center justify-center text-5xl">
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

      {/* PERSONAL CABINET */}
      <section id="cabinet" className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16 reveal">
            <div className="inline-block px-4 py-1 bg-accent rounded-full text-primary text-sm font-medium mb-4">Личный кабинет</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-brand-navy">ИСТОРИЯ ЗАКАЗОВ И <span className="marker-red">СЧЕТА</span></h2>
          </div>

          {isLoggedIn ? (
            <div className="max-w-4xl mx-auto reveal">
              <div className="bg-white card-soft rounded-2xl p-6 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center font-display font-bold text-2xl text-white">А</div>
                  <div>
                    <div className="font-display font-bold text-xl text-brand-navy">Алексей Петров</div>
                    <div className="text-muted-foreground text-sm">alexey@example.com · Клиент с 2022 года</div>
                  </div>
                </div>
                <div className="hidden md:flex gap-6">
                  <div className="text-center">
                    <div className="font-display font-bold text-xl text-primary">12</div>
                    <div className="text-xs text-muted-foreground">Заказов</div>
                  </div>
                  <div className="text-center">
                    <div className="font-display font-bold text-xl text-brand-teal">2</div>
                    <div className="text-xs text-muted-foreground">В пути</div>
                  </div>
                </div>
              </div>

              <div className="bg-white card-soft rounded-2xl overflow-hidden mb-6">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                  <h3 className="font-display font-bold text-xl text-brand-navy">ИСТОРИЯ ЗАКАЗОВ</h3>
                  <button className="text-sm text-primary hover:underline">Все заказы →</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-secondary/40">
                        <th className="text-left px-6 py-3 text-xs text-muted-foreground font-medium">№ Заказа</th>
                        <th className="text-left px-6 py-3 text-xs text-muted-foreground font-medium">Дата</th>
                        <th className="text-left px-6 py-3 text-xs text-muted-foreground font-medium">Товар</th>
                        <th className="text-left px-6 py-3 text-xs text-muted-foreground font-medium">Статус</th>
                        <th className="text-right px-6 py-3 text-xs text-muted-foreground font-medium">Сумма</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderHistory.map((o, i) => (
                        <tr key={i} className="border-b border-border last:border-0 hover:bg-secondary/40 transition-colors">
                          <td className="px-6 py-4 text-sm font-mono text-primary">{o.id}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{o.date}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{o.product}</td>
                          <td className="px-6 py-4">
                            <span className={`text-xs font-medium px-3 py-1 rounded-full ${o.statusColor}`}>{o.status}</span>
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-right text-brand-navy">{o.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white card-soft rounded-2xl p-6">
                <h3 className="font-display font-bold text-xl mb-4 text-brand-navy">СЧЕТА НА ОПЛАТУ</h3>
                <div className="space-y-3">
                  {[
                    { num: "INV-2841", date: "8 мая 2025", amount: "180 000 ₽", status: "Оплачен", paid: true },
                    { num: "INV-2756", date: "1 апр 2025", amount: "95 000 ₽", status: "Ожидает оплаты", paid: false },
                  ].map((inv, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-secondary/50 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${inv.paid ? "bg-emerald-100" : "bg-amber-100"}`}>
                          <Icon name="FileText" size={16} className={inv.paid ? "text-emerald-600" : "text-amber-600"} />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-brand-navy">{inv.num}</div>
                          <div className="text-xs text-muted-foreground">{inv.date}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-sm text-brand-navy">{inv.amount}</div>
                        <div className={`text-xs ${inv.paid ? "text-emerald-600" : "text-amber-600"}`}>{inv.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 text-center">
                <button onClick={() => setIsLoggedIn(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Выйти из аккаунта
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-md mx-auto text-center reveal">
              <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="Lock" size={32} className="text-primary" />
              </div>
              <p className="text-muted-foreground mb-6">Войдите в личный кабинет, чтобы просматривать историю заказов и счета</p>
              <button
                onClick={() => setShowLoginModal(true)}
                className="px-8 py-4 bg-primary text-white font-display font-bold rounded-xl border-2 border-brand-navy shadow-[4px_4px_0_hsl(220,45%,14%)] hover:scale-105 transition-all"
              >
                Войти в кабинет
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-24 px-4 bg-secondary/40">
        <div className="container mx-auto">
          <div className="text-center mb-16 reveal">
            <div className="inline-block px-4 py-1 bg-accent rounded-full text-primary text-sm font-medium mb-4">Контакты</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-brand-navy">ОСТАВЬТЕ <span className="marker-red">ЗАЯВКУ</span></h2>
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
                    className="w-full py-4 bg-primary text-white font-display font-bold text-lg rounded-xl border-2 border-brand-navy shadow-[4px_4px_0_hsl(220,45%,14%)] hover:scale-[1.02] transition-all"
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
      <footer className="bg-navy py-12 px-4">
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

      {/* LOGIN MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowLoginModal(false)} />
          <div className="relative bg-white border-2 border-brand-navy rounded-2xl p-8 w-full max-w-md shadow-[8px_8px_0_hsl(220,45%,14%)] animate-scale-in">
            <button onClick={() => setShowLoginModal(false)} className="absolute top-4 right-4 p-2 hover:bg-secondary rounded-xl transition-all">
              <Icon name="X" size={18} />
            </button>
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon name="User" size={24} className="text-white" />
              </div>
              <h3 className="font-display font-bold text-2xl text-brand-navy">ВОЙТИ В КАБИНЕТ</h3>
              <p className="text-sm text-muted-foreground mt-1">Введите данные для входа</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Email</label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Пароль</label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-primary text-white font-display font-bold rounded-xl border-2 border-brand-navy shadow-[4px_4px_0_hsl(220,45%,14%)] hover:scale-[1.02] transition-all"
              >
                Войти
              </button>
              <p className="text-center text-sm text-muted-foreground">
                Нет аккаунта?{" "}
                <button type="button" className="text-primary hover:underline">Зарегистрироваться</button>
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}