import { useCallback, useEffect, useState } from "react";

// AuraAI is a fully client-side app (no backend yet), so authentication is
// implemented as a local, browser-persisted account system. Accounts are
// identified by a username (not email). Signing in switches aura-store.ts
// (see KEY_FOR) to that bride's private bucket instead of the shared guest one.

export type AuraUser = {
  name: string;       // Bride name
  username: string;
};

type StoredUser = AuraUser & { password: string };

const USERS_KEY = "aura.auth.users.v1";
const SESSION_KEY = "aura.auth.session.v1";

const isBrowser = typeof window !== "undefined";

function readUsers(): StoredUser[] {
  if (!isBrowser) return [];
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch {
    return [];
  }
}
function writeUsers(users: StoredUser[]) {
  if (!isBrowser) return;
  try { window.localStorage.setItem(USERS_KEY, JSON.stringify(users)); } catch { /* storage unavailable */ }
}

function readSession(): string | null {
  if (!isBrowser) return null;
  try { return window.localStorage.getItem(SESSION_KEY); } catch { return null; }
}
function writeSession(username: string | null) {
  if (!isBrowser) return;
  try {
    if (username) window.localStorage.setItem(SESSION_KEY, username);
    else window.localStorage.removeItem(SESSION_KEY);
  } catch { /* storage unavailable */ }
}

const authListeners = new Set<() => void>();
function notifyAuth() { authListeners.forEach((fn) => fn()); }

function normalizeUsername(u: string) {
  return u.trim().toLowerCase();
}

export type AuthResult = { ok: true } | { ok: false; error: string };

export function useAuth() {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    setUsername(readSession());
    const fn = () => setUsername(readSession());
    authListeners.add(fn);
    return () => { authListeners.delete(fn); };
  }, []);

  const user: AuraUser | null = (() => {
    if (!username) return null;
    const found = readUsers().find((u) => u.username === username);
    return found ? { name: found.name, username: found.username } : null;
  })();

  const signUp = useCallback((name: string, rawUsername: string, password: string): AuthResult => {
    const cleanUsername = normalizeUsername(rawUsername);
    if (!name.trim()) return { ok: false, error: "Please enter the bride's name." };
    if (cleanUsername.length < 3) return { ok: false, error: "Username must be at least 3 characters." };
    if (!/^[a-z0-9_.]+$/.test(cleanUsername)) return { ok: false, error: "Username can only contain letters, numbers, dots and underscores." };
    if (password.length < 6) return { ok: false, error: "Password must be at least 6 characters." };

    const users = readUsers();
    if (users.some((u) => u.username === cleanUsername)) {
      return { ok: false, error: "This username is already taken. Try signing in instead." };
    }
    writeUsers([...users, { name: name.trim(), username: cleanUsername, password }]);
    writeSession(cleanUsername);
    notifyAuth();
    return { ok: true };
  }, []);

  const signIn = useCallback((rawUsername: string, password: string): AuthResult => {
    const cleanUsername = normalizeUsername(rawUsername);
    const users = readUsers();
    const found = users.find((u) => u.username === cleanUsername);
    if (!found || found.password !== password) {
      return { ok: false, error: "Incorrect username or password." };
    }
    writeSession(cleanUsername);
    notifyAuth();
    return { ok: true };
  }, []);

  const signOut = useCallback(() => {
    writeSession(null);
    notifyAuth();
  }, []);

  const updateName = useCallback((newName: string): AuthResult => {
    const trimmed = newName.trim();
    if (!trimmed) return { ok: false, error: "Name cannot be empty." };
    const session = readSession();
    if (!session) return { ok: false, error: "Not signed in." };
    const users = readUsers();
    const idx = users.findIndex((u) => u.username === session);
    if (idx === -1) return { ok: false, error: "Account not found." };
    users[idx] = { ...users[idx], name: trimmed };
    writeUsers(users);
    notifyAuth();
    return { ok: true };
  }, []);

  return { user, isAuthenticated: !!user, signUp, signIn, signOut, updateName };
}

/**
 * Storage namespace for the currently signed-in user, or "guest" when signed
 * out. aura-store.ts appends this to its localStorage keys so bookings, saved
 * salons and planner progress are kept separate per account.
 */
export function currentStorageNamespace(): string {
  const username = readSession();
  return username ? `acct:${username}` : "guest";
}

export function subscribeAuthChange(fn: () => void): () => void {
  authListeners.add(fn);
  return () => { authListeners.delete(fn); };
}

/** Synchronous read of current auth state — used by route guards. */
export function isAuthenticatedNow(): boolean {
  return !!readSession();
}
