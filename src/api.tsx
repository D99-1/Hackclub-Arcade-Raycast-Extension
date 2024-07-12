import { getPreferenceValues } from "@raycast/api";
import { showFailureToast } from "@raycast/utils";

interface SessionHistoryApiResponse {
  ok: boolean;
  data: HistorySession[];
}

export interface HistorySession {
  createdAt: string;
  time: number;
  elapsed: number;
  goal: string;
  ended: boolean;
  work: string;
}

interface CurrentSessionApiResponse {
  ok: boolean;
  data: CurrentSession;
}

export interface CurrentSession {
  id: string;
  createdAt: string;
  time: number;
  elapsed: number;
  remaining: number;
  endTime: string;
  goal: string;
  paused: boolean;
  completed: boolean;
  messageTs: string;
}

interface StatsApiResponse {
    ok: boolean;
    data: Stats;
}

export interface Stats {
  sessions: 0;
  total: 0;
}

export async function getSessionHistory() {
  try {
    const response = await fetch(`https://hackhour.hackclub.com/api/history/${getPreferenceValues().userid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getPreferenceValues().apiToken}`,
      },
    });

    if (!response.ok) {
      showFailureToast(response.statusText, { title: "Failed to fetch session history" });
    }

    const data = (await response.json()) as SessionHistoryApiResponse;
    const sortedData: HistorySession[] = data?.data.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return sortedData;
  } catch (error) {
    console.error("An error occurred", error);
  }
}

export async function getCurrentSession() {
  try {
    const response = await fetch(`https://hackhour.hackclub.com/api/session/${getPreferenceValues().userid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getPreferenceValues().apiToken}`,
      },
    });

    if (!response.ok) {
      showFailureToast(response.statusText, { title: "Failed to fetch current session information" });
    }

    const data = (await response.json()) as CurrentSessionApiResponse;
    const currentSession: CurrentSession = data.data;

    return currentSession;
  } catch (error) {
    console.error("An error occurred", error);
  }
}

export async function getStats() {
  try {
    const response = await fetch(`https://hackhour.hackclub.com/api/stats/${getPreferenceValues().userid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getPreferenceValues().apiToken}`,
      },
    });

    if (!response.ok) {
      showFailureToast(response.statusText, { title: "Failed to fetch stats" });
    }

    const data = (await response.json()) as StatsApiResponse;
    const currentSession: Stats = data.data;

    return currentSession;
  } catch (error) {
    console.error("An error occurred", error);
  }
}
