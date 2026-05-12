// ============================================================
// HOOKS — Custom React hooks untuk state management
// ============================================================
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getSession,
  setSession,
  clearSession,
  getUsers,
  saveUsers,
  getKota,
  saveKota,
  getPerdinList,
  savePerdinList,
  initStorage,
} from "./storage";
import { AuthSession, User, Kota, Perdin } from "./types";

// ── Auth ─────────────────────────────────────────────────────
export function useAuth() {
  const [session, setSessionState] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initStorage();
    setSessionState(getSession());
    setLoading(false);
  }, []);

  const login = useCallback(
    (username: string, password: string): boolean => {
      const users = getUsers();
      const user = users.find(
        (u) => u.username === username && u.password === password
      );
      if (!user) return false;
      const s: AuthSession = {
        userId: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      };
      setSession(s);
      setSessionState(s);
      return true;
    },
    []
  );

  const logout = useCallback(() => {
    clearSession();
    setSessionState(null);
  }, []);

  return { session, loading, login, logout };
}

// ── Users ─────────────────────────────────────────────────────
export function useUsers() {
  const [users, setUsersState] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUsersState(getUsers());
    setLoading(false);
  }, []);

  const addUser = useCallback((user: User) => {
    const updated = [...getUsers(), user];
    saveUsers(updated);
    setUsersState(updated);
  }, []);

  const updateUser = useCallback((updated: User) => {
    const list = getUsers().map((u) => (u.id === updated.id ? updated : u));
    saveUsers(list);
    setUsersState(list);
  }, []);

  const deleteUser = useCallback((id: string) => {
    const list = getUsers().filter((u) => u.id !== id);
    saveUsers(list);
    setUsersState(list);
  }, []);

  return { users, loading, addUser, updateUser, deleteUser };
}

// ── Kota ──────────────────────────────────────────────────────
export function useKota() {
  const [kotaList, setKotaList] = useState<Kota[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setKotaList(getKota());
    setLoading(false);
  }, []);

  const addKota = useCallback((kota: Kota) => {
    const updated = [...getKota(), kota];
    saveKota(updated);
    setKotaList(updated);
  }, []);

  const updateKota = useCallback((updated: Kota) => {
    const list = getKota().map((k) => (k.id === updated.id ? updated : k));
    saveKota(list);
    setKotaList(list);
  }, []);

  const deleteKota = useCallback((id: string) => {
    const list = getKota().filter((k) => k.id !== id);
    saveKota(list);
    setKotaList(list);
  }, []);

  return { kotaList, loading, addKota, updateKota, deleteKota };
}

// ── Perdin ────────────────────────────────────────────────────
export function usePerdin() {
  const [perdinList, setPerdinList] = useState<Perdin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPerdinList(getPerdinList());
    setLoading(false);
  }, []);

  const addPerdin = useCallback((perdin: Perdin) => {
    const updated = [...getPerdinList(), perdin];
    savePerdinList(updated);
    setPerdinList(updated);
  }, []);

  const updatePerdin = useCallback((updated: Perdin) => {
    const list = getPerdinList().map((p) =>
      p.id === updated.id ? updated : p
    );
    savePerdinList(list);
    setPerdinList(list);
  }, []);

  const deletePerdin = useCallback((id: string) => {
    const list = getPerdinList().filter((p) => p.id !== id);
    savePerdinList(list);
    setPerdinList(list);
  }, []);

  return { perdinList, loading, addPerdin, updatePerdin, deletePerdin };
}
