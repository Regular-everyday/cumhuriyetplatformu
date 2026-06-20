"use client";

import { useCallback, useEffect, useState } from "react";
import type { MembershipApplication, SiteData } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { adminFetch, loadAdminData } from "./useAdminApi";
import TeamImageUpload from "./TeamImageUpload";

type Tab =
  | "dashboard"
  | "announcements"
  | "events"
  | "news"
  | "projects"
  | "press"
  | "publications"
  | "team"
  | "members"
  | "about"
  | "settings";

const TABS: { id: Tab; label: string }[] = [
  { id: "dashboard", label: "Genel Bakış" },
  { id: "announcements", label: "Duyurular" },
  { id: "events", label: "Etkinlikler" },
  { id: "news", label: "Haberler" },
  { id: "projects", label: "Projeler" },
  { id: "press", label: "Basında Biz" },
  { id: "publications", label: "Yayınlar" },
  { id: "team", label: "Yönetim Kadrosu" },
  { id: "members", label: "Üyelik Başvuruları" },
  { id: "about", label: "Hakkımızda" },
  { id: "settings", label: "Site Ayarları" },
];

const statusLabels: Record<MembershipApplication["status"], string> = {
  beklemede: "Beklemede",
  onaylandi: "Onaylandı",
  reddedildi: "Reddedildi",
};

const statusColors: Record<MembershipApplication["status"], string> = {
  beklemede: "bg-yellow-100 text-yellow-800",
  onaylandi: "bg-green-100 text-green-800",
  reddedildi: "bg-red-100 text-red-800",
};

const inputClass =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20";

interface AdminPanelProps {
  onLogout: () => void;
}

export default function AdminPanel({ onLogout }: AdminPanelProps) {
  const [data, setData] = useState<SiteData | null>(null);
  const [tab, setTab] = useState<Tab>("dashboard");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    const siteData = await loadAdminData();
    setData(siteData);
  }, []);

  useEffect(() => {
    loadAdminData()
      .then(setData)
      .catch(() => setError("Veriler yüklenemedi."))
      .finally(() => setLoading(false));
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    onLogout();
  }

  async function runAction(
    action: string,
    payload: Record<string, unknown>,
    successMsg?: string
  ) {
    setError("");
    setMessage("");
    try {
      await adminFetch(action, payload);
      await refresh();
      if (successMsg) setMessage(successMsg);
    } catch (err) {
      setError(err instanceof Error ? err.message : "İşlem başarısız");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-600">Yükleniyor...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-red-600">{error || "Veri yüklenemedi."}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-gray-200 bg-brand-red text-white lg:flex">
        <div className="border-b border-white/20 p-5">
          <h1 className="text-lg font-bold">Yönetim Paneli</h1>
          <p className="text-xs text-white/70">Mersin Cumhuriyet Platformu</p>
        </div>
        <nav className="flex-1 overflow-y-auto p-3">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`mb-1 w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                tab === t.id ? "bg-white/20 text-white" : "text-white/80 hover:bg-white/10"
              }`}
            >
              {t.label}
              {t.id === "members" && data.members.length > 0 && (
                <span className="ml-2 rounded-full bg-brand-gold px-2 py-0.5 text-xs text-brand-red">
                  {data.members.filter((m) => m.status === "beklemede").length}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="border-t border-white/20 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-lg bg-white/10 px-3 py-2 text-sm hover:bg-white/20"
          >
            Güvenli Çıkış
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 lg:px-6">
          <div className="lg:hidden">
            <select
              value={tab}
              onChange={(e) => setTab(e.target.value as Tab)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
            >
              {TABS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <h2 className="hidden text-lg font-bold text-brand-red lg:block">
            {TABS.find((t) => t.id === tab)?.label}
          </h2>
          <button
            type="button"
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-brand-red lg:hidden"
          >
            Çıkış
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {message && (
            <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-800">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          {tab === "dashboard" && <Dashboard data={data} />}
          {tab === "announcements" && (
            <AnnouncementsManager data={data} onAction={runAction} />
          )}
          {tab === "events" && <EventsManager data={data} onAction={runAction} />}
          {tab === "news" && <NewsManager data={data} onAction={runAction} />}
          {tab === "projects" && <ProjectsManager data={data} onAction={runAction} />}
          {tab === "press" && <PressManager data={data} onAction={runAction} />}
          {tab === "publications" && (
            <PublicationsManager data={data} onAction={runAction} />
          )}
          {tab === "team" && <TeamManager data={data} onAction={runAction} />}
          {tab === "members" && <MembersManager data={data} onAction={runAction} />}
          {tab === "about" && <AboutManager data={data} onAction={runAction} />}
          {tab === "settings" && <SettingsManager data={data} onAction={runAction} />}
        </main>
      </div>
    </div>
  );
}

function Dashboard({ data }: { data: SiteData }) {
  const stats = [
    { label: "Duyurular", value: data.announcements.length },
    { label: "Etkinlikler", value: data.events.length },
    { label: "Haberler", value: data.news.length },
    { label: "Projeler", value: data.projects.length },
    { label: "Üye Başvuruları", value: data.members.length },
    {
      label: "Bekleyen Başvuru",
      value: data.members.filter((m) => m.status === "beklemede").length,
    },
  ];

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="mt-1 text-3xl font-bold text-brand-red">{s.value}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-sm text-gray-500">
        Sol menüden tüm site içeriklerini yönetebilirsiniz. Değişiklikler anında sitede görünür.
      </p>
    </div>
  );
}

type ActionFn = (
  action: string,
  payload: Record<string, unknown>,
  successMsg?: string
) => Promise<void>;

function AnnouncementsManager({
  data,
  onAction,
}: {
  data: SiteData;
  onAction: ActionFn;
}) {
  const [text, setText] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  return (
    <ContentSection
      title="Duyurular"
      onAdd={() => {
        if (!text.trim()) return;
        onAction("create", {
          resource: "announcements",
          data: { text, active: true, createdAt: new Date().toISOString().slice(0, 10) },
        }, "Duyuru eklendi.");
        setText("");
      }}
      addLabel="Duyuru Ekle"
    >
      <textarea
        className={inputClass}
        rows={2}
        placeholder="Yeni duyuru metni..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="mt-4 space-y-3">
        {data.announcements.map((a) => (
          <div key={a.id} className="flex items-start justify-between gap-4 rounded-lg bg-white p-4 shadow-sm">
            {editing === a.id ? (
              <div className="flex-1 space-y-2">
                <textarea
                  className={inputClass}
                  rows={2}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="btn-primary text-xs"
                    onClick={() => {
                      onAction("update", {
                        resource: "announcements",
                        id: a.id,
                        data: { text: editText, active: a.active, createdAt: a.createdAt },
                      }, "Güncellendi.");
                      setEditing(null);
                    }}
                  >
                    Kaydet
                  </button>
                  <button type="button" className="text-xs text-gray-500" onClick={() => setEditing(null)}>
                    İptal
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1">
                  <p className="font-medium">{a.text}</p>
                  <p className="mt-1 text-xs text-gray-400">{formatDate(a.createdAt)}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    className={`rounded-full px-2 py-0.5 text-xs ${a.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}
                    onClick={() =>
                      onAction("update", {
                        resource: "announcements",
                        id: a.id,
                        data: { ...a, active: !a.active },
                      })
                    }
                  >
                    {a.active ? "Aktif" : "Pasif"}
                  </button>
                  <button
                    type="button"
                    className="text-xs text-brand-red"
                    onClick={() => { setEditing(a.id); setEditText(a.text); }}
                  >
                    Düzenle
                  </button>
                  <button
                    type="button"
                    className="text-xs text-red-500"
                    onClick={() => {
                      if (confirm("Silmek istediğinize emin misiniz?")) {
                        onAction("delete", { resource: "announcements", id: a.id }, "Silindi.");
                      }
                    }}
                  >
                    Sil
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </ContentSection>
  );
}

function EventsManager({ data, onAction }: { data: SiteData; onAction: ActionFn }) {
  const empty = { title: "", description: "", date: "", location: "" };
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);

  const fields = (
    f: typeof empty,
    set: (v: typeof empty) => void
  ) => (
    <div className="grid gap-3 sm:grid-cols-2">
      <input className={inputClass} placeholder="Başlık" value={f.title} onChange={(e) => set({ ...f, title: e.target.value })} />
      <input className={inputClass} type="date" value={f.date} onChange={(e) => set({ ...f, date: e.target.value })} />
      <input className={inputClass} placeholder="Konum" value={f.location} onChange={(e) => set({ ...f, location: e.target.value })} />
      <textarea className={`${inputClass} sm:col-span-2`} rows={2} placeholder="Açıklama" value={f.description} onChange={(e) => set({ ...f, description: e.target.value })} />
    </div>
  );

  return (
    <ContentSection
      title="Etkinlikler"
      onAdd={() => {
        if (!form.title || !form.date) return;
        onAction("create", { resource: "events", data: form }, "Etkinlik eklendi.");
        setForm(empty);
      }}
    >
      {fields(form, setForm)}
      <ItemList
        items={data.events}
        render={(e) => (
          <div>
            <p className="font-bold">{e.title}</p>
            <p className="text-sm text-gray-600">{e.description}</p>
            <p className="mt-1 text-xs text-gray-400">{formatDate(e.date)} — {e.location}</p>
          </div>
        )}
        onEdit={(e) => { setEditing(e.id); setForm({ title: e.title, description: e.description, date: e.date, location: e.location }); }}
        onDelete={(id) => onAction("delete", { resource: "events", id }, "Silindi.")}
        editing={editing}
        onSaveEdit={() => {
          if (!editing) return;
          onAction("update", { resource: "events", id: editing, data: form }, "Güncellendi.");
          setEditing(null);
          setForm(empty);
        }}
        onCancelEdit={() => { setEditing(null); setForm(empty); }}
        editForm={editing ? fields(form, setForm) : null}
      />
    </ContentSection>
  );
}

function NewsManager({ data, onAction }: { data: SiteData; onAction: ActionFn }) {
  const empty = { title: "", excerpt: "", content: "", date: new Date().toISOString().slice(0, 10) };
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);

  const fields = (f: typeof empty, set: (v: typeof empty) => void) => (
    <div className="space-y-3">
      <input className={inputClass} placeholder="Başlık" value={f.title} onChange={(e) => set({ ...f, title: e.target.value })} />
      <input className={inputClass} type="date" value={f.date} onChange={(e) => set({ ...f, date: e.target.value })} />
      <input className={inputClass} placeholder="Özet" value={f.excerpt} onChange={(e) => set({ ...f, excerpt: e.target.value })} />
      <textarea className={inputClass} rows={4} placeholder="İçerik" value={f.content} onChange={(e) => set({ ...f, content: e.target.value })} />
    </div>
  );

  return (
    <ContentSection
      title="Haberler"
      onAdd={() => {
        if (!form.title) return;
        onAction("create", { resource: "news", data: form }, "Haber eklendi.");
        setForm(empty);
      }}
    >
      {fields(form, setForm)}
      <ItemList
        items={data.news}
        render={(n) => (
          <div>
            <p className="font-bold">{n.title}</p>
            <p className="text-sm text-gray-600">{n.excerpt}</p>
            <p className="mt-1 text-xs text-gray-400">{formatDate(n.date)}</p>
          </div>
        )}
        onEdit={(n) => { setEditing(n.id); setForm({ title: n.title, excerpt: n.excerpt, content: n.content, date: n.date }); }}
        onDelete={(id) => onAction("delete", { resource: "news", id }, "Silindi.")}
        editing={editing}
        onSaveEdit={() => {
          if (!editing) return;
          onAction("update", { resource: "news", id: editing, data: form }, "Güncellendi.");
          setEditing(null);
          setForm(empty);
        }}
        onCancelEdit={() => { setEditing(null); setForm(empty); }}
        editForm={editing ? fields(form, setForm) : null}
      />
    </ContentSection>
  );
}

function ProjectsManager({ data, onAction }: { data: SiteData; onAction: ActionFn }) {
  const empty = { title: "", description: "", status: "planlaniyor" as const };
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);

  const fields = (f: typeof empty, set: (v: typeof empty) => void) => (
    <div className="space-y-3">
      <input className={inputClass} placeholder="Proje adı" value={f.title} onChange={(e) => set({ ...f, title: e.target.value })} />
      <textarea className={inputClass} rows={2} placeholder="Açıklama" value={f.description} onChange={(e) => set({ ...f, description: e.target.value })} />
      <select className={inputClass} value={f.status} onChange={(e) => set({ ...f, status: e.target.value as typeof f.status })}>
        <option value="planlaniyor">Planlanıyor</option>
        <option value="devam-ediyor">Devam Ediyor</option>
        <option value="tamamlandi">Tamamlandı</option>
      </select>
    </div>
  );

  return (
    <ContentSection title="Projeler" onAdd={() => {
      if (!form.title) return;
      onAction("create", { resource: "projects", data: form }, "Proje eklendi.");
      setForm(empty);
    }}>
      {fields(form, setForm)}
      <ItemList
        items={data.projects}
        render={(p) => (
          <div>
            <p className="font-bold">{p.title}</p>
            <p className="text-sm text-gray-600">{p.description}</p>
            <span className="mt-1 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs">{p.status}</span>
          </div>
        )}
        onEdit={(p) => { setEditing(p.id); setForm({ title: p.title, description: p.description, status: p.status }); }}
        onDelete={(id) => onAction("delete", { resource: "projects", id }, "Silindi.")}
        editing={editing}
        onSaveEdit={() => {
          if (!editing) return;
          onAction("update", { resource: "projects", id: editing, data: form }, "Güncellendi.");
          setEditing(null);
          setForm(empty);
        }}
        onCancelEdit={() => { setEditing(null); setForm(empty); }}
        editForm={editing ? fields(form, setForm) : null}
      />
    </ContentSection>
  );
}

function PressManager({ data, onAction }: { data: SiteData; onAction: ActionFn }) {
  const empty = { title: "", source: "", date: new Date().toISOString().slice(0, 10), url: "" };
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);

  const fields = (f: typeof empty, set: (v: typeof empty) => void) => (
    <div className="grid gap-3 sm:grid-cols-2">
      <input className={inputClass} placeholder="Haber başlığı" value={f.title} onChange={(e) => set({ ...f, title: e.target.value })} />
      <input className={inputClass} placeholder="Kaynak" value={f.source} onChange={(e) => set({ ...f, source: e.target.value })} />
      <input className={inputClass} type="date" value={f.date} onChange={(e) => set({ ...f, date: e.target.value })} />
      <input className={inputClass} placeholder="URL (https://...)" value={f.url} onChange={(e) => set({ ...f, url: e.target.value })} />
    </div>
  );

  return (
    <ContentSection title="Basında Biz" onAdd={() => {
      if (!form.title) return;
      onAction("create", { resource: "press", data: form }, "Kayıt eklendi.");
      setForm(empty);
    }}>
      {fields(form, setForm)}
      <ItemList
        items={data.press}
        render={(p) => (
          <div>
            <p className="font-bold">{p.title}</p>
            <p className="text-sm text-gray-500">{p.source} — {formatDate(p.date)}</p>
          </div>
        )}
        onEdit={(p) => { setEditing(p.id); setForm({ title: p.title, source: p.source, date: p.date, url: p.url || "" }); }}
        onDelete={(id) => onAction("delete", { resource: "press", id }, "Silindi.")}
        editing={editing}
        onSaveEdit={() => {
          if (!editing) return;
          onAction("update", { resource: "press", id: editing, data: form }, "Güncellendi.");
          setEditing(null);
          setForm(empty);
        }}
        onCancelEdit={() => { setEditing(null); setForm(empty); }}
        editForm={editing ? fields(form, setForm) : null}
      />
    </ContentSection>
  );
}

function PublicationsManager({ data, onAction }: { data: SiteData; onAction: ActionFn }) {
  const empty = { title: "", description: "", type: "dokuman" as const, date: new Date().toISOString().slice(0, 10), fileUrl: "" };
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);

  const fields = (f: typeof empty, set: (v: typeof empty) => void) => (
    <div className="space-y-3">
      <input className={inputClass} placeholder="Başlık" value={f.title} onChange={(e) => set({ ...f, title: e.target.value })} />
      <textarea className={inputClass} rows={2} placeholder="Açıklama" value={f.description} onChange={(e) => set({ ...f, description: e.target.value })} />
      <select className={inputClass} value={f.type} onChange={(e) => set({ ...f, type: e.target.value as "yayin" | "dokuman" })}>
        <option value="dokuman">Doküman</option>
        <option value="yayin">Yayın</option>
      </select>
      <input className={inputClass} type="date" value={f.date} onChange={(e) => set({ ...f, date: e.target.value })} />
      <input className={inputClass} placeholder="Dosya URL (https://...)" value={f.fileUrl} onChange={(e) => set({ ...f, fileUrl: e.target.value })} />
    </div>
  );

  return (
    <ContentSection title="Yayınlar / Dokümanlar" onAdd={() => {
      if (!form.title) return;
      onAction("create", { resource: "publications", data: form }, "Kayıt eklendi.");
      setForm(empty);
    }}>
      {fields(form, setForm)}
      <ItemList
        items={data.publications}
        render={(p) => (
          <div>
            <p className="font-bold">{p.title}</p>
            <p className="text-sm text-gray-600">{p.description}</p>
            <p className="text-xs text-gray-400">{p.type} — {formatDate(p.date)}</p>
          </div>
        )}
        onEdit={(p) => { setEditing(p.id); setForm({ title: p.title, description: p.description, type: p.type, date: p.date, fileUrl: p.fileUrl || "" }); }}
        onDelete={(id) => onAction("delete", { resource: "publications", id }, "Silindi.")}
        editing={editing}
        onSaveEdit={() => {
          if (!editing) return;
          onAction("update", { resource: "publications", id: editing, data: form }, "Güncellendi.");
          setEditing(null);
          setForm(empty);
        }}
        onCancelEdit={() => { setEditing(null); setForm(empty); }}
        editForm={editing ? fields(form, setForm) : null}
      />
    </ContentSection>
  );
}

function TeamManager({ data, onAction }: { data: SiteData; onAction: ActionFn }) {
  const empty = { name: "", role: "", bio: "", image: "" };
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);

  const fields = (
    f: typeof empty,
    set: (v: typeof empty) => void,
    memberId?: string
  ) => (
    <div className="grid gap-3 sm:grid-cols-2">
      <TeamImageUpload
        image={f.image || undefined}
        memberId={memberId}
        onUploaded={(url) => set({ ...f, image: url })}
        onRemoved={() => set({ ...f, image: "" })}
      />
      <input className={inputClass} placeholder="Ad Soyad" value={f.name} onChange={(e) => set({ ...f, name: e.target.value })} />
      <input className={inputClass} placeholder="Görev" value={f.role} onChange={(e) => set({ ...f, role: e.target.value })} />
      <textarea className={`${inputClass} sm:col-span-2`} rows={2} placeholder="Biyografi" value={f.bio} onChange={(e) => set({ ...f, bio: e.target.value })} />
    </div>
  );

  const teamData = (f: typeof empty) => ({
    name: f.name,
    role: f.role,
    bio: f.bio,
    image: f.image || "",
  });

  return (
    <ContentSection title="Yönetim Kadrosu" onAdd={() => {
      if (!form.name) return;
      onAction("create", { resource: "team", data: teamData(form) }, "Üye eklendi.");
      setForm(empty);
    }}>
      {fields(form, setForm)}
      <ItemList
        items={data.team}
        render={(m) => (
          <div className="flex items-center gap-4">
            {m.image ? (
              <img
                src={m.image}
                alt={m.name}
                className="h-14 w-14 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-red/10 text-sm font-bold text-brand-red">
                {m.name.split(" ").map((n) => n[0]).join("")}
              </div>
            )}
            <div>
              <p className="font-bold">{m.name}</p>
              <p className="text-sm font-medium text-brand-gold">{m.role}</p>
              <p className="text-sm text-gray-600">{m.bio}</p>
            </div>
          </div>
        )}
        onEdit={(m) => {
          setEditing(m.id);
          setForm({ name: m.name, role: m.role, bio: m.bio, image: m.image || "" });
        }}
        onDelete={(id) => onAction("delete", { resource: "team", id }, "Silindi.")}
        editing={editing}
        onSaveEdit={() => {
          if (!editing) return;
          onAction("update", { resource: "team", id: editing, data: teamData(form) }, "Güncellendi.");
          setEditing(null);
          setForm(empty);
        }}
        onCancelEdit={() => { setEditing(null); setForm(empty); }}
        editForm={editing ? fields(form, setForm, editing) : null}
      />
    </ContentSection>
  );
}

function MembersManager({ data, onAction }: { data: SiteData; onAction: ActionFn }) {
  const members = [...data.members].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (members.length === 0) {
    return <div className="rounded-xl bg-white p-12 text-center text-gray-500 shadow-sm">Henüz başvuru yok.</div>;
  }

  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="px-4 py-3">Ad Soyad</th>
            <th className="px-4 py-3">Telefon</th>
            <th className="px-4 py-3">E-posta</th>
            <th className="px-4 py-3">Meslek</th>
            <th className="px-4 py-3">Yaş</th>
            <th className="px-4 py-3">İlçe</th>
            <th className="px-4 py-3">Tarih</th>
            <th className="px-4 py-3">Durum</th>
            <th className="px-4 py-3">İşlem</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.id} className="border-b border-gray-100">
              <td className="px-4 py-3 font-medium">{m.adSoyad}</td>
              <td className="px-4 py-3">{m.telefon}</td>
              <td className="px-4 py-3">{m.eposta}</td>
              <td className="px-4 py-3">{m.meslek}</td>
              <td className="px-4 py-3">{m.yas}</td>
              <td className="px-4 py-3">{m.ilce}</td>
              <td className="px-4 py-3 text-gray-500">{formatDate(m.createdAt)}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusColors[m.status]}`}>
                  {statusLabels[m.status]}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <select
                    value={m.status}
                    onChange={(e) =>
                      onAction("updateMemberStatus", {
                        memberId: m.id,
                        status: e.target.value,
                      })
                    }
                    className="rounded border px-2 py-1 text-xs"
                  >
                    <option value="beklemede">Beklemede</option>
                    <option value="onaylandi">Onaylandı</option>
                    <option value="reddedildi">Reddedildi</option>
                  </select>
                  <button
                    type="button"
                    className="text-xs text-red-500"
                    onClick={() => {
                      if (confirm("Bu başvuruyu silmek istediğinize emin misiniz?")) {
                        onAction("deleteMember", { memberId: m.id }, "Başvuru silindi.");
                      }
                    }}
                  >
                    Sil
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AboutManager({ data, onAction }: { data: SiteData; onAction: ActionFn }) {
  const [about, setAbout] = useState(data.about);
  const [newActivity, setNewActivity] = useState("");

  return (
    <div className="max-w-2xl space-y-4 rounded-xl bg-white p-6 shadow-sm">
      <div>
        <label className="mb-1 block text-sm font-medium">Misyon</label>
        <textarea className={inputClass} rows={4} value={about.mission} onChange={(e) => setAbout({ ...about, mission: e.target.value })} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Vizyon</label>
        <textarea className={inputClass} rows={4} value={about.vision} onChange={(e) => setAbout({ ...about, vision: e.target.value })} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Faaliyet Alanları</label>
        <ul className="mb-2 space-y-1">
          {about.activities.map((a, i) => (
            <li key={i} className="flex items-center justify-between rounded bg-gray-50 px-3 py-2 text-sm">
              {a}
              <button
                type="button"
                className="text-xs text-red-500"
                onClick={() => setAbout({ ...about, activities: about.activities.filter((_, j) => j !== i) })}
              >
                Sil
              </button>
            </li>
          ))}
        </ul>
        <div className="flex gap-2">
          <input className={inputClass} placeholder="Yeni faaliyet alanı" value={newActivity} onChange={(e) => setNewActivity(e.target.value)} />
          <button
            type="button"
            className="btn-primary shrink-0 text-sm"
            onClick={() => {
              if (!newActivity.trim()) return;
              setAbout({ ...about, activities: [...about.activities, newActivity.trim()] });
              setNewActivity("");
            }}
          >
            Ekle
          </button>
        </div>
      </div>
      <button
        type="button"
        className="btn-primary"
        onClick={() => onAction("updateAbout", { about }, "Hakkımızda içeriği güncellendi.")}
      >
        Kaydet
      </button>
    </div>
  );
}

function SettingsManager({ data, onAction }: { data: SiteData; onAction: ActionFn }) {
  const [settings, setSettings] = useState(data.settings);

  return (
    <div className="max-w-2xl space-y-4 rounded-xl bg-white p-6 shadow-sm">
      <h3 className="font-bold text-brand-red">Canlı Duyuru Bandı</h3>
      <input className={inputClass} value={settings.liveAnnouncement} onChange={(e) => setSettings({ ...settings, liveAnnouncement: e.target.value })} />

      <h3 className="pt-4 font-bold text-brand-red">Ana Sayfa Hero</h3>
      <input className={inputClass} placeholder="Alt başlık" value={settings.heroSubtitle} onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })} />
      <textarea className={inputClass} rows={2} placeholder="Açıklama" value={settings.heroDescription} onChange={(e) => setSettings({ ...settings, heroDescription: e.target.value })} />

      <h3 className="pt-4 font-bold text-brand-red">İletişim Bilgileri</h3>
      <input className={inputClass} placeholder="E-posta" value={settings.contactEmail} onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })} />
      <input className={inputClass} placeholder="Telefon" value={settings.contactPhone} onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })} />
      <input className={inputClass} placeholder="Adres" value={settings.contactAddress} onChange={(e) => setSettings({ ...settings, contactAddress: e.target.value })} />

      <button
        type="button"
        className="btn-primary"
        onClick={() => onAction("updateSettings", { settings }, "Ayarlar kaydedildi.")}
      >
        Kaydet
      </button>
    </div>
  );
}

function ContentSection({
  title,
  children,
  onAdd,
  addLabel = "Ekle",
}: {
  title: string;
  children: React.ReactNode;
  onAdd: () => void;
  addLabel?: string;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <button type="button" onClick={onAdd} className="btn-primary text-sm">
          {addLabel}
        </button>
      </div>
      <div className="rounded-xl bg-white p-4 shadow-sm">{children}</div>
    </div>
  );
}

function ItemList<T extends { id: string }>({
  items,
  render,
  onEdit,
  onDelete,
  editing,
  onSaveEdit,
  onCancelEdit,
  editForm,
}: {
  items: T[];
  render: (item: T) => React.ReactNode;
  onEdit: (item: T) => void;
  onDelete: (id: string) => void;
  editing: string | null;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  editForm: React.ReactNode | null;
}) {
  return (
    <div className="mt-4 space-y-3">
      {items.map((item) => (
        <div key={item.id} className="rounded-lg border border-gray-100 p-4">
          {editing === item.id && editForm ? (
            <div className="space-y-3">
              {editForm}
              <div className="flex gap-2">
                <button type="button" className="btn-primary text-xs" onClick={onSaveEdit}>Kaydet</button>
                <button type="button" className="text-xs text-gray-500" onClick={onCancelEdit}>İptal</button>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">{render(item)}</div>
              <div className="flex shrink-0 gap-2">
                <button type="button" className="text-xs text-brand-red" onClick={() => onEdit(item)}>Düzenle</button>
                <button
                  type="button"
                  className="text-xs text-red-500"
                  onClick={() => { if (confirm("Silmek istediğinize emin misiniz?")) onDelete(item.id); }}
                >
                  Sil
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
