import { useParams, Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import AccountNavButton from "@/components/AccountNavButton";

const DRAGON_IMAGE = "https://cdn.poehali.dev/projects/edb6cf3c-b4b5-4994-bb1e-ca5122151314/files/039ee8c0-b2b5-43f3-b255-98f11b27d55a.jpg";

const suppliers: Record<string, {
  img: string;
  name: string;
  goods: string;
  city: string;
  since: string;
  rating: number;
  deals: number;
  desc: string;
  telegram: string;
  wechat: string;
  catalog: { emoji: string; name: string; price: string }[];
  video?: string;
}> = {
  "0": {
    img: "https://cdn.poehali.dev/projects/edb6cf3c-b4b5-4994-bb1e-ca5122151314/files/08259d93-d86e-4c2e-a738-ab7bd64c10f1.jpg",
    name: "Мэй Лин",
    goods: "Одежда женская",
    city: "Гуанчжоу",
    since: "2018",
    rating: 4.9,
    deals: 320,
    desc: "Фабрика женской одежды в Гуанчжоу. Производим платья, блузы, брюки и верхнюю одежду. Минимальный заказ от 50 единиц. Работаем с российскими покупателями с 2018 года, всегда на связи, делаем видео-отчёт перед отправкой.",
    telegram: "@meilin_factory",
    wechat: "meilin_gz",
    catalog: [
      { emoji: "👗", name: "Платья летние", price: "от 8$/шт" },
      { emoji: "👚", name: "Блузы женские", price: "от 6$/шт" },
      { emoji: "🧥", name: "Куртки осенние", price: "от 18$/шт" },
      { emoji: "👖", name: "Брюки и джинсы", price: "от 9$/шт" },
    ],
  },
  "1": {
    img: "https://cdn.poehali.dev/projects/edb6cf3c-b4b5-4994-bb1e-ca5122151314/files/b578a264-883c-4530-bff9-41a76d705629.jpg",
    name: "Чжан Вэй",
    goods: "Электроника",
    city: "Шэньчжэнь",
    since: "2016",
    rating: 4.8,
    deals: 510,
    desc: "Официальный дистрибьютор электроники из Шэньчжэня. Смартфоны, планшеты, гаджеты, умные часы. Гарантия на все товары, сертификаты CE. Работаем с оптовыми покупателями от 10 единиц.",
    telegram: "@zhangwei_tech",
    wechat: "zhangwei_sz",
    catalog: [
      { emoji: "📱", name: "Смартфоны", price: "от 45$/шт" },
      { emoji: "⌚", name: "Умные часы", price: "от 12$/шт" },
      { emoji: "🎧", name: "Наушники TWS", price: "от 7$/шт" },
      { emoji: "💻", name: "Планшеты", price: "от 60$/шт" },
    ],
  },
  "2": {
    img: "https://cdn.poehali.dev/projects/edb6cf3c-b4b5-4994-bb1e-ca5122151314/files/7017173b-1073-4340-aac2-23d277e085cf.jpg",
    name: "Сяо Хуа",
    goods: "Аксессуары",
    city: "Иу",
    since: "2019",
    rating: 4.9,
    deals: 280,
    desc: "Поставщик модных аксессуаров с рынка Иу. Сумки, ремни, украшения, очки. Широкий ассортимент, быстрое обновление коллекций. Минимальный заказ от 20 единиц одного артикула.",
    telegram: "@xiaohua_acc",
    wechat: "xiaohua_yiwu",
    catalog: [
      { emoji: "👜", name: "Женские сумки", price: "от 10$/шт" },
      { emoji: "🕶️", name: "Солнечные очки", price: "от 3$/шт" },
      { emoji: "💍", name: "Украшения", price: "от 2$/шт" },
      { emoji: "👛", name: "Кошельки", price: "от 5$/шт" },
    ],
  },
  "3": {
    img: "https://cdn.poehali.dev/projects/edb6cf3c-b4b5-4994-bb1e-ca5122151314/files/1ea23d98-f506-4107-b09c-9d77eaeac189.jpg",
    name: "Ли Фэн",
    goods: "Обувь",
    city: "Путянь",
    since: "2015",
    rating: 4.7,
    deals: 640,
    desc: "Обувная фабрика в Путяне — крупнейшем обувном регионе Китая. Кроссовки, туфли, ботинки, сандалии. Возможно производство под СТМ. От 100 пар одной модели.",
    telegram: "@lifeng_shoes",
    wechat: "lifeng_putian",
    catalog: [
      { emoji: "👟", name: "Кроссовки", price: "от 12$/пара" },
      { emoji: "👠", name: "Туфли женские", price: "от 10$/пара" },
      { emoji: "👢", name: "Ботинки", price: "от 15$/пара" },
      { emoji: "🥿", name: "Мокасины и лоферы", price: "от 9$/пара" },
    ],
  },
  "4": {
    img: "https://cdn.poehali.dev/projects/edb6cf3c-b4b5-4994-bb1e-ca5122151314/files/7c3d2292-9c50-4131-86ab-ad7a71acd0c8.jpg",
    name: "Юй Янь",
    goods: "Красота и уход",
    city: "Шанхай",
    since: "2020",
    rating: 5.0,
    deals: 190,
    desc: "Косметика и средства по уходу из Шанхая. Натуральные ингредиенты, сертификаты качества. Кремы, сыворотки, маски, парфюмерия. Работаем с магазинами и блогерами.",
    telegram: "@yuyan_beauty",
    wechat: "yuyan_sh",
    catalog: [
      { emoji: "🧴", name: "Сыворотки для лица", price: "от 6$/шт" },
      { emoji: "💄", name: "Помады и блески", price: "от 4$/шт" },
      { emoji: "🧖", name: "Маски для лица", price: "от 2$/шт" },
      { emoji: "🌸", name: "Парфюм", price: "от 15$/шт" },
    ],
  },
  "5": {
    img: "https://cdn.poehali.dev/projects/edb6cf3c-b4b5-4994-bb1e-ca5122151314/files/4b1e22e2-ac38-4126-8b17-c50f84227b80.jpg",
    name: "Ван Го",
    goods: "Всё для дома",
    city: "Фошань",
    since: "2017",
    rating: 4.8,
    deals: 420,
    desc: "Товары для дома из Фошаня — мирового центра мебели и декора. Текстиль, посуда, светильники, органайзеры. Большой склад, быстрая отгрузка. Работаем с маркетплейсами.",
    telegram: "@wango_home",
    wechat: "wango_foshan",
    catalog: [
      { emoji: "🛋️", name: "Подушки и пледы", price: "от 5$/шт" },
      { emoji: "🍽️", name: "Посуда и столовые приборы", price: "от 8$/комплект" },
      { emoji: "💡", name: "Светильники", price: "от 10$/шт" },
      { emoji: "🧺", name: "Органайзеры", price: "от 4$/шт" },
    ],
  },
  "6": {
    img: "https://cdn.poehali.dev/projects/edb6cf3c-b4b5-4994-bb1e-ca5122151314/files/20a92eb0-fb1c-4a49-8591-6414c87263d6.jpg",
    name: "Чэнь Ли",
    goods: "Игрушки",
    city: "Шаньтоу",
    since: "2019",
    rating: 4.9,
    deals: 250,
    desc: "Фабрика детских игрушек в Шаньтоу. Все игрушки сертифицированы, соответствуют стандартам безопасности EN71. Мягкие игрушки, конструкторы, развивающие игры, куклы.",
    telegram: "@chenli_toys",
    wechat: "chenli_st",
    catalog: [
      { emoji: "🧸", name: "Мягкие игрушки", price: "от 4$/шт" },
      { emoji: "🧩", name: "Пазлы и конструкторы", price: "от 5$/шт" },
      { emoji: "🪀", name: "Развивающие игры", price: "от 6$/набор" },
      { emoji: "🎮", name: "Игровые наборы", price: "от 10$/шт" },
    ],
  },
  "7": {
    img: "https://cdn.poehali.dev/projects/edb6cf3c-b4b5-4994-bb1e-ca5122151314/files/8081db8a-f9c2-403c-b4f4-a34c8b247412.jpg",
    name: "Тан Мин",
    goods: "Ткани и фурнитура",
    city: "Сучжоу",
    since: "2014",
    rating: 4.8,
    deals: 730,
    desc: "Оптовый поставщик тканей из Сучжоу — «шёлковой столицы» Китая. Натуральные и смесовые ткани, фурнитура, пуговицы, молнии, нити. Работаем с швейными производствами и дизайнерами.",
    telegram: "@tanming_fabric",
    wechat: "tanming_suzhou",
    catalog: [
      { emoji: "🧵", name: "Шёлк натуральный", price: "от 8$/м" },
      { emoji: "🪡", name: "Хлопок и лён", price: "от 3$/м" },
      { emoji: "🔘", name: "Фурнитура (пуговицы, молнии)", price: "от 0.5$/шт" },
      { emoji: "🎀", name: "Декоративные ленты", price: "от 1$/м" },
    ],
  },
};

export default function SupplierProfile() {
  const { id } = useParams<{ id: string }>();
  const supplier = suppliers[id ?? "0"];

  if (!supplier) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-6xl mb-4">🐉</div>
          <h2 className="font-display font-bold text-2xl text-brand-navy mb-2">Поставщик не найден</h2>
          <Link to="/" className="text-primary underline">На главную</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-body" style={{background: "hsl(200,60%,97%)"}}>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/40 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl overflow-hidden" style={{background:"linear-gradient(135deg,hsl(200,75%,85%),hsl(200,65%,92%))"}}>
              <img src={DRAGON_IMAGE} alt="TaoSeller" className="w-full h-full object-cover scale-110" />
            </div>
            <span className="font-display font-bold text-xl tracking-wide text-brand-navy">
              Tao<span className="text-primary">Seller</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <AccountNavButton />
            <Link to="/" className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-brand-navy hover:bg-white/60 transition-all">
              <Icon name="ArrowLeft" size={16} />
              <span className="hidden sm:inline">Назад</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO — шапка поставщика */}
      <section className="pt-24 pb-0 relative overflow-hidden">
        {/* Облака */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-6 left-[10%] w-64 h-32 rounded-full bg-white/70 blur-3xl" />
          <div className="absolute top-8 right-[8%] w-80 h-36 rounded-full bg-white/60 blur-3xl" />
        </div>

        {/* Баннер-обложка */}
        <div className="relative h-52 md:h-64 overflow-hidden" style={{background:"linear-gradient(135deg, hsl(200,75%,82%) 0%, hsl(200,65%,88%) 100%)"}}>
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <span className="text-[200px] select-none">🐉</span>
          </div>
        </div>

        {/* Профиль */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16 mb-6">
            {/* Аватар */}
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-3xl overflow-hidden flex-shrink-0 border-4 border-white shadow-xl shadow-sky-300/25">
              <img src={supplier.img} alt={supplier.name} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 pb-2">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="font-display font-bold text-3xl text-brand-navy">{supplier.name}</h1>
                <span className="px-3 py-1 rounded-full text-xs font-bold text-primary" style={{background:"hsl(200,80%,90%)"}}>
                  ✓ Проверен
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1"><Icon name="Package" size={14} />{supplier.goods}</span>
                <span className="flex items-center gap-1"><Icon name="MapPin" size={14} />{supplier.city}, Китай</span>
                <span className="flex items-center gap-1"><Icon name="Calendar" size={14} />На платформе с {supplier.since}</span>
              </div>
            </div>

            {/* Кнопки */}
            <div className="flex gap-3 pb-2">
              <a
                href={`https://t.me/${supplier.telegram.replace("@","")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white font-bold text-sm shadow-lg transition-all hover:-translate-y-0.5"
                style={{background:"linear-gradient(135deg, hsl(354,78%,52%), hsl(25,85%,55%))"}}
              >
                <Icon name="MessageCircle" size={16} />
                Написать поставщику
              </a>
            </div>
          </div>

          {/* Статистика */}
          <div className="flex gap-6 pb-6 border-b border-white/60">
            {[
              { value: `${supplier.rating}★`, label: "рейтинг" },
              { value: `${supplier.deals}+`, label: "сделок" },
              { value: supplier.city, label: "город" },
            ].map((s, i) => (
              <div key={i}>
                <div className="font-display font-bold text-xl text-brand-navy">{s.value}</div>
                <div className="text-xs text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* КОНТЕНТ */}
      <section className="py-10 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* Левая колонка */}
            <div className="lg:col-span-2 space-y-8">

              {/* О поставщике */}
              <div className="rounded-3xl p-8" style={{background:"rgba(255,255,255,0.8)", backdropFilter:"blur(16px)", border:"1.5px solid rgba(255,255,255,0.9)", boxShadow:"0 8px 32px rgba(176,220,240,0.25)"}}>
                <h2 className="font-display font-bold text-xl text-brand-navy mb-4 flex items-center gap-2">
                  <span>📋</span> О поставщике
                </h2>
                <p className="text-slate-600 leading-relaxed">{supplier.desc}</p>
              </div>

              {/* Каталог товаров */}
              <div className="rounded-3xl p-8" style={{background:"rgba(255,255,255,0.8)", backdropFilter:"blur(16px)", border:"1.5px solid rgba(255,255,255,0.9)", boxShadow:"0 8px 32px rgba(176,220,240,0.25)"}}>
                <h2 className="font-display font-bold text-xl text-brand-navy mb-6 flex items-center gap-2">
                  <span>🛒</span> Каталог товаров
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {supplier.catalog.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl transition-all hover:-translate-y-0.5" style={{background:"linear-gradient(135deg, hsl(200,70%,95%), hsl(200,60%,97%))", border:"1px solid rgba(255,255,255,0.9)"}}>
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{background:"rgba(255,255,255,0.8)"}}>
                        {item.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-brand-navy text-sm">{item.name}</div>
                        <div className="text-primary font-bold text-sm mt-0.5">{item.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Видео */}
              <div className="rounded-3xl p-8" style={{background:"rgba(255,255,255,0.8)", backdropFilter:"blur(16px)", border:"1.5px solid rgba(255,255,255,0.9)", boxShadow:"0 8px 32px rgba(176,220,240,0.25)"}}>
                <h2 className="font-display font-bold text-xl text-brand-navy mb-6 flex items-center gap-2">
                  <span>🎬</span> Видео с производства
                </h2>
                <div className="rounded-2xl overflow-hidden aspect-video flex items-center justify-center" style={{background:"linear-gradient(135deg, hsl(200,70%,88%), hsl(200,60%,93%))"}}>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <Icon name="Play" size={28} className="text-primary ml-1" />
                    </div>
                    <p className="text-slate-500 text-sm">Поставщик добавит видео с производства</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Правая колонка — контакты */}
            <div className="space-y-6">
              {/* Контакты */}
              <div className="rounded-3xl p-6 sticky top-24" style={{background:"rgba(255,255,255,0.85)", backdropFilter:"blur(16px)", border:"1.5px solid rgba(255,255,255,0.9)", boxShadow:"0 8px 32px rgba(176,220,240,0.3)"}}>
                <h2 className="font-display font-bold text-lg text-brand-navy mb-5 flex items-center gap-2">
                  <span>📞</span> Контакты
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 p-3 rounded-xl" style={{background:"hsl(200,65%,95%)"}}>
                    <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center text-lg">💬</div>
                    <div>
                      <div className="text-xs text-slate-400">Telegram</div>
                      <div className="font-semibold text-brand-navy text-sm">{supplier.telegram}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl" style={{background:"hsl(200,65%,95%)"}}>
                    <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center text-lg">🟢</div>
                    <div>
                      <div className="text-xs text-slate-400">WeChat</div>
                      <div className="font-semibold text-brand-navy text-sm">{supplier.wechat}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl" style={{background:"hsl(200,65%,95%)"}}>
                    <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-lg">📍</div>
                    <div>
                      <div className="text-xs text-slate-400">Город</div>
                      <div className="font-semibold text-brand-navy text-sm">{supplier.city}, Китай</div>
                    </div>
                  </div>
                </div>

                <a
                  href={`https://t.me/${supplier.telegram.replace("@","")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-bold text-sm shadow-lg transition-all hover:-translate-y-0.5"
                  style={{background:"linear-gradient(135deg, hsl(354,78%,52%), hsl(25,85%,55%))"}}
                >
                  <Icon name="MessageCircle" size={16} />
                  Написать поставщику
                </a>

                <p className="text-xs text-slate-400 text-center mt-3">
                  Перевод и помощь в переговорах — бесплатно
                </p>
              </div>

              {/* Доп. инфо */}
              <div className="rounded-3xl p-6" style={{background:"rgba(255,255,255,0.8)", backdropFilter:"blur(16px)", border:"1.5px solid rgba(255,255,255,0.9)", boxShadow:"0 8px 32px rgba(176,220,240,0.2)"}}>
                <h3 className="font-display font-bold text-sm text-brand-navy mb-4">Условия работы</h3>
                <div className="space-y-2.5">
                  {[
                    { icon: "✅", text: "Фотоотчёт перед отправкой" },
                    { icon: "✅", text: "Работа через TaoSeller" },
                    { icon: "✅", text: "Помощь с переводом" },
                    { icon: "✅", text: "Гарантия качества товара" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                      <span>{item.icon}</span>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
