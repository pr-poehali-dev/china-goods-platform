import { useParams, Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const DRAGON_IMAGE = "https://cdn.poehali.dev/projects/edb6cf3c-b4b5-4994-bb1e-ca5122151314/files/34d465ef-9cc6-42bc-bc73-7069c0d29790.jpg";

const services: Record<string, {
  emoji: string;
  title: string;
  subtitle: string;
  description: string;
  price: string;
  priceNote: string;
  steps: { icon: string; title: string; desc: string }[];
  features: { emoji: string; title: string; desc: string }[];
  faq: { q: string; a: string }[];
  cta: string;
}> = {
  search: {
    emoji: "🔍",
    title: "Поиск товаров",
    subtitle: "Найдём лучших поставщиков на Alibaba, 1688, Taobao",
    description: "Мы самостоятельно ищем поставщиков под ваш запрос, проверяем репутацию фабрики, сравниваем цены и условия. Вы получаете готовый список с рекомендацией — без языкового барьера и рисков нарваться на мошенников.",
    price: "от 3 000 ₽",
    priceNote: "за подбор до 5 поставщиков",
    steps: [
      { icon: "FileText", title: "Заявка", desc: "Опишите товар, количество и бюджет" },
      { icon: "Search", title: "Поиск", desc: "Ищем на всех китайских площадках" },
      { icon: "ShieldCheck", title: "Проверка", desc: "Проверяем репутацию и документы фабрики" },
      { icon: "MessageSquare", title: "Переговоры", desc: "Ведём переговоры на китайском" },
      { icon: "FileCheck", title: "Отчёт", desc: "Получаете список с ценами и рекомендацией" },
    ],
    features: [
      { emoji: "🏭", title: "500+ проверенных фабрик", desc: "В нашей базе — только надёжные поставщики с историей" },
      { emoji: "🇨🇳", title: "Переговоры на китайском", desc: "Наши менеджеры говорят на мандаринском — никакого языкового барьера" },
      { emoji: "📊", title: "Сравнение цен", desc: "Находим минимум 3–5 вариантов и помогаем выбрать лучший" },
      { emoji: "🛡️", title: "Проверка надёжности", desc: "Изучаем лицензии, отзывы, историю поставок фабрики" },
    ],
    faq: [
      { q: "Сколько времени занимает поиск?", a: "Обычно 1–3 рабочих дня. Зависит от сложности товара и количества поставщиков." },
      { q: "Какие площадки вы используете?", a: "Alibaba, 1688, Taobao, Made-in-China, DHGate и прямые контакты фабрик." },
      { q: "Что входит в отчёт?", a: "Название и контакты фабрики, цены на партию, MOQ (минимальный заказ), фото товара, наша рекомендация." },
      { q: "Могу ли я потом сам связаться с поставщиком?", a: "Да, мы передаём все контакты. Или можем помочь с дальнейшими переговорами и выкупом." },
    ],
    cta: "Найти поставщика",
  },
  buyout: {
    emoji: "🛒",
    title: "Выкуп товаров",
    subtitle: "Выкупим от вашего имени, оплатим в юанях, проверим качество",
    description: "Берём на себя всё: от оплаты поставщику в юанях до приёмки товара на нашем складе в Китае. Делаем фотоотчёт каждой позиции, проверяем соответствие заказу и отправляем в Россию.",
    price: "от 7%",
    priceNote: "от суммы заказа (мин. 2 000 ₽)",
    steps: [
      { icon: "Link", title: "Ссылка на товар", desc: "Пришлите ссылку или название товара" },
      { icon: "CreditCard", title: "Оплата в юанях", desc: "Переводим оплату поставщику" },
      { icon: "Package", title: "Приёмка", desc: "Получаем товар на склад в Китае" },
      { icon: "Camera", title: "Фотоотчёт", desc: "Фотографируем каждую позицию" },
      { icon: "Truck", title: "Отправка", desc: "Упаковываем и отправляем в Россию" },
    ],
    features: [
      { emoji: "💴", title: "Оплата в юанях", desc: "Переводим напрямую фабрике без потерь на конвертации" },
      { emoji: "📸", title: "Фотоотчёт", desc: "Фото каждого товара до отправки — видите что едет" },
      { emoji: "✅", title: "Проверка качества", desc: "Сверяем с описанием, проверяем брак и дефекты" },
      { emoji: "📦", title: "Упаковка", desc: "Надёжная упаковка для дальней перевозки" },
    ],
    faq: [
      { q: "Какой минимальный заказ?", a: "Нет ограничений по сумме. Но минимальная комиссия — 2 000 ₽." },
      { q: "Как происходит оплата?", a: "Вы переводите нам сумму в рублях, мы конвертируем и платим поставщику в юанях." },
      { q: "Что если товар не соответствует описанию?", a: "Мы не отправим брак. Свяжемся с поставщиком для замены или возврата средств." },
      { q: "Сколько времени занимает выкуп?", a: "1–3 дня после получения оплаты. Зависит от поставщика." },
    ],
    cta: "Выкупить товар",
  },
  delivery: {
    emoji: "✈️",
    title: "Доставка в Россию",
    subtitle: "Авиа, авто или ж/д — таможня под ключ",
    description: "Доставляем груз любым способом: авиа (5–10 дней), авто (15–25 дней) или ж/д (20–30 дней). Таможенное оформление, страхование груза, доставка до вашего склада или адреса — всё включено.",
    price: "от 5 $/кг",
    priceNote: "зависит от способа и объёма",
    steps: [
      { icon: "PackageCheck", title: "Приёмка в Китае", desc: "Принимаем ваш груз на склад" },
      { icon: "FileText", title: "Документы", desc: "Оформляем все необходимые документы" },
      { icon: "Plane", title: "Отправка", desc: "Выбираем оптимальный маршрут" },
      { icon: "ScrollText", title: "Таможня", desc: "Проходим таможенное оформление" },
      { icon: "Home", title: "Доставка", desc: "Привозим до вашего адреса" },
    ],
    features: [
      { emoji: "✈️", title: "Авиадоставка за 5–10 дней", desc: "Для срочных и ценных грузов" },
      { emoji: "🚛", title: "Автодоставка за 15–25 дней", desc: "Оптимальное соотношение цены и скорости" },
      { emoji: "🚂", title: "Ж/Д доставка за 20–30 дней", desc: "Выгодно для крупных партий" },
      { emoji: "📋", title: "Таможня под ключ", desc: "Берём на себя все таможенные формальности" },
    ],
    faq: [
      { q: "Какой способ доставки выбрать?", a: "Авиа — для срочных и дорогих товаров. Авто — оптимально для большинства. Ж/Д — для крупных партий весом от 100 кг." },
      { q: "Что входит в таможенное оформление?", a: "Декларирование, оплата пошлин, получение разрешительных документов, работа с таможенным брокером." },
      { q: "Страхуете ли вы груз?", a: "Да, страхование входит в стоимость по запросу. Рекомендуем для товаров дороже $500." },
      { q: "Есть ли ограничения по весу и размеру?", a: "Принимаем грузы любого размера — от 1 кг посылок до полных контейнеров." },
    ],
    cta: "Рассчитать доставку",
  },
  suppliers: {
    emoji: "🏪",
    title: "Каталог поставщиков",
    subtitle: "Проверенные поставщики из Китая на одной платформе",
    description: "Просматривайте профили реальных китайских поставщиков с фото, видео с производства и каталогом товаров. Пишите напрямую через встроенный чат с автоматическим переводом на китайский язык.",
    price: "Бесплатно",
    priceNote: "для покупателей",
    steps: [
      { icon: "Search", title: "Найдите поставщика", desc: "Листайте карточки с фото и видео" },
      { icon: "UserRound", title: "Изучите профиль", desc: "Посмотрите товары, видео с производства" },
      { icon: "MessageCircle", title: "Напишите", desc: "Чат с автопереводом RU ↔ 中文" },
      { icon: "PackageCheck", title: "Договоритесь", desc: "Согласуйте условия, цены и сроки" },
      { icon: "Truck", title: "Оформите заказ", desc: "Мы поможем с выкупом и доставкой" },
    ],
    features: [
      { emoji: "💬", title: "Чат с переводом", desc: "Пишите по-русски — поставщик получит на китайском" },
      { emoji: "🎬", title: "Видео с производства", desc: "Смотрите реальные видео с фабрик" },
      { emoji: "✅", title: "Проверенные профили", desc: "Все поставщики прошли верификацию" },
      { emoji: "🆓", title: "Бесплатно", desc: "Для покупателей каталог и чат полностью бесплатны" },
    ],
    faq: [
      { q: "Как связаться с поставщиком?", a: "Нажмите «Написать поставщику» на странице профиля. Ваше сообщение автоматически переведётся на китайский." },
      { q: "Нужна ли регистрация?", a: "Нет, можно написать без регистрации — просто укажите имя при первом сообщении." },
      { q: "Поставщики настоящие?", a: "Да, все поставщики регистрируются и заполняют профиль самостоятельно. Мы проверяем данные." },
      { q: "Могу ли я заказать напрямую?", a: "Да. Или воспользуйтесь нашим сервисом выкупа — мы проверим качество и доставим." },
    ],
    cta: "Смотреть поставщиков",
  },
};

const ctaLinks: Record<string, string> = {
  search: "/account",
  buyout: "/account",
  delivery: "/account",
  suppliers: "/sellers",
};

export default function ServicePage() {
  const { slug } = useParams<{ slug: string }>();
  const service = services[slug ?? ""];

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background:"hsl(200,60%,97%)"}}>
        <div className="text-center">
          <div className="text-6xl mb-4">🐉</div>
          <h2 className="font-display font-bold text-2xl text-brand-navy mb-2">Услуга не найдена</h2>
          <Link to="/" className="text-primary underline">На главную</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-body" style={{background:"hsl(200,60%,97%)"}}>

      <SiteHeader />

      {/* HERO */}
      <section className="pt-28 pb-16 px-4 relative overflow-hidden" style={{background:"linear-gradient(180deg, hsl(200,75%,85%) 0%, hsl(200,65%,93%) 100%)"}}>
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-8 left-[5%] w-72 h-40 rounded-full bg-white/70 blur-3xl" />
          <div className="absolute top-12 right-[8%] w-80 h-36 rounded-full bg-white/60 blur-3xl" />
        </div>
        <div className="container mx-auto relative z-10 text-center max-w-3xl">
          <div className="text-6xl mb-5">{service.emoji}</div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-4 text-primary" style={{background:"rgba(255,255,255,0.8)"}}>
            Услуга ChinaCarts
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-navy mb-4 leading-tight">
            {service.title}
          </h1>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">{service.subtitle}</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to={ctaLinks[slug ?? ""] || "/account"}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-bold text-lg shadow-lg transition-all hover:-translate-y-0.5"
              style={{background:"linear-gradient(135deg, hsl(354,78%,52%), hsl(25,85%,55%))"}}
            >
              {service.cta}
            </Link>
            <div className="text-center">
              <div className="font-display font-bold text-2xl text-brand-navy">{service.price}</div>
              <div className="text-xs text-slate-500">{service.priceNote}</div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 space-y-16 max-w-5xl">

        {/* Описание */}
        <section className="rounded-3xl p-8 md:p-12" style={{background:"rgba(255,255,255,0.8)", backdropFilter:"blur(16px)", border:"1.5px solid rgba(255,255,255,0.9)", boxShadow:"0 8px 32px rgba(176,220,240,0.25)"}}>
          <p className="text-lg text-slate-600 leading-relaxed">{service.description}</p>
        </section>

        {/* Как это работает */}
        <section>
          <h2 className="font-display text-3xl font-bold text-brand-navy mb-8 text-center">Как это работает</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {service.steps.map((step, i) => (
              <div key={i} className="relative text-center">
                {i < service.steps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-[60%] w-full h-px bg-gradient-to-r from-primary/30 to-transparent" />
                )}
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 relative z-10"
                  style={{background:"linear-gradient(135deg, hsl(354,78%,52%), hsl(25,85%,55%))", boxShadow:"0 4px 12px rgba(200,50,50,0.3)"}}
                >
                  <Icon name={step.icon} size={20} className="text-white" />
                </div>
                <div className="font-display font-bold text-xs text-primary mb-1">0{i+1}</div>
                <div className="font-semibold text-sm text-brand-navy mb-1">{step.title}</div>
                <div className="text-xs text-slate-500 leading-snug">{step.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Преимущества */}
        <section>
          <h2 className="font-display text-3xl font-bold text-brand-navy mb-8 text-center">Что вы получаете</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {service.features.map((f, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-6 rounded-2xl transition-all hover:-translate-y-0.5"
                style={{background:"rgba(255,255,255,0.8)", backdropFilter:"blur(12px)", border:"1.5px solid rgba(255,255,255,0.9)", boxShadow:"0 4px 20px rgba(176,220,240,0.25)"}}
              >
                <div className="text-3xl flex-shrink-0">{f.emoji}</div>
                <div>
                  <div className="font-display font-bold text-brand-navy mb-1">{f.title}</div>
                  <div className="text-sm text-slate-500 leading-relaxed">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="font-display text-3xl font-bold text-brand-navy mb-8 text-center">Частые вопросы</h2>
          <div className="space-y-4">
            {service.faq.map((item, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl"
                style={{background:"rgba(255,255,255,0.8)", backdropFilter:"blur(12px)", border:"1.5px solid rgba(255,255,255,0.9)", boxShadow:"0 4px 16px rgba(176,220,240,0.2)"}}
              >
                <div className="font-display font-bold text-brand-navy mb-2 flex items-start gap-2">
                  <span className="text-primary flex-shrink-0">Q.</span>
                  {item.q}
                </div>
                <div className="text-slate-600 text-sm leading-relaxed pl-5">{item.a}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-3xl p-10 text-center relative overflow-hidden" style={{background:"hsl(220,45%,18%)"}}>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-5">
            <span className="text-[200px]">🐉</span>
          </div>
          <div className="relative z-10">
            <div className="text-4xl mb-4">{service.emoji}</div>
            <h3 className="font-display font-bold text-2xl md:text-3xl text-white mb-3">Готовы начать?</h3>
            <p className="text-white/70 mb-8">Свяжемся в течение 30 минут и рассчитаем стоимость</p>
            <Link
              to={ctaLinks[slug ?? ""] || "/account"}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-bold text-lg shadow-lg transition-all hover:-translate-y-0.5"
              style={{background:"linear-gradient(135deg, hsl(354,78%,52%), hsl(25,85%,55%))"}}
            >
              <Icon name="MessageCircle" size={18} />
              {service.cta}
            </Link>
          </div>
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}