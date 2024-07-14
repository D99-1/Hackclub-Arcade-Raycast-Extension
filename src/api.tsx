import { getPreferenceValues, PopToRootType, showHUD } from "@raycast/api";
import { showFailureToast } from "@raycast/utils";
import { WebClient } from "@slack/web-api";
import fetch from "node-fetch";

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
  work: string;
  messageTs: string;
}

interface StatsApiResponse {
  ok: boolean;
  data: Stats;
}

export interface Stats {
  sessions: number;
  total: number;
}

interface GoalsApiResponse {
  ok: boolean;
  data: Goal[];
}

export interface Goal {
  name: string;
  minutes: number;
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

export async function getGoals() {
  try {
    const response = await fetch(`https://hackhour.hackclub.com/api/goals/${getPreferenceValues().userid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getPreferenceValues().apiToken}`,
      },
    });

    if (!response.ok) {
      showFailureToast(response.statusText, { title: "Failed to fetch goals" });
    }

    const data = (await response.json()) as GoalsApiResponse;
    const goals: Goal[] = data.data;

    return goals;
  } catch (error) {
    console.error("An error occurred", error);
  }
}

export async function startSession(work: string) {
  try {
    const response = await fetch(`https://hackhour.hackclub.com/api/start/${getPreferenceValues().userid}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getPreferenceValues().apiToken}`,
      },
      body: JSON.stringify({ work: work }),
    });

    if (!response.ok) {
      await showFailureToast(response.statusText, { title: "Failed to start session" });
    }

    await showHUD("Session started successfully!", { popToRootType: PopToRootType.Default });
  } catch (error) {
    console.error("An error occurred", error);
  }
}

export async function endSession() {
  try {
    const response = await fetch(`https://hackhour.hackclub.com/api/cancel/${getPreferenceValues().userid}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getPreferenceValues().apiToken}`,
      },
    });

    if (!response.ok) {
      await showFailureToast(response.statusText, { title: "Failed to end session" });
    }

    await showHUD("Session ended successfully!");
  } catch (error) {
    console.error("An error occurred", error);
  }
}

interface PauseApiResponse {
  ok: boolean;
  data: {
    id: string;
    slackId: string;
    createdAt: string;
    paused: true;
  };
}

export async function pauseSession() {
  try {
    const response = await fetch(`https://hackhour.hackclub.com/api/pause/${getPreferenceValues().userid}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getPreferenceValues().apiToken}`,
      },
    });

    if (!response.ok) {
      await showFailureToast(response.statusText, { title: "Failed to pause session" });
    }
    const data = (await response.json()) as PauseApiResponse;

    await showHUD(data?.data.paused ? "Session Paused Successfully!" : "Session Resumed Successfully!");
  } catch (error) {
    console.error("An error occurred", error);
  }
}

let webClient: WebClient;
export function useSlack() {
  const slackApiToken = getPreferenceValues().slackApiToken;
  if (!slackApiToken) {
    return;
  }

  webClient = webClient ?? new WebClient(slackApiToken);
  return webClient
}
