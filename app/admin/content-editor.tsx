"use client";

import { useState, useTransition } from "react";
import {
  Calendar,
  Check,
  ExternalLink,
  Eye,
  Image as ImageIcon,
  Layers,
  LoaderCircle,
  Music,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  Upload,
  Users,
} from "lucide-react";
import type { ScheduleItem, SiteContent } from "@/lib/content/types";
import { saveSiteContentAction, resetSiteContentAction } from "./actions";

interface ContentEditorProps {
  initialContent: SiteContent;
}

type TabKey = "general" | "hero" | "schedule" | "blessing" | "gallery" | "rsvp" | "music";

export function ContentEditor({ initialContent }: ContentEditorProps) {
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [activeTab, setActiveTab] = useState<TabKey>("general");
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  function showToast(message: string, type: "success" | "error" = "success") {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }

  function handleSave() {
    startTransition(async () => {
      const res = await saveSiteContentAction(content);
      if (res.ok) {
        showToast("Բոլոր փոփոխությունները հաջողությամբ պահպանվեցին։");
      } else {
        showToast(res.error || "Սխալ՝ չհաջողվեց պահպանել։", "error");
      }
    });
  }

  function handleReset() {
    if (!confirm("Վստա՞հ եք, որ ցանկանում եք վերականգնել սկզբնական կարգավորումները։")) return;
    startTransition(async () => {
      const res = await resetSiteContentAction();
      if (res.ok) {
        showToast("Կարգավորումները վերականգնվեցին։ Թարմացրեք էջը։");
        window.location.reload();
      } else {
        showToast("Չհաջողվեց վերականգնել։", "error");
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gold/30 bg-ivory p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="font-serif text-lg font-medium text-ink">Կայքի խմբագրում</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/api/draft?path=/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-gold/50 bg-cream/60 px-4 py-2 text-xs font-medium text-olive transition-colors hover:bg-cream"
          >
            <Eye className="size-3.5" />
            Նախադիտել
            <ExternalLink className="size-3" />
          </a>
          <button
            type="button"
            onClick={handleReset}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 px-3.5 py-2 text-xs text-muted transition-colors hover:bg-cream"
          >
            <RefreshCw className="size-3" />
            Լռելյայն
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-full bg-olive px-5 py-2 text-xs font-medium text-ivory shadow transition-colors hover:bg-olive-deep disabled:opacity-60"
          >
            {isPending ? <LoaderCircle className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
            Պահպանել
          </button>
        </div>
      </div>

      {toast ? (
        <div
          role="alert"
          className={`rounded-md p-3.5 text-sm ${
            toast.type === "success"
              ? "border border-olive/30 bg-olive/10 text-olive-deep"
              : "border border-red-300 bg-red-50 text-red-800"
          }`}
        >
          {toast.message}
        </div>
      ) : null}

      {/* Tabs navigation */}
      <div className="flex overflow-x-auto border-b border-gold/20 pb-px text-sm">
        <TabButton
          active={activeTab === "general"}
          onClick={() => setActiveTab("general")}
          icon={<Users className="size-4" />}
          label="Երեխաներ և Ամսաթիվ"
        />
        <TabButton
          active={activeTab === "hero"}
          onClick={() => setActiveTab("hero")}
          icon={<Layers className="size-4" />}
          label="Գլխավոր էջ"
        />
        <TabButton
          active={activeTab === "schedule"}
          onClick={() => setActiveTab("schedule")}
          icon={<Calendar className="size-4" />}
          label="Օրվա ծրագիր"
        />
        <TabButton
          active={activeTab === "blessing"}
          onClick={() => setActiveTab("blessing")}
          icon={<Check className="size-4" />}
          label="Մաղթանք և Հետհաշվարկ"
        />
        <TabButton
          active={activeTab === "gallery"}
          onClick={() => setActiveTab("gallery")}
          icon={<ImageIcon className="size-4" />}
          label="Լուսանկարներ"
        />
        <TabButton
          active={activeTab === "rsvp"}
          onClick={() => setActiveTab("rsvp")}
          icon={<Users className="size-4" />}
          label="RSVP (Մասնակցություն)"
        />
        <TabButton
          active={activeTab === "music"}
          onClick={() => setActiveTab("music")}
          icon={<Music className="size-4" />}
          label="Երաժշտություն և Թեմա"
        />
      </div>

      {/* Tab Panels */}
      <div className="rounded-lg border border-gold/30 bg-ivory p-6 shadow-sm">
        {activeTab === "general" && <GeneralTab content={content} setContent={setContent} />}
        {activeTab === "hero" && <HeroTab content={content} setContent={setContent} />}
        {activeTab === "schedule" && <ScheduleTab content={content} setContent={setContent} />}
        {activeTab === "blessing" && <BlessingTab content={content} setContent={setContent} />}
        {activeTab === "gallery" && <GalleryTab content={content} setContent={setContent} />}
        {activeTab === "rsvp" && <RsvpTab content={content} setContent={setContent} />}
        {activeTab === "music" && <MusicTab content={content} setContent={setContent} />}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 font-serif transition-colors ${
        active
          ? "border-olive font-medium text-olive"
          : "border-transparent text-muted hover:border-gold/40 hover:text-ink"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

/* ----------------------------------------------------
 * File Uploader Helper Component
 * ---------------------------------------------------- */
function FileUploader({
  accept = "image/*",
  onUpload,
  label = "Վերբեռնել ֆայլ",
}: {
  accept?: string;
  onUpload: (url: string) => void;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        onUpload(data.url);
      } else {
        alert(data.error || "Վերբեռնումը ձախողվեց");
      }
    } catch {
      alert("Ցանցային սխալ վերբեռնելիս");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-gold/40 bg-cream/40 px-3 py-1.5 text-xs text-olive transition-colors hover:bg-cream">
      {uploading ? <LoaderCircle className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
      <span>{uploading ? "Բեռնվում է…" : label}</span>
      <input type="file" accept={accept} onChange={handleChange} disabled={uploading} className="hidden" />
    </label>
  );
}

/* ----------------------------------------------------
 * TAB 1: General & People & Date
 * ---------------------------------------------------- */
function GeneralTab({
  content,
  setContent,
}: {
  content: SiteContent;
  setContent: React.Dispatch<React.SetStateAction<SiteContent>>;
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-medium text-olive">Երեխաների անունները (ստորակետով)</label>
          <input
            type="text"
            value={content.people.names.join(", ")}
            onChange={(e) =>
              setContent((prev) => ({
                ...prev,
                people: {
                  ...prev.people,
                  names: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                },
              }))
            }
            className="input-field mt-1.5"
            placeholder="Աննա, Հայկ"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-olive">Սեռական հոլով (Վերնագրերի համար)</label>
          <input
            type="text"
            value={content.people.genitive}
            onChange={(e) =>
              setContent((prev) => ({
                ...prev,
                people: { ...prev.people, genitive: e.target.value },
              }))
            }
            className="input-field mt-1.5"
            placeholder="Աննայի և Հայկի"
          />
        </div>
      </div>

      <div className="border-t border-gold/20 pt-5">
        <h3 className="font-serif text-sm font-medium text-ink">Իրադարձության Ամսաթիվ</h3>
        <div className="mt-3 grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-muted">Տարի</label>
            <input
              type="number"
              value={content.event.year}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  event: { ...prev.event, year: Number(e.target.value) || prev.event.year },
                }))
              }
              className="input-field mt-1"
            />
          </div>
          <div>
            <label className="block text-xs text-muted">Ամիս (1-12)</label>
            <input
              type="number"
              min={1}
              max={12}
              value={content.event.month}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  event: { ...prev.event, month: Number(e.target.value) || prev.event.month },
                }))
              }
              className="input-field mt-1"
            />
          </div>
          <div>
            <label className="block text-xs text-muted">Օր (1-31)</label>
            <input
              type="number"
              min={1}
              max={31}
              value={content.event.day}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  event: { ...prev.event, day: Number(e.target.value) || prev.event.day },
                }))
              }
              className="input-field mt-1"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-gold/20 pt-5">
        <h3 className="font-serif text-sm font-medium text-ink">SEO և Հղման նկարագրություն</h3>
        <div className="mt-3 space-y-4">
          <div>
            <label className="block text-xs text-muted">Էջի վերնագիր (Title tag)</label>
            <input
              type="text"
              value={content.seo.title}
              onChange={(e) =>
                setContent((prev) => ({ ...prev, seo: { ...prev.seo, title: e.target.value } }))
              }
              placeholder="Օրինակ՝ Աննայի և Հայկի Մկրտությունը"
              className="input-field mt-1"
            />
          </div>
          <div>
            <label className="block text-xs text-muted">Կարճ նկարագրություն (Meta description)</label>
            <textarea
              rows={2}
              value={content.seo.description}
              onChange={(e) =>
                setContent((prev) => ({ ...prev, seo: { ...prev.seo, description: e.target.value } }))
              }
              placeholder="Սիրով հրավիրում ենք Ձեզ՝ ..."
              className="input-field mt-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------
 * TAB 2: Hero & Intro Gate
 * ---------------------------------------------------- */
function HeroTab({
  content,
  setContent,
}: {
  content: SiteContent;
  setContent: React.Dispatch<React.SetStateAction<SiteContent>>;
}) {
  return (
    <div className="space-y-6">
      {/* Intro Gate */}
      <div className="rounded-md border border-gold/25 bg-cream/30 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-sm font-medium text-ink">Բացման / Ողջույնի էկրան</h3>
            <p className="text-xs text-muted">Ապահովում է երաժշտության անխափան մեկնարկը բջջայիններում</p>
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-olive">
            <input
              type="checkbox"
              checked={content.intro.enabled}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  intro: { ...prev.intro, enabled: e.target.checked },
                }))
              }
              className="size-4 rounded border-gold/40 text-olive focus:ring-olive"
            />
            Միացված է
          </label>
        </div>

        {content.intro.enabled && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs text-muted">Վերևի տեքստ (Eyebrow)</label>
              <input
                type="text"
                value={content.intro.eyebrow}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    intro: { ...prev.intro, eyebrow: e.target.value },
                  }))
                }
                className="input-field mt-1"
              />
            </div>
            <div>
              <label className="block text-xs text-muted">Կոճակի տեքստ</label>
              <input
                type="text"
                value={content.intro.buttonLabel}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    intro: { ...prev.intro, buttonLabel: e.target.value },
                  }))
                }
                className="input-field mt-1"
              />
            </div>
          </div>
        )}
      </div>

      {/* Hero Section */}
      <div className="space-y-4">
        <h3 className="font-serif text-sm font-medium text-ink">Գլխավոր (Hero) Բաժնի տեքստեր</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs text-muted">Ողջույն (Greeting)</label>
            <input
              type="text"
              value={content.hero.greeting}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  hero: { ...prev.hero, greeting: e.target.value },
                }))
              }
              className="input-field mt-1"
            />
          </div>
          <div>
            <label className="block text-xs text-muted">Հրավերի առաջին տող</label>
            <input
              type="text"
              value={content.hero.inviteLine}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  hero: { ...prev.hero, inviteLine: e.target.value },
                }))
              }
              className="input-field mt-1"
            />
          </div>
          <div>
            <label className="block text-xs text-muted">Ենթատող (անունների տակ)</label>
            <input
              type="text"
              value={content.hero.subtitle}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  hero: { ...prev.hero, subtitle: e.target.value },
                }))
              }
              className="input-field mt-1"
            />
          </div>
          <div>
            <label className="block text-xs text-muted">Փակող տող (ամսաթվից առաջ)</label>
            <input
              type="text"
              value={content.hero.closing}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  hero: { ...prev.hero, closing: e.target.value },
                }))
              }
              className="input-field mt-1"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-olive">Գլխավոր ֆոնային լուսանկար</label>
          <div className="mt-1.5 flex items-center gap-3">
            <input
              type="text"
              value={content.hero.image.src}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  hero: {
                    ...prev.hero,
                    image: { ...prev.hero.image, src: e.target.value },
                  },
                }))
              }
              className="input-field flex-1"
              placeholder="/images/... կամ https://..."
            />
            <FileUploader
              accept="image/*"
              onUpload={(url) =>
                setContent((prev) => ({
                  ...prev,
                  hero: {
                    ...prev.hero,
                    image: { ...prev.hero.image, src: url },
                  },
                }))
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------
 * TAB 3: Schedule Items & Venues
 * ---------------------------------------------------- */
function ScheduleTab({
  content,
  setContent,
}: {
  content: SiteContent;
  setContent: React.Dispatch<React.SetStateAction<SiteContent>>;
}) {
  const items = content.program.items;

  function addItem() {
    const newItem: ScheduleItem = {
      id: `item-${Date.now()}`,
      time: "18:00",
      eyebrow: "Միջոցառում",
      title: "Նոր միջոցառում",
      venue: {
        name: "Վայրի անվանում",
        address: "",
        mapsQuery: "",
        mapsUrl: "",
        lat: 40.18,
        lng: 44.51,
      },
      description: "",
      image: {
        src: "/images/celebration-table.jpg",
        alt: "",
        position: "50% 50%",
      },
    };
    setContent((prev) => ({
      ...prev,
      program: { ...prev.program, items: [...prev.program.items, newItem] },
    }));
  }

  function removeItem(index: number) {
    if (items.length <= 1) {
      alert("Առնվազն մեկ միջոցառում պետք է լինի ծրագրում։");
      return;
    }
    setContent((prev) => ({
      ...prev,
      program: {
        ...prev.program,
        items: prev.program.items.filter((_, i) => i !== index),
      },
    }));
  }

  function updateItem(index: number, patch: Partial<ScheduleItem>) {
    setContent((prev) => ({
      ...prev,
      program: {
        ...prev.program,
        items: prev.program.items.map((item, i) => (i === index ? { ...item, ...patch } : item)),
      },
    }));
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs text-muted">Ծրագրի Eyebrow</label>
          <input
            type="text"
            value={content.program.eyebrow}
            onChange={(e) =>
              setContent((prev) => ({
                ...prev,
                program: { ...prev.program, eyebrow: e.target.value },
              }))
            }
            className="input-field mt-1"
          />
        </div>
        <div>
          <label className="block text-xs text-muted">Ծրագրի Վերնագիր</label>
          <input
            type="text"
            value={content.program.title}
            onChange={(e) =>
              setContent((prev) => ({
                ...prev,
                program: { ...prev.program, title: e.target.value },
              }))
            }
            className="input-field mt-1"
          />
        </div>
      </div>

      <div className="space-y-5">
        {items.map((item, index) => (
          <div key={item.id || index} className="rounded-lg border border-gold/30 bg-cream/20 p-5">
            <div className="flex items-center justify-between border-b border-gold/20 pb-3">
              <span className="font-serif text-sm font-medium text-ink">
                #{index + 1} — {item.title || "Անանուն"} ({item.time})
              </span>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-muted transition-colors hover:text-red-700"
                title="Ջնջել"
              >
                <Trash2 className="size-4" />
              </button>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs text-muted">Ժամ (HH:MM)</label>
                <input
                  type="text"
                  value={item.time}
                  onChange={(e) => updateItem(index, { time: e.target.value })}
                  className="input-field mt-1"
                />
              </div>
              <div>
                <label className="block text-xs text-muted">Ենթավերնագիր (Eyebrow)</label>
                <input
                  type="text"
                  value={item.eyebrow}
                  onChange={(e) => updateItem(index, { eyebrow: e.target.value })}
                  className="input-field mt-1"
                />
              </div>
              <div>
                <label className="block text-xs text-muted">Վերնագիր</label>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateItem(index, { title: e.target.value })}
                  className="input-field mt-1"
                />
              </div>
            </div>

            {/* Venue Details */}
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs text-muted">Վայրի անվանում (Venue name)</label>
                <input
                  type="text"
                  value={item.venue.name}
                  onChange={(e) =>
                    updateItem(index, {
                      venue: { ...item.venue, name: e.target.value },
                    })
                  }
                  className="input-field mt-1"
                />
              </div>
              <div>
                <label className="block text-xs text-muted">Հասցե (Address)</label>
                <input
                  type="text"
                  value={item.venue.address}
                  onChange={(e) =>
                    updateItem(index, {
                      venue: { ...item.venue, address: e.target.value },
                    })
                  }
                  className="input-field mt-1"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs text-muted">Google Maps հղում (URL)</label>
                <input
                  type="text"
                  value={item.venue.mapsUrl}
                  onChange={(e) =>
                    updateItem(index, {
                      venue: { ...item.venue, mapsUrl: e.target.value },
                    })
                  }
                  className="input-field mt-1"
                  placeholder="https://maps.google.com/..."
                />
              </div>
              <div>
                <label className="block text-xs text-muted">GPS Լայնություն (Lat)</label>
                <input
                  type="number"
                  step="0.00001"
                  value={item.venue.lat}
                  onChange={(e) =>
                    updateItem(index, {
                      venue: { ...item.venue, lat: Number(e.target.value) || 0 },
                    })
                  }
                  className="input-field mt-1"
                />
              </div>
              <div>
                <label className="block text-xs text-muted">GPS Երկայնություն (Lng)</label>
                <input
                  type="number"
                  step="0.00001"
                  value={item.venue.lng}
                  onChange={(e) =>
                    updateItem(index, {
                      venue: { ...item.venue, lng: Number(e.target.value) || 0 },
                    })
                  }
                  className="input-field mt-1"
                />
              </div>
            </div>

            {/* Image */}
            <div className="mt-4">
              <label className="block text-xs text-muted">Քարտի լուսանկար</label>
              <div className="mt-1 flex items-center gap-3">
                <input
                  type="text"
                  value={item.image.src}
                  onChange={(e) =>
                    updateItem(index, {
                      image: { ...item.image, src: e.target.value },
                    })
                  }
                  className="input-field flex-1"
                />
                <FileUploader
                  accept="image/*"
                  onUpload={(url) =>
                    updateItem(index, {
                      image: { ...item.image, src: url },
                    })
                  }
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-1.5 rounded-full border border-gold/50 bg-cream/50 px-4 py-2 text-xs font-medium text-olive hover:bg-cream"
        >
          <Plus className="size-3.5" />
          Ավելացնել միջոցառում
        </button>
      </div>
    </div>
  );
}

/* ----------------------------------------------------
 * TAB 4: Blessing & Countdown
 * ---------------------------------------------------- */
function BlessingTab({
  content,
  setContent,
}: {
  content: SiteContent;
  setContent: React.Dispatch<React.SetStateAction<SiteContent>>;
}) {
  return (
    <div className="space-y-6">
      {/* Blessing */}
      <div className="rounded-md border border-gold/25 bg-cream/30 p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-sm font-medium text-ink">Մաղթանքի բաժին</h3>
          <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-olive">
            <input
              type="checkbox"
              checked={content.blessing.enabled}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  blessing: { ...prev.blessing, enabled: e.target.checked },
                }))
              }
              className="size-4 rounded border-gold/40 text-olive focus:ring-olive"
            />
            Միացված է
          </label>
        </div>

        {content.blessing.enabled && (
          <div className="mt-4">
            <label className="block text-xs text-muted">Մաղթանքի տողեր (ամեն տողը նոր տողում)</label>
            <textarea
              rows={4}
              value={content.blessing.lines.join("\n")}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  blessing: {
                    ...prev.blessing,
                    lines: e.target.value
                      .split("\n")
                      .map((l) => l.trim())
                      .filter(Boolean),
                  },
                }))
              }
              className="input-field mt-1"
            />
          </div>
        )}
      </div>

      {/* Countdown */}
      <div className="rounded-md border border-gold/25 bg-cream/30 p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-sm font-medium text-ink">Հետհաշվարկի բաժին</h3>
          <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-olive">
            <input
              type="checkbox"
              checked={content.countdown.enabled}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  countdown: { ...prev.countdown, enabled: e.target.checked },
                }))
              }
              className="size-4 rounded border-gold/40 text-olive focus:ring-olive"
            />
            Միացված է
          </label>
        </div>

        {content.countdown.enabled && (
          <div className="mt-4">
            <label className="block text-xs text-muted">Հետհաշվարկի վերնագիր</label>
            <input
              type="text"
              value={content.countdown.title}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  countdown: { ...prev.countdown, title: e.target.value },
                }))
              }
              className="input-field mt-1"
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* ----------------------------------------------------
 * TAB 5: Gallery
 * ---------------------------------------------------- */
function GalleryTab({
  content,
  setContent,
}: {
  content: SiteContent;
  setContent: React.Dispatch<React.SetStateAction<SiteContent>>;
}) {
  const photos = content.gallery.photos;

  function addPhoto() {
    setContent((prev) => ({
      ...prev,
      gallery: {
        ...prev.gallery,
        photos: [...prev.gallery.photos, { src: "", alt: "Նոր լուսանկար" }],
      },
    }));
  }

  function removePhoto(index: number) {
    setContent((prev) => ({
      ...prev,
      gallery: {
        ...prev.gallery,
        photos: prev.gallery.photos.filter((_, i) => i !== index),
      },
    }));
  }

  function updatePhoto(index: number, patch: { src?: string; alt?: string }) {
    setContent((prev) => ({
      ...prev,
      gallery: {
        ...prev.gallery,
        photos: prev.gallery.photos.map((p, i) => (i === index ? { ...p, ...patch } : p)),
      },
    }));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-md border border-gold/25 bg-cream/30 p-4">
        <div>
          <h3 className="font-serif text-sm font-medium text-ink">Լուսանկարների պատկերասրահ</h3>
          <p className="text-xs text-muted">Ցուցադրվում է հետհաշվարկից հետո</p>
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-olive">
          <input
            type="checkbox"
            checked={content.gallery.enabled}
            onChange={(e) =>
              setContent((prev) => ({
                ...prev,
                gallery: { ...prev.gallery, enabled: e.target.checked },
              }))
            }
            className="size-4 rounded border-gold/40 text-olive focus:ring-olive"
          />
          Միացված է
        </label>
      </div>

      {content.gallery.enabled && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs text-muted">Պատկերասրահի Eyebrow</label>
              <input
                type="text"
                value={content.gallery.eyebrow}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    gallery: { ...prev.gallery, eyebrow: e.target.value },
                  }))
                }
                className="input-field mt-1"
              />
            </div>
            <div>
              <label className="block text-xs text-muted">Պատկերասրահի Վերնագիր</label>
              <input
                type="text"
                value={content.gallery.title}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    gallery: { ...prev.gallery, title: e.target.value },
                  }))
                }
                className="input-field mt-1"
              />
            </div>
          </div>

          <div className="space-y-3">
            {photos.map((photo, index) => (
              <div key={index} className="flex items-center gap-3 rounded-md border border-gold/20 bg-cream/20 p-3">
                <span className="text-xs text-muted">#{index + 1}</span>
                <input
                  type="text"
                  value={photo.src}
                  onChange={(e) => updatePhoto(index, { src: e.target.value })}
                  placeholder="URL կամ բեռնեք..."
                  className="input-field flex-1"
                />
                <input
                  type="text"
                  value={photo.alt}
                  onChange={(e) => updatePhoto(index, { alt: e.target.value })}
                  placeholder="Նկարագրություն"
                  className="input-field w-40"
                />
                <FileUploader
                  accept="image/*"
                  onUpload={(url) => updatePhoto(index, { src: url })}
                />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="text-muted hover:text-red-700"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addPhoto}
              className="inline-flex items-center gap-1.5 rounded-full border border-gold/50 bg-cream/50 px-4 py-2 text-xs font-medium text-olive hover:bg-cream"
            >
              <Plus className="size-3.5" />
              Ավելացնել լուսանկար
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ----------------------------------------------------
 * TAB 6: RSVP
 * ---------------------------------------------------- */
function RsvpTab({
  content,
  setContent,
}: {
  content: SiteContent;
  setContent: React.Dispatch<React.SetStateAction<SiteContent>>;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-md border border-gold/25 bg-cream/30 p-4">
        <div>
          <h3 className="font-serif text-sm font-medium text-ink">Մասնակցության հաստատման ձև (RSVP)</h3>
          <p className="text-xs text-muted">Թույլ է տալիս հյուրերին հաստատել ներկայությունը</p>
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-olive">
          <input
            type="checkbox"
            checked={content.rsvp.enabled}
            onChange={(e) =>
              setContent((prev) => ({
                ...prev,
                rsvp: { ...prev.rsvp, enabled: e.target.checked },
              }))
            }
            className="size-4 rounded border-gold/40 text-olive focus:ring-olive"
          />
          Միացված է
        </label>
      </div>

      {content.rsvp.enabled && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs text-muted">Բաժնի Eyebrow</label>
            <input
              type="text"
              value={content.rsvp.eyebrow}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  rsvp: { ...prev.rsvp, eyebrow: e.target.value },
                }))
              }
              className="input-field mt-1"
            />
          </div>
          <div>
            <label className="block text-xs text-muted">Բաժնի Վերնագիր</label>
            <input
              type="text"
              value={content.rsvp.title}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  rsvp: { ...prev.rsvp, title: e.target.value },
                }))
              }
              className="input-field mt-1"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs text-muted">Ենթատեքստ</label>
            <input
              type="text"
              value={content.rsvp.text}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  rsvp: { ...prev.rsvp, text: e.target.value },
                }))
              }
              className="input-field mt-1"
            />
          </div>
          <div>
            <label className="block text-xs text-muted">Առավելագույն հյուրերի քանակ (մեկ ընտանիքի համար)</label>
            <input
              type="number"
              min={1}
              max={50}
              value={content.rsvp.maxGuests}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  rsvp: { ...prev.rsvp, maxGuests: Number(e.target.value) || 10 },
                }))
              }
              className="input-field mt-1"
            />
          </div>
          <div>
            <label className="block text-xs text-muted">Հաստատման կոճակի տեքստ</label>
            <input
              type="text"
              value={content.rsvp.submitLabel}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  rsvp: { ...prev.rsvp, submitLabel: e.target.value },
                }))
              }
              className="input-field mt-1"
            />
          </div>
          <div>
            <label className="block text-xs text-muted">«Կմասնակցեմ» տարբերակ</label>
            <input
              type="text"
              value={content.rsvp.yesLabel}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  rsvp: { ...prev.rsvp, yesLabel: e.target.value },
                }))
              }
              className="input-field mt-1"
            />
          </div>
          <div>
            <label className="block text-xs text-muted">«Չեմ մասնակցի» տարբերակ</label>
            <input
              type="text"
              value={content.rsvp.noLabel}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  rsvp: { ...prev.rsvp, noLabel: e.target.value },
                }))
              }
              className="input-field mt-1"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs text-muted">Հաջողության հաղորդագրություն (մասնակցելիս)</label>
            <input
              type="text"
              value={content.rsvp.success}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  rsvp: { ...prev.rsvp, success: e.target.value },
                }))
              }
              className="input-field mt-1"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs text-muted">Հաղորդագրություն (մերժելիս)</label>
            <input
              type="text"
              value={content.rsvp.successDeclined}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  rsvp: { ...prev.rsvp, successDeclined: e.target.value },
                }))
              }
              className="input-field mt-1"
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------------------
 * TAB 7: Music & Theme
 * ---------------------------------------------------- */
function MusicTab({
  content,
  setContent,
}: {
  content: SiteContent;
  setContent: React.Dispatch<React.SetStateAction<SiteContent>>;
}) {
  return (
    <div className="space-y-6">
      {/* Music */}
      <div className="rounded-md border border-gold/25 bg-cream/30 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-sm font-medium text-ink">Ֆոնային երաժշտություն</h3>
            <p className="text-xs text-muted">MP3 աուդիո ֆայլ</p>
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-olive">
            <input
              type="checkbox"
              checked={content.music.enabled}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  music: { ...prev.music, enabled: e.target.checked },
                }))
              }
              className="size-4 rounded border-gold/40 text-olive focus:ring-olive"
            />
            Միացված է
          </label>
        </div>

        {content.music.enabled && (
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-xs text-muted">Երաժշտության ֆայլ (.mp3)</label>
              <div className="mt-1 flex items-center gap-3">
                <input
                  type="text"
                  value={content.music.src}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      music: { ...prev.music, src: e.target.value },
                    }))
                  }
                  className="input-field flex-1"
                  placeholder="/sound/sound.mp3 կամ https://..."
                />
                <FileUploader
                  accept="audio/*"
                  label="Վերբեռնել MP3"
                  onUpload={(url) =>
                    setContent((prev) => ({
                      ...prev,
                      music: { ...prev.music, src: url },
                    }))
                  }
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-muted">
                <span>Ձայնի ուժգնություն (Volume)</span>
                <span>{Math.round((content.music.volume ?? 0.5) * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={content.music.volume ?? 0.5}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    music: { ...prev.music, volume: Number(e.target.value) },
                  }))
                }
                className="mt-2 w-full accent-olive"
              />
            </div>
          </div>
        )}
      </div>

      {/* Theme Colors */}
      <div className="rounded-md border border-gold/25 bg-cream/30 p-4">
        <h3 className="font-serif text-sm font-medium text-ink">Կայքի գույներ (Color Theme)</h3>
        <p className="mt-1 text-xs text-muted">Կարող եք հարմարեցնել կայքի գունային գամման</p>

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <ColorPicker
            label="Ձիթապտղագույն (Olive)"
            value={content.theme.olive}
            onChange={(val) =>
              setContent((prev) => ({
                ...prev,
                theme: { ...prev.theme, olive: val },
              }))
            }
          />
          <ColorPicker
            label="Մուգ ձիթապտղագույն"
            value={content.theme.oliveDeep}
            onChange={(val) =>
              setContent((prev) => ({
                ...prev,
                theme: { ...prev.theme, oliveDeep: val },
              }))
            }
          />
          <ColorPicker
            label="Ոսկեգույն (Gold)"
            value={content.theme.gold}
            onChange={(val) =>
              setContent((prev) => ({
                ...prev,
                theme: { ...prev.theme, gold: val },
              }))
            }
          />
          <ColorPicker
            label="Մեղմ ոսկեգույն"
            value={content.theme.goldSoft}
            onChange={(val) =>
              setContent((prev) => ({
                ...prev,
                theme: { ...prev.theme, goldSoft: val },
              }))
            }
          />
          <ColorPicker
            label="Փղոսկրագույն (Ivory)"
            value={content.theme.ivory}
            onChange={(val) =>
              setContent((prev) => ({
                ...prev,
                theme: { ...prev.theme, ivory: val },
              }))
            }
          />
          <ColorPicker
            label="Կրեմագույն (Cream)"
            value={content.theme.cream}
            onChange={(val) =>
              setContent((prev) => ({
                ...prev,
                theme: { ...prev.theme, cream: val },
              }))
            }
          />
        </div>
      </div>

      {/* Footer Signature */}
      <div className="rounded-md border border-gold/25 bg-cream/30 p-4">
        <h3 className="font-serif text-sm font-medium text-ink">Ֆուտերի ստորագրություն</h3>
        <input
          type="text"
          value={content.footer.signature}
          onChange={(e) =>
            setContent((prev) => ({
              ...prev,
              footer: { ...prev.footer, signature: e.target.value },
            }))
          }
          className="input-field mt-2"
          placeholder="Սիրով՝ Աննայի և Հայկի ընտանիք"
        />
      </div>
    </div>
  );
}

function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs text-muted">{label}</label>
      <div className="mt-1 flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="size-8 cursor-pointer rounded border border-gold/30 bg-transparent p-0.5"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input-field flex-1 text-xs"
        />
      </div>
    </div>
  );
}
