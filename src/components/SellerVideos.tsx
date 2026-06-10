import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const SELLERS_URL = "https://functions.poehali.dev/d6dd7774-7d1c-436f-a1ac-d5342ecb46b4";

interface VideoItem {
  id: number;
  title: string;
  video_url: string;
  sellerName: string;
  sellerCity: string;
  avatar: string;
}

export default function SellerVideos() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${SELLERS_URL}?action=list`)
      .then((r) => r.json())
      .then((data) => {
        const list: VideoItem[] = [];
        (data.sellers || []).forEach((s: { company_name: string; city: string; avatar_url: string; videos: { id: number; title: string; video_url: string }[] }) => {
          (s.videos || []).forEach((v) => {
            list.push({
              id: v.id,
              title: v.title || s.company_name,
              video_url: v.video_url,
              sellerName: s.company_name,
              sellerCity: s.city,
              avatar: s.avatar_url,
            });
          });
        });
        setVideos(list);
      })
      .catch(() => setVideos([]));
  }, []);

  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  if (videos.length === 0) return null;

  const gradients = [
    "from-rose-200 to-pink-100",
    "from-sky-200 to-blue-100",
    "from-emerald-200 to-teal-100",
    "from-amber-200 to-orange-100",
    "from-violet-200 to-purple-100",
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="flex items-end justify-between mb-8 reveal">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-navy mb-2">Видео от продавцов</h2>
            <p className="text-muted-foreground">Поставщики показывают свои товары вживую</p>
          </div>
          <div className="hidden md:flex gap-2">
            <button onClick={() => scroll(-1)} className="w-11 h-11 rounded-full bg-secondary hover:bg-accent flex items-center justify-center transition-all">
              <Icon name="ChevronLeft" size={20} className="text-brand-navy" />
            </button>
            <button onClick={() => scroll(1)} className="w-11 h-11 rounded-full bg-secondary hover:bg-accent flex items-center justify-center transition-all">
              <Icon name="ChevronRight" size={20} className="text-brand-navy" />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 snap-x">
          {videos.map((v, i) => (
            <div
              key={v.id}
              className="reveal flex-shrink-0 w-[230px] snap-start group"
              style={{ animationDelay: `${(i % 6) * 0.06}s` }}
            >
              <div className="relative rounded-3xl overflow-hidden aspect-[3/4] bg-secondary card-soft">
                {activeId === v.id ? (
                  <video
                    src={v.video_url}
                    controls
                    autoPlay
                    className="w-full h-full object-cover"
                    onEnded={() => setActiveId(null)}
                  />
                ) : (
                  <>
                    <video
                      src={v.video_url}
                      muted
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${gradients[i % gradients.length]} opacity-20`} />
                    <button
                      onClick={() => setActiveId(v.id)}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                        <Icon name="Play" size={26} className="text-primary ml-1" />
                      </div>
                    </button>
                    {/* Подпись продавца */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
                          {v.avatar ? (
                            <img src={v.avatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="font-display font-bold text-xs text-primary">{v.sellerName?.[0]?.toUpperCase()}</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-white text-sm font-semibold truncate">{v.sellerName}</div>
                          {v.sellerCity && <div className="text-white/80 text-xs truncate">{v.sellerCity}</div>}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <p className="mt-2 text-sm font-medium text-brand-navy line-clamp-2 px-1">{v.title}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-6 reveal">
          <button
            onClick={() => navigate("/sellers")}
            className="px-7 py-3 bg-gradient-brand text-white font-display font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-blue-500/25"
          >
            Все продавцы
          </button>
        </div>
      </div>
    </section>
  );
}
