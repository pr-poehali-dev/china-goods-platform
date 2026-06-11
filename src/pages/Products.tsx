import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import AccountNavButton from "@/components/AccountNavButton";
import BuyerChat from "@/components/BuyerChat";

const SELLERS_URL = "https://functions.poehali.dev/d6dd7774-7d1c-436f-a1ac-d5342ecb46b4";
const MASCOT_IMAGE = "https://cdn.poehali.dev/projects/edb6cf3c-b4b5-4994-bb1e-ca5122151314/files/e57c997a-a016-4802-9da3-7cebb5cf03f4.jpg";
const MANAGER_PHONE = "https://wa.me/79000000000";

interface Review {
  id: number;
  author_name: string;
  rating: number;
  text: string;
  created_at: string;
}
interface Seller {
  id: number;
  company_name: string;
  avatar_url: string;
  city: string;
}
interface Product {
  id: number;
  title: string;
  price: string;
  description: string;
  image_url: string;
  category: string | null;
  min_order: string | null;
  size: string | null;
  color: string | null;
  stock: string | null;
  seller: Seller;
  reviews: Review[];
  avg_rating: number | null;
}

const WECHAT_URL = "https://functions.poehali.dev/e2bc4a3b-2c2f-4ed5-a331-28cca59b4a69";

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Все");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [chatWith, setChatWith] = useState<{ id: number; name: string } | null>(null);
  const [reviewForm, setReviewForm] = useState({ author_name: "", rating: 5, text: "" });
  const [reviewSent, setReviewSent] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    fetch(`${SELLERS_URL}?action=products`)
      .then(r => r.json())
      .then(d => { setProducts(d.products || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const allCategories = ["Все", ...Array.from(new Set(
    products.map(p => p.category).filter(Boolean) as string[]
  ))];

  const filtered = products.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      p.title.toLowerCase().includes(q) ||
      (p.description || "").toLowerCase().includes(q) ||
      (p.category || "").toLowerCase().includes(q) ||
      p.seller.company_name.toLowerCase().includes(q);
    const matchCat = activeCategory === "Все" || p.category === activeCategory;
    return matchSearch && matchCat;
  });

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setReviewLoading(true);
    await fetch(`${SELLERS_URL}?action=add_review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...reviewForm, product_id: selectedProduct.id }),
    });
    setReviewSent(true);
    setReviewLoading(false);
    // обновить отзывы в selectedProduct
    const res = await fetch(`${SELLERS_URL}?action=products`);
    const data = await res.json();
    const updated = (data.products || []).find((p: Product) => p.id === selectedProduct.id);
    if (updated) setSelectedProduct(updated);
    setProducts(data.products || []);
    setReviewForm({ author_name: "", rating: 5, text: "" });
    setTimeout(() => setReviewSent(false), 3000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-body">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/40 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={MASCOT_IMAGE} alt="ChinaCarts" className="w-10 h-10 object-contain" />
            <span className="font-bold text-xl tracking-wide" style={{color:"#111", fontFamily:"'Inter', 'Manrope', sans-serif", letterSpacing:"-0.03em"}}>
              China<span style={{color:"#cc0000"}}>Carts</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <AccountNavButton />
            <Link to="/" className="flex items-center gap-2 px-4 py-2 glass rounded-xl text-sm font-bold text-brand-navy hover:scale-[1.02] transition-all">
              <Icon name="ArrowLeft" size={16} /><span className="hidden sm:inline">На главную</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* HEADER */}
      <section className="pt-28 pb-12 px-4" style={{background:"linear-gradient(180deg, hsl(200,75%,88%) 0%, hsl(200,60%,96%) 100%)"}}>
        <div className="container mx-auto text-center max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-primary text-sm font-bold mb-5 shadow-sm" style={{background:"hsl(200,80%,90%)"}}>
            <Icon name="ShoppingBag" size={15} /> Каталог товаров
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-extrabold mb-4 text-brand-navy leading-tight">
            Товары <span className="text-grad">из Китая</span>
          </h1>
          <p className="text-slate-500 text-lg mb-8 leading-relaxed">
            Оптовые товары напрямую от поставщиков. Нажмите на товар — свяжитесь с поставщиком напрямую.
          </p>

          {/* Поиск */}
          <div className="relative max-w-lg mx-auto">
            <Icon name="Search" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Поиск товаров, категорий, поставщиков..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border border-white/80 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-brand-navy"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Icon name="X" size={16} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* MAIN */}
      <section className="py-10 px-4" style={{background:"hsl(200,60%,97%)"}}>
        <div className="container mx-auto max-w-7xl">

          {/* Фильтры */}
          {allCategories.length > 1 && (
            <div className="flex gap-2 flex-wrap mb-6">
              {allCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                    activeCategory === cat
                      ? "bg-primary text-white shadow-sm"
                      : "bg-white text-slate-500 border border-slate-200 hover:border-primary/40 hover:text-primary"
                  }`}
                >
                  {cat}
                </button>
              ))}
              <span className="ml-auto text-sm text-slate-400 flex items-center gap-1 self-center">
                <Icon name="Package" size={14} />{filtered.length} товаров
              </span>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({length: 10}).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl overflow-hidden animate-pulse">
                  <div className="h-44 bg-slate-100" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-slate-100 rounded-lg w-3/4" />
                    <div className="h-4 bg-slate-100 rounded-lg w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Icon name="SearchX" size={40} className="text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium text-lg">Ничего не найдено</p>
              <button onClick={() => { setSearch(""); setActiveCategory("Все"); }} className="mt-2 text-primary hover:underline text-sm">Сбросить фильтры</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filtered.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProduct(p)}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm border border-white/80 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-left flex flex-col group"
                >
                  <div className="relative h-44 flex-shrink-0 bg-slate-100 overflow-hidden">
                    {p.image_url
                      ? <img src={p.image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      : <div className="w-full h-full flex items-center justify-center"><Icon name="Package" size={32} className="text-slate-300" /></div>
                    }
                    {p.category && (
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold text-primary bg-white/90 shadow-sm">
                        {p.category}
                      </div>
                    )}
                    {p.avg_rating && (
                      <div className="absolute top-2 right-2 flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-400 text-white text-[10px] font-bold shadow-sm">
                        ★ {p.avg_rating}
                      </div>
                    )}
                  </div>
                  <div className="p-3 flex flex-col flex-1">
                    <div className="font-bold text-brand-navy text-sm leading-tight line-clamp-2 mb-1.5">{p.title}</div>
                    {p.price && <div className="text-primary font-display font-extrabold text-base">{p.price}</div>}
                    <div className="mt-auto pt-2 flex items-center gap-1.5">
                      {p.seller.avatar_url
                        ? <img src={p.seller.avatar_url} alt="" className="w-5 h-5 rounded-full object-cover" />
                        : <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">{p.seller.company_name[0]}</div>
                      }
                      <span className="text-xs text-slate-400 truncate">{p.seller.company_name}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Модальное окно товара */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 bg-black/40 backdrop-blur-sm overflow-y-auto" onClick={e => { if (e.target === e.currentTarget) setSelectedProduct(null); }}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-4 overflow-hidden">

            {/* Фото */}
            <div className="relative h-64 bg-slate-100">
              {selectedProduct.image_url
                ? <img src={selectedProduct.image_url} alt={selectedProduct.title} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center"><Icon name="Package" size={48} className="text-slate-300" /></div>
              }
              <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white transition-all">
                <Icon name="X" size={18} className="text-slate-600" />
              </button>
              {selectedProduct.category && (
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-primary bg-white/90 shadow">{selectedProduct.category}</div>
              )}
            </div>

            <div className="p-6">
              {/* Заголовок и цена */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <h2 className="font-display font-extrabold text-xl text-brand-navy leading-tight">{selectedProduct.title}</h2>
                {selectedProduct.price && <div className="text-primary font-display font-extrabold text-2xl flex-shrink-0">{selectedProduct.price}</div>}
              </div>

              {/* Характеристики */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {selectedProduct.size && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 text-sm">
                    <Icon name="Ruler" size={14} className="text-primary" />
                    <span className="text-slate-500">Размер:</span>
                    <span className="font-semibold text-brand-navy">{selectedProduct.size}</span>
                  </div>
                )}
                {selectedProduct.color && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 text-sm">
                    <Icon name="Palette" size={14} className="text-primary" />
                    <span className="text-slate-500">Цвет:</span>
                    <span className="font-semibold text-brand-navy">{selectedProduct.color}</span>
                  </div>
                )}
                {selectedProduct.min_order && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 text-sm">
                    <Icon name="PackageCheck" size={14} className="text-emerald-500" />
                    <span className="text-slate-500">Мин. заказ:</span>
                    <span className="font-semibold text-brand-navy">{selectedProduct.min_order}</span>
                  </div>
                )}
                {selectedProduct.stock && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 text-sm">
                    <Icon name="Warehouse" size={14} className="text-violet-500" />
                    <span className="text-slate-500">Наличие:</span>
                    <span className="font-semibold text-brand-navy">{selectedProduct.stock}</span>
                  </div>
                )}
              </div>

              {/* Описание */}
              {selectedProduct.description && (
                <p className="text-slate-500 text-sm leading-relaxed mb-5">{selectedProduct.description}</p>
              )}

              {/* Поставщик */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 mb-5 cursor-pointer hover:bg-slate-100 transition-all" onClick={() => navigate(`/supplier/${selectedProduct.seller.id}`)}>
                {selectedProduct.seller.avatar_url
                  ? <img src={selectedProduct.seller.avatar_url} alt="" className="w-10 h-10 rounded-xl object-cover" />
                  : <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center font-bold text-primary">{selectedProduct.seller.company_name[0]}</div>
                }
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-brand-navy text-sm">{selectedProduct.seller.company_name}</div>
                  {selectedProduct.seller.city && <div className="text-xs text-slate-400 flex items-center gap-1"><Icon name="MapPin" size={10} />{selectedProduct.seller.city}</div>}
                </div>
                <Icon name="ChevronRight" size={16} className="text-slate-400" />
              </div>

              {/* Кнопки */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => { setChatWith({ id: selectedProduct.seller.id, name: selectedProduct.seller.company_name }); setSelectedProduct(null); }}
                  className="flex-1 btn-modern py-3 text-white font-bold rounded-2xl flex items-center justify-center gap-2"
                >
                  <Icon name="MessageCircle" size={18} />
                  Связаться с поставщиком
                </button>
                <a
                  href={MANAGER_PHONE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 rounded-2xl border-2 border-emerald-400 text-emerald-600 font-bold flex items-center justify-center gap-2 hover:bg-emerald-50 transition-all text-sm"
                >
                  <Icon name="Headphones" size={18} />
                  Написать менеджеру
                </a>
              </div>

              {/* Отзывы */}
              <div className="border-t border-slate-100 pt-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-brand-navy">
                    Отзывы
                    {selectedProduct.reviews.length > 0 && (
                      <span className="ml-2 text-amber-400">★ {selectedProduct.avg_rating}</span>
                    )}
                  </h3>
                  <span className="text-sm text-slate-400">{selectedProduct.reviews.length} отзывов</span>
                </div>

                {selectedProduct.reviews.length > 0 && (
                  <div className="space-y-3 mb-5 max-h-48 overflow-y-auto pr-1">
                    {selectedProduct.reviews.map(r => (
                      <div key={r.id} className="p-3 rounded-2xl bg-slate-50">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm text-brand-navy">{r.author_name}</span>
                          <span className="text-amber-400 text-sm">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                        </div>
                        {r.text && <p className="text-xs text-slate-500 leading-relaxed">{r.text}</p>}
                      </div>
                    ))}
                  </div>
                )}

                {/* Форма отзыва */}
                <form onSubmit={submitReview} className="space-y-3">
                  <div className="font-semibold text-sm text-brand-navy mb-2">Оставить отзыв</div>
                  <input
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="Ваше имя"
                    value={reviewForm.author_name}
                    onChange={e => setReviewForm(f => ({...f, author_name: e.target.value}))}
                    required
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">Оценка:</span>
                    {[1,2,3,4,5].map(n => (
                      <button key={n} type="button" onClick={() => setReviewForm(f => ({...f, rating: n}))}
                        className={`text-xl transition-all ${n <= reviewForm.rating ? "text-amber-400" : "text-slate-300"}`}>★</button>
                    ))}
                  </div>
                  <textarea
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                    placeholder="Ваш отзыв (необязательно)"
                    rows={2}
                    value={reviewForm.text}
                    onChange={e => setReviewForm(f => ({...f, text: e.target.value}))}
                  />
                  <button type="submit" disabled={reviewLoading} className="w-full py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:opacity-90 transition-all disabled:opacity-60">
                    {reviewSent ? "✓ Отзыв отправлен!" : reviewLoading ? "Отправка..." : "Отправить отзыв"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Чат с поставщиком */}
      {chatWith && <BuyerChat sellerId={chatWith.id} sellerName={chatWith.name} onClose={() => setChatWith(null)} />}

      {/* FOOTER */}
      <footer className="bg-navy py-10 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm text-white/60">© 2025 ChinaCarts · 🇨🇳 → 🇷🇺 Закупки из Китая в Россию</span>
          <div className="flex items-center gap-3">
            <a href="https://vk.com/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#0077FF]/60 flex items-center justify-center transition-all" title="ВКонтакте">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-white"><path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14C20.67 22 22 20.67 22 15.07V8.93C22 3.33 20.67 2 15.07 2zm3.08 13.37h-1.5c-.57 0-.74-.45-1.76-1.48-.88-.86-1.27-.97-1.49-.97-.3 0-.39.09-.39.52v1.35c0 .37-.12.59-1.1.59-1.62 0-3.41-.98-4.67-2.8C5.79 10.37 5.25 8.5 5.25 8.1c0-.22.09-.43.52-.43h1.5c.39 0 .54.18.69.6.76 2.19 2.03 4.11 2.55 4.11.2 0 .29-.09.29-.59V9.54c-.06-1.05-.61-1.14-.61-1.51 0-.18.15-.37.39-.37h2.37c.33 0 .45.18.45.56v3c0 .33.15.45.24.45.2 0 .37-.12.74-.49 1.14-1.28 1.96-3.25 1.96-3.25.11-.22.29-.43.68-.43h1.5c.45 0 .55.23.45.56-.19.86-2.03 3.48-2.03 3.48-.16.26-.22.37 0 .66.16.2.68.66 1.03 1.06.64.72 1.13 1.33 1.26 1.75.12.41-.09.62-.52.62z"/></svg>
            </a>
            <a href="https://max.ru/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#FF6B35]/60 flex items-center justify-center transition-all" title="MAX">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 13h-2v-6h2v6zm0-8h-2V5h2v2z"/></svg>
            </a>
            <a href="https://t.me/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#2AABEE]/60 flex items-center justify-center transition-all" title="Telegram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8l-1.68 7.93c-.12.56-.46.7-.93.43l-2.57-1.9-1.24 1.19c-.14.13-.25.25-.51.25l.18-2.6 4.72-4.26c.21-.18-.04-.28-.32-.1L7.7 14.07l-2.53-.79c-.55-.17-.56-.55.12-.82l9.87-3.8c.46-.17.86.11.48.14z"/></svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}