"use client";

import { io, Socket } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import { API_URL } from "./api";
import { useAuth } from "./auth-context";
import type { AppNotification } from "./types";

// The backend serves both REST (/api/*) and Socket.IO on the same port —
// strip the trailing /api to get the bare origin Socket.IO connects to.
const SOCKET_URL = API_URL.replace(/\/api\/?$/, "");

let socketSingleton: Socket | null = null;

export function getSocket(): Socket {
  if (!socketSingleton) {
    socketSingleton = io(SOCKET_URL, {
      withCredentials: true,
      autoConnect: true,
      transports: ["websocket", "polling"],
    });
  }
  return socketSingleton;
}

/**
 * Joins the current user's private room on connect so the server can push
 * targeted events (new match, notification, chat message) with
 * `io.to(userId).emit(...)`. Call once near the root of the authenticated
 * app (DashboardShell does this).
 */
export function useUserSocket() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const socket = getSocket();
    const join = () => socket.emit("user:join", user.id);
    if (socket.connected) join();
    socket.on("connect", join);
    return () => {
      socket.off("connect", join);
    };
  }, [user]);
}

/**
 * Live toast-style feed of incoming notifications pushed over Socket.IO
 * (in addition to the persisted list fetched from /notifications).
 */
export function useLiveNotifications() {
  const { user } = useAuth();
  const [latest, setLatest] = useState<AppNotification | null>(null);
  const seen = useRef(new Set<string>());

  useEffect(() => {
    if (!user) return;
    const socket = getSocket();

    function onNotification(n: AppNotification) {
      if (seen.current.has(n._id)) return;
      seen.current.add(n._id);
      setLatest(n);
    }

    socket.on("notification:new", onNotification);
    return () => {
      socket.off("notification:new", onNotification);
    };
  }, [user]);

  return latest;
}
