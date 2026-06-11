import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const ADMIN_URL = "https://functions.poehali.dev/d8d2585a-1711-4a79-991e-c42577907366";
const CONTENT_URL = "https://functions.poehali.dev/497830cf-ab2d-4e0b-b5a1-497fa90b8d0d";

interface Product {
  id: number; title: string; price: string; description: string;
  image_url: string; category: string; min_order: string;
  size: string; color: string; stock: string;
}
interface Seller {
  id: number; email: string; company_name: string; wechat_id: string;
  phone: string; description: string; avatar_url: string; city: string;
  created_at: string; products: Product[];
}

const emptyProduct = { title: "", price: "", description: "", image_url: "", category: "", min_order: "", size: "", color: "", stock: "" };
const emptySeller = { email: "", company_name: "", password: "", wechat_id: "", phone: "", description: "", city: "", avatar_url: "" };

const inputCls = "w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-red-400/30 text-slate-800";
const labelCls = "text-xs font-semibold text-slate-500 mb-1 block";

export default function Admin() {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => localStorage.getItem("admin_token") || "");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"sellers" | "products">("sellers");

  // Модалки
  const [sellerModal, setSellerModal] = useState<{ open: boolean; editing: Seller | null }>({ open: false, editing: null });
  const [productModal, setProductModal] = useState<{ open: boolean; editing: Product | null; sellerId: number | null }>({ open: false, editing: null, sellerId: null });
  const [sellerForm, setSellerForm] = useState({ ...emptySeller });
  const [productForm, setProductForm] = useState({ ...emptyProduct });
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [expandedSeller, setExpandedSeller] = useState<number | null>(null);

  const headers = { "Content-Type": "application/json", "X-Admin-Token": token };

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const res = await fetch(`${ADMIN_URL}?action=login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    const data = await res.json();
    if (data.token) { setToken(data.token); localStorage.setItem("admin_token", data.token); }
    else setLoginError(data.error || "Неверный пароль");
  };

  const load = async () => {
    setLoading(true);
    const res = await fetch(`${ADMIN_URL}?action=sellers`, { headers });
    const data = await res.json();
    if (data.sellers) setSellers(data.sellers);
    else { setToken(""); localStorage.removeItem("admin_token"); }
    setLoading(false);
  };

  useEffect(() => { if (token) load(); }, [token]);

  const logout = () => { setToken(""); localStorage.removeItem("admin_token"); setSellers([]); };

  // Загрузка изображения
  const uploadImage = async (file: File): Promise<string> => {
    const toBase64 = (f: File) => new Promise<string>((res, rej) => {
      const r = new FileReader(); r.onload = () => res((r.result as string).split(",")[1]); r.onerror = rej; r.readAsDataURL(f);
    });
    const b64 = await toBase64(file);
    const ext = file.name.split(".").pop() || "jpg";
    const resp = await fetch(`${CONTENT_URL}?action=upload`, {
      method: "POST", headers, body: JSON.stringify({ file_base64: b64, content_type: file.type, ext })
    });
    const d = await resp.json();
    return d.url || "";
  };

  // Поставщики
  const openCreateSeller = () => { setSellerForm({ ...emptySeller }); setSellerModal({ open: true, editing: null }); };
  const openEditSeller = (s: Seller) => { setSellerForm({ email: s.email, company_name: s.company_name, password: "", wechat_id: s.wechat_id || "", phone: s.phone || "", description: s.description || "", city: s.city || "", avatar_url: s.avatar_url || "" }); setSellerModal({ open: true, editing: s }); };

  const saveSeller = async () => {
    setSaving(true);
    if (sellerModal.editing) {
      await fetch(`${ADMIN_URL}?action=update_seller`, { method: "PUT", headers, body: JSON.stringify({ id: sellerModal.editing.id, ...sellerForm }) });
    } else {
      await fetch(`${ADMIN_URL}?action=create_seller`, { method: "POST", headers, body: JSON.stringify(sellerForm) });
    }
    setSaving(false); setSellerModal({ open: false, editing: null }); load();
  };

  const deleteSeller = async (id: number) => {
    if (!confirm("Отключить поставщика?")) return;
    await fetch(`${ADMIN_URL}?action=delete_seller`, { method: "POST", headers, body: JSON.stringify({ id }) });
    load();
  };

  // Товары
  const openCreateProduct = (sellerId: number) => { setProductForm({ ...emptyProduct }); setProductModal({ open: true, editing: null, sellerId }); };
  const openEditProduct = (p: Product, sellerId: number) => { setProductForm({ title: p.title, price: p.price || "", description: p.description || "", image_url: p.image_url || "", category: p.category || "", min_order: p.min_order || "", size: p.size || "", color: p.color || "", stock: p.stock || "" }); setProductModal({ open: true, editing: p, sellerId }); };

  const saveProduct = async () => {
    setSaving(true);
    if (productModal.editing) {
      await fetch(`${ADMIN_URL}?action=update_product`, { method: "PUT", headers, body: JSON.stringify({ id: productModal.editing.id, ...productForm }) });
    } else {
      await fetch(`${ADMIN_URL}?action=create_product`, { method: "POST", headers, body: JSON.stringify({ seller_id: productModal.sellerId, ...productForm }) });
    }
    setSaving(false); setProductModal({ open: false, editing: null, sellerId: null }); load();
  };

  const deleteProduct = async (id: number) => {
    if (!confirm("Удалить товар?")) return;
    await fetch(`${ADMIN_URL}?action=delete_product`, { method: "POST", headers, body: JSON.stringify({ id }) });
    load();
  };

  // Все товары для вкладки
  const allProducts = sellers.flatMap(s => s.products.map(p => ({ ...p, seller_name: s.company_name, seller_id: s.id })));

  // --- Форма логина ---
  if (!token) return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "hsl(0,0%,97%)" }}>
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center">
            <Icon name="ShieldCheck" size={20} className="text-white" />
          </div>
          <div>
            <div className="font-bold text-slate-900 text-lg">Админ-панель</div>
            <div className="text-xs text-slate-400">ChinaCarts</div>
          </div>
        </div>
        <form onSubmit={login} className="space-y-4">
          <div>
            <label className={labelCls}>Пароль</label>
            <input type="password" className={inputCls} placeholder="Введите пароль" value={password} onChange={e => setPassword(e.target.value)} required autoFocus />
          </div>
          {loginError && <div className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-xl">{loginError}</div>}
          <button type="submit" className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold transition-all">Войти</button>
        </form>
      </div>
    </div>
  );

  // --- Основной интерфейс ---
  return (
    <div className="min-h-screen" style={{ background: "hsl(0,0%,96%)" }}>
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center">
              <Icon name="ShieldCheck" size={16} className="text-white" />
            </div>
            <span className="font-bold text-slate-900">Админ-панель</span>
            <span className="text-xs text-slate-400 hidden sm:block">ChinaCarts</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate("/")} className="text-sm text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-all flex items-center gap-1">
              <Icon name="ExternalLink" size={14} />На сайт
            </button>
            <button onClick={logout} className="text-sm text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all flex items-center gap-1">
              <Icon name="LogOut" size={14} />Выйти
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Статистика */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {[
            { label: "Поставщиков", value: sellers.length, icon: "Store", color: "bg-blue-50 text-blue-600" },
            { label: "Товаров", value: allProducts.length, icon: "Package", color: "bg-emerald-50 text-emerald-600" },
            { label: "С товарами", value: sellers.filter(s => s.products.length > 0).length, icon: "CheckCircle", color: "bg-amber-50 text-amber-600" },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
                <Icon name={s.icon} size={18} />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{s.value}</div>
                <div className="text-xs text-slate-500">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Табы */}
        <div className="flex gap-2 mb-5">
          {[{ id: "sellers", label: "Поставщики", icon: "Store" }, { id: "products", label: "Все товары", icon: "Package" }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id as "sellers" | "products")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${tab === t.id ? "bg-red-600 text-white shadow-sm" : "bg-white text-slate-500 border border-slate-200 hover:border-red-300"}`}>
              <Icon name={t.icon} size={15} />{t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400">Загрузка...</div>
        ) : tab === "sellers" ? (
          /* ===== ПОСТАВЩИКИ ===== */
          <div className="space-y-3">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-slate-500">{sellers.length} поставщиков</div>
              <button onClick={openCreateSeller} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-all shadow-sm">
                <Icon name="Plus" size={16} />Добавить поставщика
              </button>
            </div>

            {sellers.map(s => (
              <div key={s.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 p-4">
                  <div className="w-11 h-11 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                    {s.avatar_url ? <img src={s.avatar_url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold text-slate-400 text-lg">{s.company_name[0]}</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-900 text-sm">{s.company_name}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-2">
                      <span>{s.email}</span>
                      {s.city && <span>· {s.city}</span>}
                      <span>· {s.products.length} тов.</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button onClick={() => openCreateProduct(s.id)} className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all" title="Добавить товар">
                      <Icon name="PackagePlus" size={15} />
                    </button>
                    <button onClick={() => openEditSeller(s)} className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all" title="Редактировать">
                      <Icon name="Pencil" size={15} />
                    </button>
                    <button onClick={() => setExpandedSeller(expandedSeller === s.id ? null : s.id)} className={`p-2 rounded-xl transition-all ${expandedSeller === s.id ? "bg-slate-200 text-slate-700" : "bg-slate-50 text-slate-400 hover:bg-slate-100"}`}>
                      <Icon name={expandedSeller === s.id ? "ChevronUp" : "ChevronDown"} size={15} />
                    </button>
                    <button onClick={() => deleteSeller(s.id)} className="p-2 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 transition-all" title="Удалить">
                      <Icon name="Trash2" size={15} />
                    </button>
                  </div>
                </div>

                {expandedSeller === s.id && (
                  <div className="border-t border-slate-100 px-4 pb-4 pt-3">
                    {s.products.length === 0 ? (
                      <p className="text-sm text-slate-400 py-2">Нет товаров — <button onClick={() => openCreateProduct(s.id)} className="text-red-500 hover:underline">добавить первый</button></p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {s.products.map(p => (
                          <div key={p.id} className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-100 bg-slate-50 group">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0">
                              {p.image_url ? <img src={p.image_url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Icon name="Package" size={14} className="text-slate-400" /></div>}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold text-slate-800 truncate">{p.title}</div>
                              {p.price && <div className="text-xs text-red-500 font-bold">{p.price}</div>}
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => openEditProduct(p, s.id)} className="p-1.5 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100"><Icon name="Pencil" size={12} /></button>
                              <button onClick={() => deleteProduct(p.id)} className="p-1.5 rounded-lg bg-red-50 text-red-400 hover:bg-red-100"><Icon name="Trash2" size={12} /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* ===== ВСЕ ТОВАРЫ ===== */
          <div>
            <div className="text-sm text-slate-500 mb-4">{allProducts.length} товаров</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {allProducts.map(p => (
                <div key={p.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex gap-3 p-3 group">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                    {p.image_url ? <img src={p.image_url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Icon name="Package" size={20} className="text-slate-300" /></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-900 text-sm truncate">{p.title}</div>
                    {p.price && <div className="text-xs text-red-500 font-bold">{p.price}</div>}
                    <div className="text-xs text-slate-400 truncate">{p.seller_name}</div>
                    {p.category && <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-semibold">{p.category}</span>}
                  </div>
                  <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEditProduct(p, p.seller_id)} className="p-1.5 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100"><Icon name="Pencil" size={13} /></button>
                    <button onClick={() => deleteProduct(p.id)} className="p-1.5 rounded-lg bg-red-50 text-red-400 hover:bg-red-100"><Icon name="Trash2" size={13} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ===== МОДАЛКА ПОСТАВЩИКА ===== */}
      {sellerModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={e => { if (e.target === e.currentTarget) setSellerModal({ open: false, editing: null }); }}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">{sellerModal.editing ? "Редактировать поставщика" : "Новый поставщик"}</h2>
              <button onClick={() => setSellerModal({ open: false, editing: null })} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200">
                <Icon name="X" size={16} />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelCls}>Email *</label><input className={inputCls} value={sellerForm.email} onChange={e => setSellerForm(f => ({...f, email: e.target.value}))} placeholder="email@example.com" /></div>
                <div><label className={labelCls}>Название компании *</label><input className={inputCls} value={sellerForm.company_name} onChange={e => setSellerForm(f => ({...f, company_name: e.target.value}))} placeholder="ООО Рога и Копыта" /></div>
              </div>
              {!sellerModal.editing && <div><label className={labelCls}>Пароль (оставьте пустым — сгенерируем)</label><input className={inputCls} value={sellerForm.password} onChange={e => setSellerForm(f => ({...f, password: e.target.value}))} placeholder="Пароль поставщика" /></div>}
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelCls}>WeChat ID</label><input className={inputCls} value={sellerForm.wechat_id} onChange={e => setSellerForm(f => ({...f, wechat_id: e.target.value}))} placeholder="wechat_id" /></div>
                <div><label className={labelCls}>Телефон</label><input className={inputCls} value={sellerForm.phone} onChange={e => setSellerForm(f => ({...f, phone: e.target.value}))} placeholder="+7..." /></div>
              </div>
              <div><label className={labelCls}>Город</label><input className={inputCls} value={sellerForm.city} onChange={e => setSellerForm(f => ({...f, city: e.target.value}))} placeholder="Шанхай, Гуанчжоу..." /></div>
              <div><label className={labelCls}>Описание</label><textarea className={`${inputCls} resize-none`} rows={3} value={sellerForm.description} onChange={e => setSellerForm(f => ({...f, description: e.target.value}))} placeholder="О компании..." /></div>
              <div>
                <label className={labelCls}>Фото / логотип</label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-all">
                    {uploadingImg ? "Загрузка..." : "Выбрать файл"}
                    <input type="file" accept="image/*" className="hidden" onChange={async e => { const f = e.target.files?.[0]; if (!f) return; setUploadingImg(true); const url = await uploadImage(f); setSellerForm(sf => ({...sf, avatar_url: url})); setUploadingImg(false); }} />
                  </label>
                  {sellerForm.avatar_url && <img src={sellerForm.avatar_url} alt="" className="w-12 h-12 rounded-xl object-cover border border-slate-200" />}
                </div>
              </div>
            </div>
            <div className="flex gap-2 p-5 border-t border-slate-100">
              <button onClick={() => setSellerModal({ open: false, editing: null })} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50">Отмена</button>
              <button onClick={saveSeller} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 disabled:opacity-60">{saving ? "Сохранение..." : "Сохранить"}</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== МОДАЛКА ТОВАРА ===== */}
      {productModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={e => { if (e.target === e.currentTarget) setProductModal({ open: false, editing: null, sellerId: null }); }}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">{productModal.editing ? "Редактировать товар" : "Новый товар"}</h2>
              <button onClick={() => setProductModal({ open: false, editing: null, sellerId: null })} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200"><Icon name="X" size={16} /></button>
            </div>
            <div className="p-5 space-y-3">
              <div><label className={labelCls}>Название *</label><input className={inputCls} value={productForm.title} onChange={e => setProductForm(f => ({...f, title: e.target.value}))} placeholder="Название товара" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelCls}>Цена</label><input className={inputCls} value={productForm.price} onChange={e => setProductForm(f => ({...f, price: e.target.value}))} placeholder="5 ¥ / шт" /></div>
                <div><label className={labelCls}>Категория</label><input className={inputCls} value={productForm.category} onChange={e => setProductForm(f => ({...f, category: e.target.value}))} placeholder="Одежда" /></div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className={labelCls}>Размер</label><input className={inputCls} value={productForm.size} onChange={e => setProductForm(f => ({...f, size: e.target.value}))} placeholder="S-XL" /></div>
                <div><label className={labelCls}>Цвет</label><input className={inputCls} value={productForm.color} onChange={e => setProductForm(f => ({...f, color: e.target.value}))} placeholder="Красный" /></div>
                <div><label className={labelCls}>Наличие</label><input className={inputCls} value={productForm.stock} onChange={e => setProductForm(f => ({...f, stock: e.target.value}))} placeholder="500 шт" /></div>
              </div>
              <div><label className={labelCls}>Мин. заказ</label><input className={inputCls} value={productForm.min_order} onChange={e => setProductForm(f => ({...f, min_order: e.target.value}))} placeholder="50 шт" /></div>
              <div><label className={labelCls}>Описание</label><textarea className={`${inputCls} resize-none`} rows={3} value={productForm.description} onChange={e => setProductForm(f => ({...f, description: e.target.value}))} placeholder="Описание товара..." /></div>
              <div>
                <label className={labelCls}>Фото товара</label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-all">
                    {uploadingImg ? "Загрузка..." : "Выбрать файл"}
                    <input type="file" accept="image/*" className="hidden" onChange={async e => { const f = e.target.files?.[0]; if (!f) return; setUploadingImg(true); const url = await uploadImage(f); setProductForm(pf => ({...pf, image_url: url})); setUploadingImg(false); }} />
                  </label>
                  {productForm.image_url && <img src={productForm.image_url} alt="" className="w-12 h-12 rounded-xl object-cover border border-slate-200" />}
                </div>
              </div>
            </div>
            <div className="flex gap-2 p-5 border-t border-slate-100">
              <button onClick={() => setProductModal({ open: false, editing: null, sellerId: null })} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50">Отмена</button>
              <button onClick={saveProduct} disabled={saving || uploadingImg} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 disabled:opacity-60">{saving ? "Сохранение..." : "Сохранить"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
