import { getPreferenceValues, Icon, List } from "@raycast/api";
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
  const { isLoading, data } = useCachedPromise(
    async () => {
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
        const sortedData: Session[] = data?.data.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        return sortedData;
      } catch (error) {
        console.error("An error occurred", error);
      }
    },
    [],
    { keepPreviousData: true }
  );

  return (
    <List filtering={false} isLoading={isLoading} searchBarPlaceholder="">
      {data?.map((session: Session) => {
        return (
          <List.Item
            key={session.createdAt.toString()}
            title={session.work.length > 75 ? `${session.work.substring(0, 75)}...` : session.work}
            accessories={[
              { text: session.goal, tooltip: "Session goal"},
              ...(session.ended
                ? [
                    {
                      tag: { value: session.elapsed.toString() + "m" },
                      tooltip: `Session length`,
                    },
                  ]
                : [{ icon: Icon.Clock, tooltip: "Ongoing Session"}]),
              { date: new Date(session.createdAt), tooltip: "Session starting time"},
            ]}
          />
        );
      })}
    </List>
  );
}
