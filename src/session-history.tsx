import { Icon, List } from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";
import fetch from "node-fetch";
import { getSessionHistory, HistorySession } from "./api";

export default function SessionHistory() {
  const { isLoading, data } = useCachedPromise(getSessionHistory);

  return (
    <List filtering={false} isLoading={isLoading} searchBarPlaceholder="">
      {data?.map((session: HistorySession) => {
        return (
          <List.Item
            key={session.createdAt.toString()}
            title={session.work.length > 75 ? `${session.work.substring(0, 75)}...` : session.work}
            accessories={[
              { text: session.goal, tooltip: "Session goal" },
              ...(session.ended
                ? [
                    {
                      tag: { value: session.elapsed.toString() + "m" },
                      tooltip: `Session length`,
                    },
                  ]
                : [{ icon: Icon.Clock, tooltip: "Ongoing Session" }]),
              { date: new Date(session.createdAt), tooltip: "Session starting time" },
            ]}
          />
        );
      })}
    </List>
  );
}
