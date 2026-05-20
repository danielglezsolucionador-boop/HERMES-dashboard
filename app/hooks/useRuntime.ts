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
    doing: number;
    running_legacy?: number;
    pending: number;
  };
  ai: {
    provider?: string;
    model?: string;
    requests?: number;
    ai_requests_total?: number;
    last_provider?: string | null;
    last_model?: string | null;
    last_ai_provider?: string | null;
    last_ai_model?: string | null;
  };
  runner?: {
    runner_status: string;
    runner_alive: boolean;
    last_loop_at: string | null;
    last_ai_provider?: string | null;
    last_ai_model?: string | null;
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

export type TaskView = "processed" | "backlog" | "failed" | null;

const TASK_VIEW_STATUSES: Record<Exclude<TaskView, null>, string[]> = {
  processed: ["done", "failed"],
  backlog: ["doing", "pending"],
  failed: ["failed"],
};

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
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error consultando runtime");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => void fetch_runtime(), 0);
    const interval = setInterval(fetch_runtime, intervalMs);
    return () => {
      window.clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [fetch_runtime, intervalMs]);

  return { runtime, loading, error, lastUpdated, refresh: fetch_runtime };
}

export function useTasks(view: TaskView = null, intervalMs = 10000) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch_tasks = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const statuses = view ? TASK_VIEW_STATUSES[view] : [null];
      const lists = await Promise.all(statuses.map(async (status) => {
        const params = new URLSearchParams({ limit: "100" });
        if (status) params.set("status", status);
        const res = await fetch(`${API_URL}/tasks?${params.toString()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        return Array.isArray(data) ? data : data.tasks || [];
      }));
      const seen = new Set<string>();
      const merged = lists.flat().filter((task: Task) => {
        if (seen.has(task.id)) return false;
        seen.add(task.id);
        return true;
      }).sort((a: Task, b: Task) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      setTasks(merged);
    } catch {
      // silencioso
    } finally {
      setLoading(false);
    }
  }, [view]);

  useEffect(() => {
    const timeout = window.setTimeout(() => void fetch_tasks(true), 0);
    const interval = setInterval(() => void fetch_tasks(false), intervalMs);
    return () => {
      window.clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [fetch_tasks, intervalMs]);

  return { tasks, loading, refresh: fetch_tasks };
}
