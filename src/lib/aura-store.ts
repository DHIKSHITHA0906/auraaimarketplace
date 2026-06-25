import { useEffect, useState, useCallback } from "react";
import { currentStorageNamespace, subscribeAuthChange } from "@/lib/auth-store";
import { getMakeupStyleByName } from "@/lib/makeup-styles";

// ---------- Types ----------
export type BridalProfile = {
  name: string;
  weddingDate: string; // ISO yyyy-mm-dd
  area: string;        // Chennai area
  makeupStyle: string; // one of MAKEUP_STYLES names, from lib/makeup-styles.ts
  skinType: string;
  budget: string;
  services: string[];
};

export type Booking = {
  id: string;
  salonId: string;
  salonName: string;
  salonImage?: string;
  service: string;
  date: string;
  time: string;
  area: string;
  phone?: string;
  price?: number;
  createdAt: number;
};

// Planner draft (in-progress wizard state, persisted across navigations)
export type PlannerDraft = {
  step: number;
  data: BridalProfile;
  generated: boolean; // true once user reaches the timeline view
};

const KEYS = {
  wishlist: "aura.wishlist.v2",
  bookings: "aura.bookings.v2",
  profile:  "aura.profile.v2",
  draft:    "aura.planner.draft.v1",
  tasks:    "aura.tasks.v1",
  budget:   "aura.budget.v1",
  notifs:   "aura.notifs.v1",
} as const;

const isBrowser = typeof window !== "undefined";

function read<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback;
  try {
    const v = window.localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch { return fallback; }
}
function write<T>(key: string, val: T) {
  if (!isBrowser) return;
  try { window.localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

const listeners = new Map<string, Set<() => void>>();
function notify(key: string) { listeners.get(key)?.forEach((fn) => fn()); }
function subscribe(key: string, fn: () => void): () => void {
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key)!.add(fn);
  return () => { listeners.get(key)?.delete(fn); };
}

function usePersisted<T>(key: string, initial: T) {
  const namespacedKey = () => `${key}.${currentStorageNamespace()}`;
  const [val, setVal] = useState<T>(initial);
  useEffect(() => {
    const load = () => setVal(read<T>(namespacedKey(), initial));
    load();
    const unsubKey = subscribe(namespacedKey(), load);
    // Re-read (against the new namespace) whenever the signed-in account changes.
    const unsubAuth = subscribeAuthChange(load);
    return () => { unsubKey(); unsubAuth(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const update = useCallback((next: T | ((prev: T) => T)) => {
    const k = namespacedKey();
    const prev = read<T>(k, initial);
    const value = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
    write(k, value);
    notify(k);
    setVal(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return [val, update] as const;
}

// ---------- Hooks ----------
export function useWishlist() {
  const [ids, setIds] = usePersisted<string[]>(KEYS.wishlist, []);
  return {
    ids,
    has: (id: string) => ids.includes(id),
    toggle: (id: string) => setIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id])),
    clear: () => setIds([]),
  };
}

export function useBookings() {
  const [bookings, setBookings] = usePersisted<Booking[]>(KEYS.bookings, []);
  const add = (b: Omit<Booking, "id" | "createdAt">) =>
    setBookings((p) => [...p, { ...b, id: Math.random().toString(36).slice(2, 10), createdAt: Date.now() }]);
  const remove = (id: string) => setBookings((p) => p.filter((b) => b.id !== id));
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const upcoming = [...bookings]
    .filter((b) => new Date(b.date) >= now)
    .sort((a, b) => +new Date(a.date) - +new Date(b.date));
  const past = [...bookings]
    .filter((b) => new Date(b.date) < now)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
  return { bookings, upcoming, past, add, remove };
}

export const defaultProfile: BridalProfile = {
  name: "", weddingDate: "", area: "", makeupStyle: "",
  skinType: "", budget: "",
  services: [],
};

export function useProfile() {
  const [profile, setProfile] = usePersisted<BridalProfile>(KEYS.profile, defaultProfile);
  return { profile, setProfile, hasProfile: !!profile.weddingDate };
}

// Planner draft: persists wizard step + answers so navigation never resets.
export function usePlannerDraft() {
  const [draft, setDraft] = usePersisted<PlannerDraft>(KEYS.draft, {
    step: 0, data: defaultProfile, generated: false,
  });
  const reset = () => setDraft({ step: 0, data: defaultProfile, generated: false });
  const isPartial = !draft.generated && (draft.step > 0 || !!draft.data.weddingDate);
  return { draft, setDraft, reset, isPartial };
}

// ---------- Tasks / Checklist ----------
export type Task = { key: string; label: string; done: boolean; auto?: boolean };
export const DEFAULT_TASKS: Task[] = [
  { key: "date",      label: "Wedding date finalized", done: false },
  { key: "budget",    label: "Budget planned",         done: false },
  { key: "salon",     label: "Salon selected",         done: false },
  { key: "mehendi",   label: "Mehendi arranged",       done: false },
  { key: "makeup",    label: "Makeup booked",          done: false },
  { key: "hair",      label: "Hair care completed",    done: false },
  { key: "skincare",  label: "Pre-bridal skincare done", done: false },
  { key: "ready",     label: "Wedding-ready",          done: false },
];
export function useTasks() {
  const [tasks, setTasks] = usePersisted<Task[]>(KEYS.tasks, DEFAULT_TASKS);
  const toggle = (key: string) =>
    setTasks((p) => p.map((t) => (t.key === key ? { ...t, done: !t.done } : t)));
  const setAuto = (key: string, done: boolean) =>
    setTasks((p) => p.map((t) => (t.key === key ? { ...t, done, auto: true } : t)));
  const completed = tasks.filter((t) => t.done).length;
  const percent = Math.round((completed / tasks.length) * 100);
  return { tasks, toggle, setAuto, setTasks, completed, total: tasks.length, percent };
}

// ---------- Budget ----------
export type BudgetState = { total: number };
export function useBudget() {
  const [state, setState] = usePersisted<BudgetState>(KEYS.budget, { total: 0 });
  const { bookings } = useBookings();
  const used = bookings.reduce((s, b) => s + (b.price ?? 0), 0);
  const remaining = Math.max(0, state.total - used);
  const overspend = Math.max(0, used - state.total);
  const setTotal = (total: number) => setState({ total: Math.max(0, total) });
  return { total: state.total, used, remaining, overspend, setTotal };
}

// ---------- Notifications ----------
export type Notif = { id: string; title: string; body: string; ts: number; read: boolean };
export function useNotifs() {
  const [list, setList] = usePersisted<Notif[]>(KEYS.notifs, []);
  const add = (n: Omit<Notif, "id" | "ts" | "read">) =>
    setList((p) => [{ ...n, id: Math.random().toString(36).slice(2, 9), ts: Date.now(), read: false }, ...p].slice(0, 30));
  const markAllRead = () => setList((p) => p.map((n) => ({ ...n, read: true })));
  const remove = (id: string) => setList((p) => p.filter((n) => n.id !== id));
  return { list, unread: list.filter((n) => !n.read).length, add, markAllRead, remove };
}

// ---------- Planner timeline ----------
export type Milestone = {
  key: string;
  daysBefore: number;
  title: string;
  service: string;
  body: string;
  recommendedDate: string;
};

type Template = Omit<Milestone, "recommendedDate"> & { skin?: string[] };

const TEMPLATES: Template[] = [
  { key: "skin-prep-90", daysBefore: 90, title: "Skin Preparation",     service: "Skincare",        body: "Begin monthly HydraFacials, a vitamin-C serum AM, niacinamide PM, SPF 50 daily — Chennai sun is unforgiving." },
  { key: "hair-care-60", daysBefore: 60, title: "Hair Treatment Cycle", service: "Hair styling",    body: "Deep-conditioning every 10 days, scalp ritual, final colour gloss. Lock in your bridal artist now." },
  { key: "pre-wed-45",   daysBefore: 45, title: "Pre-Wedding Treatment",service: "Pre-wedding treatments", body: "Body polishing, dermaplaning, or laser hair removal — give the skin time to settle." },
  { key: "facial-30",    daysBefore: 30, title: "Pre-Bridal Facial",    service: "Skincare",        body: "Mid-cycle brightening + hydration facial for Chennai humidity." },
  { key: "trial-14",     daysBefore: 14, title: "Bridal Trial",         service: "Bridal makeup",   body: "Full bridal trial — makeup, hair, kanjivaram drape rehearsal." },
  { key: "facial-7",     daysBefore: 7,  title: "Final Cleanup",        service: "Skincare",        body: "Gentle clean-up, threading, brow shaping. No new actives this week.", skin: ["Sensitive", "Dry + Sensitive", "Oily + Sensitive"] },
  { key: "hair-spa-7",   daysBefore: 7,  title: "Hair Spa & Gloss",     service: "Hair styling",    body: "Last hair spa for shine; oil massage 48 hours prior." },
  { key: "mehendi-2",    daysBefore: 2,  title: "Mehendi Ceremony",     service: "Mehendi",         body: "Bridal mehendi — allow 4–5h. Avoid water for 12h after for deep maroon stain." },
  { key: "wedding-0",    daysBefore: 0,  title: "Muhurtham Bridal Look",service: "Bridal makeup",   body: "Dewy base, kohl eye, deep maroon lip, jasmine in a low bun. Arrive 4h before muhurtham." },
];

export function buildTimeline(weddingDateISO: string, services: string[] = [], skin = "", makeupStyle = ""): Milestone[] {
  if (!weddingDateISO) return [];
  const wed = new Date(weddingDateISO);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const daysOut = Math.ceil((+wed - +today) / 86400000);
  if (daysOut < 0) return [];

  const wanted = services.length ? new Set(services) : null;
  const styleMatch = makeupStyle ? getMakeupStyleByName(makeupStyle) : undefined;

  return TEMPLATES
    .filter((m) => !wanted || wanted.has(m.service))
    .filter((m) => m.daysBefore <= daysOut) // compress when wedding is close
    .filter((m) => !m.skin || m.skin.includes(skin) || true) // skin-conditional kept on by default
    .map((m) => {
      const d = new Date(wed); d.setDate(d.getDate() - m.daysBefore);
      const body = m.key === "wedding-0" && styleMatch ? styleMatch.description : m.body;
      return { ...m, body, recommendedDate: d.toISOString().slice(0, 10) };
    })
    .filter((m) => new Date(m.recommendedDate) >= today)
    .sort((a, b) => b.daysBefore - a.daysBefore);
}
