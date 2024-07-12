import { getPreferenceValues, List } from "@raycast/api";
import { showFailureToast, useCachedPromise } from "@raycast/utils";
import fetch from "node-fetch";

interface SessionHistoryResponse {
  ok: boolean;
  data: Session[];
}

interface Session {
  createdAt: string;
  time: number;
  elapsed: number;
  goal: string;
  ended: boolean;
  work: string;
}

export default function SessionHistory() {
  const { isLoading, data } = useCachedPromise(async () => {
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

      const data = (await response.json()) as SessionHistoryResponse;
      return data.data;
    } catch (error) {
      console.error("An error occurred", error);
    }
  });

  return (
    <List filtering={false} isLoading={isLoading}>
      {data?.map((session: Session) => {
        return <List.Item key={session.createdAt.toString()} title={session.work} />;
      })}
    </List>
  );
}
