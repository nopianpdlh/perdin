// ============================================================
// STORAGE — localStorage abstraction layer
// ============================================================
import { User, Kota, Perdin, AuthSession } from "./types";
import { SEED_USERS, SEED_KOTA } from "./seed";

const KEYS = {
  USERS: "perdin_users",
  KOTA: "perdin_kota",
  PERDIN: "perdin_list",
  SESSION: "perdin_session",
};

function isClient() {
  return typeof window !== "undefined";
}

function getItem<T>(key: string): T | null {
  if (!isClient()) return null;
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function setItem<T>(key: string, value: T): void {
  if (!isClient()) return;
  localStorage.setItem(key, JSON.stringify(value));
}

// ── Initialization ──────────────────────────────────────────
export function initStorage(): void {
  if (!isClient()) return;
  if (!localStorage.getItem(KEYS.USERS)) {
    setItem(KEYS.USERS, SEED_USERS);
  }
  if (!localStorage.getItem(KEYS.KOTA)) {
    setItem(KEYS.KOTA, SEED_KOTA);
  }
  if (!localStorage.getItem(KEYS.PERDIN)) {
    setItem(KEYS.PERDIN, []);
  }
}

// ── Session ─────────────────────────────────────────────────
export function getSession(): AuthSession | null {
  return getItem<AuthSession>(KEYS.SESSION);
}

export function setSession(session: AuthSession): void {
  setItem(KEYS.SESSION, session);
}

export function clearSession(): void {
  if (!isClient()) return;
  localStorage.removeItem(KEYS.SESSION);
}

// ── Users ────────────────────────────────────────────────────
export function getUsers(): User[] {
  return getItem<User[]>(KEYS.USERS) ?? [];
}

export function saveUsers(users: User[]): void {
  setItem(KEYS.USERS, users);
}

export function getUserById(id: string): User | undefined {
  return getUsers().find((u) => u.id === id);
}

// ── Kota ─────────────────────────────────────────────────────
export function getKota(): Kota[] {
  return getItem<Kota[]>(KEYS.KOTA) ?? [];
}

export function saveKota(kota: Kota[]): void {
  setItem(KEYS.KOTA, kota);
}

export function getKotaById(id: string): Kota | undefined {
  return getKota().find((k) => k.id === id);
}

// ── Perdin ───────────────────────────────────────────────────
export function getPerdinList(): Perdin[] {
  return getItem<Perdin[]>(KEYS.PERDIN) ?? [];
}

export function savePerdinList(list: Perdin[]): void {
  setItem(KEYS.PERDIN, list);
}

export function getPerdinById(id: string): Perdin | undefined {
  return getPerdinList().find((p) => p.id === id);
}
