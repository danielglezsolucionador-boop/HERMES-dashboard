"use client";
import { useState, useEffect, useCallback } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface RuntimeData {
  status: string;
  uptime: string;
  tasks: {
    total: number;
    done: number;
    failed: number;
    running: number;
    pending: number;
  };
  ai: {
    provider: string;
    model: string;
    requests: number;
  };
  pipeline_avg_ms: number;
  provider_avg_ms: number;
  db_context_avg_ms: number;
}

export interface Task {
  id: string;
  title: string;
  status: string;
  phase: string | null;
  retry_count: number;
  error: string | null;
  created_at: string;
}

export function useRuntime(intervalMs = 5000) {
  const [runtime, setRuntime] = useState<RuntimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetch_runtime = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/runtime/status`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRuntime(data);
      setError(null);
      setLastUpdated(new Date());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch_runtime();
    const interval = setInterval(fetch_runtime, intervalMs);
    return () => clearInterval(interval);
  }, [fetch_runtime, intervalMs]);

  return { runtime, loading, error, lastUpdated, refresh: fetch_runtime };
}

export function useTasks(intervalMs = 10000) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch_tasks = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/tasks?limit=20`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch {
      // silencioso
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch_tasks();
    const interval = setInterval(fetch_tasks, intervalMs);
    return () => clearInterval(interval);
  }, [fetch_tasks, intervalMs]);

  return { tasks, loading, refresh: fetch_tasks };
}