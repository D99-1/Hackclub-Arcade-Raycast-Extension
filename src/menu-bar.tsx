import { useState, useEffect } from "react";
import {
  MenuBarExtra,
  showToast,
  Toast,
  getPreferenceValues,
  launchCommand,
  LaunchType /* Cache */,
  Icon,
  openCommandPreferences,
} from "@raycast/api";
import fetch from "node-fetch";
import { useCachedPromise } from "@raycast/utils";
import { CurrentSession, getCurrentSession, getStats } from "./api";

export default function Command() {
  const { data: currentSessionData } = useCachedPromise(getCurrentSession);
  const { data: statsData } = useCachedPromise(getStats);

  /*const [remaining, setRemaining] = useState(0);
  const cache = new Cache();*/

  /*
  const getRemaining = cache.get("remaining")
  console.log(getRemaining)
  setRemaining(Number(getRemaining)-1)
  cache.set("remaining",(Number(getRemaining)-1).toString())
  */

  return (
    <MenuBarExtra icon="hackclub.png">
      <TopMenuBarItem currentSession={currentSessionData} />
      <SessionInfoItems currentSession={currentSessionData} />

      <MenuBarExtra.Section>
        <MenuBarExtra.Item
          icon={Icon.StarCircle}
          title={"Start Session"}
          onAction={
            currentSessionData?.completed == true
              ? () => launchCommand({ name: "start-session", type: LaunchType.UserInitiated })
              : undefined
          }
        />
        <MenuBarExtra.Item
          icon={Icon.Play}
          title={"Pause/Resume Session"}
          onAction={
            currentSessionData?.completed == false
              ? () => launchCommand({ name: "pause-session", type: LaunchType.UserInitiated })
              : undefined
          }
        />
        <MenuBarExtra.Item
          icon={Icon.CheckCircle}
          title={"End Session"}
          onAction={
            currentSessionData?.completed == false
              ? () => launchCommand({ name: "end-session", type: LaunchType.UserInitiated })
              : undefined
          }
        />
      </MenuBarExtra.Section>
      <MenuBarExtra.Section>
        <MenuBarExtra.Item
          icon={Icon.Book}
          title={"Session History"}
          onAction={() => launchCommand({ name: "session-history", type: LaunchType.UserInitiated })}
        />
        <MenuBarExtra.Submenu icon={Icon.BarChart} title="Stats">
          <MenuBarExtra.Item
            icon={Icon.Hashtag}
            title={"Sessions"}
            subtitle={statsData?.sessions ? statsData.sessions.toString() : "-"}
            onAction={() => {}}
          />
          <MenuBarExtra.Item
            icon={Icon.Clock}
            title={"Total Minutes"}
            subtitle={statsData?.total ? statsData.total.toString() : "-"}
            onAction={() => {}}
          />
        </MenuBarExtra.Submenu>
      </MenuBarExtra.Section>
      <MenuBarExtra.Section>
        <MenuBarExtra.Item icon={Icon.Gear} title={"Settings"} onAction={() => openCommandPreferences()} />
      </MenuBarExtra.Section>
    </MenuBarExtra>
  );
}

function TopMenuBarItem({ currentSession }: { currentSession: CurrentSession | undefined }) {
  if (currentSession === undefined) {
    return <MenuBarExtra.Item icon={Icon.Alarm} title={"Remaining Time"} subtitle={"-"} onAction={() => {}} />;
  }

  if (currentSession.completed) {
    return (
      <MenuBarExtra.Item
        icon={Icon.Compass}
        title={"Remaining Time"}
        subtitle={"No session active"}
        onAction={() => {}}
      />
    );
  } else {
    return (
      <MenuBarExtra.Item
        icon={Icon.Alarm}
        title={"Remaining Time"}
        subtitle={(() => {
          const endTime = new Date(currentSession.endTime);
          const currentTime = new Date();
          const difference = endTime.getTime() - currentTime.getTime();
          const minutes = Math.floor((difference / (1000 * 60)) % 60);
          const seconds = Math.floor((difference / 1000) % 60);
          return `${minutes}m ${seconds}s`;
        })()}
        onAction={() => {}}
      />
    );
  }
}

function SessionInfoItems({ currentSession }: { currentSession: CurrentSession | undefined }) {
  function ConditionalRender(data: keyof CurrentSession, value: string | undefined) {
    if (currentSession?.[data] == undefined) {
      return "-";
    }

    return value;
  }

  return (
    <MenuBarExtra.Section title="Current Session">
      <MenuBarExtra.Item
        icon={Icon.BulletPoints}
        title={"Work"}
        subtitle={ConditionalRender("work", currentSession?.work.slice(0, 10) + "...")}
        tooltip={currentSession?.work ? currentSession.work : undefined}
        onAction={() => {}}
      />
      <MenuBarExtra.Item
        icon={Icon.Clock}
        title={"Session Length"}
        subtitle={ConditionalRender("remaining", currentSession?.remaining.toString() + "m")}
        onAction={() => {}}
      />
      <MenuBarExtra.Item
        icon={Icon.Bolt}
        title={"Goal"}
        subtitle={ConditionalRender("goal", currentSession?.goal)}
        onAction={() => {}}
      />
      <MenuBarExtra.Item
        icon={
          currentSession?.paused
            ? currentSession?.paused == true
              ? Icon.LightBulbOff
              : Icon.LightBulb
            : Icon.LightBulb
        }
        title={"Status"}
        subtitle={ConditionalRender("paused", currentSession?.paused ? "Paused" : "Running")}
        onAction={() => {}}
      />
    </MenuBarExtra.Section>
  );
}
