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
import { getCurrentSession, getStats } from "./api";

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
 console.log(currentSessionData)

  const calculateRemainingTime = () => {
    if (currentSessionData?.endTime) {
      const endTime = new Date(currentSessionData.endTime);
      const currentTime = new Date();
      const difference = endTime.getTime() - currentTime.getTime();
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      return `${minutes}m ${seconds}s`;
    }
    return "-";
  };

  return (
    <MenuBarExtra icon="hackclub.png">
      <MenuBarExtra.Item
        icon={Icon.Alarm}
        title={"Remaining Time"}
        subtitle={calculateRemainingTime()}
        onAction={() => {}}
      />
      <MenuBarExtra.Section title="Current Session">
        <MenuBarExtra.Item
          icon={Icon.BulletPoints}
          title={"Work"}
          subtitle={currentSessionData?.work ? currentSessionData.work.slice(0, 10) + "..." : "-"}
          tooltip={currentSessionData?.work ? currentSessionData.work : undefined}
          onAction={() => {}}
        />
        <MenuBarExtra.Item
          icon={Icon.Clock}
          title={"Session Length"}
          subtitle={currentSessionData?.remaining ? currentSessionData.remaining.toString() + "m" : "-"}
          onAction={() => {}}
        />
        <MenuBarExtra.Item
          icon={Icon.Bolt}
          title={"Goal"}
          subtitle={currentSessionData?.goal ? currentSessionData.goal : "-"}
          onAction={() => {}}
        />
        <MenuBarExtra.Item
          icon={
            currentSessionData?.paused
              ? currentSessionData?.paused == true
                ? Icon.LightBulbOff
                : Icon.LightBulb
              : Icon.LightBulb
          }
          title={"Status"}
          subtitle={currentSessionData?.paused !== undefined ? (currentSessionData.paused ? "Paused" : "Running") : "-"}
          onAction={() => {}}
        />
      </MenuBarExtra.Section>
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

  // if (menuTitle !== "Loading...") {
  //   if (running) {
  //     return (
  //       <MenuBarExtra icon="hackclub.png" /*title={remaining.toString()}*/>
  //         <MenuBarExtra.Section title={menuTitle} />
  //         <MenuBarExtra.Item
  //           title="Pause/Resume Session"
  //           onAction={() => launchCommand({ name: "pause-session", type: LaunchType.UserInitiated })}
  //         />
  //         <MenuBarExtra.Item
  //           title="End Session"
  //           onAction={() => launchCommand({ name: "end-session", type: LaunchType.UserInitiated })}
  //         />
  //         <MenuBarExtra.Item title="Start Session" />
  //         <MenuBarExtra.Submenu title="Stats">
  //           <MenuBarExtra.Item title={`${sessions} Sessions`} />
  //           <MenuBarExtra.Item title={`${totalMinutes} Total Minutes`} />
  //           <MenuBarExtra.Item
  //             title="View History"
  //             onAction={() => launchCommand({ name: "session-history", type: LaunchType.UserInitiated })}
  //           />
  //         </MenuBarExtra.Submenu>
  //       </MenuBarExtra>
  //     );
  //   } else {
  //     return (
  //       <MenuBarExtra icon="hackclub.png">
  //         <MenuBarExtra.Section title={menuTitle} />
  //         <MenuBarExtra.Item
  //           title="Start Session"
  //           onAction={() => launchCommand({ name: "start-session", type: LaunchType.UserInitiated })}
  //         />
  //         <MenuBarExtra.Item title="Pause/Resume Session" />
  //         <MenuBarExtra.Item title="End Session" />
  //         <MenuBarExtra.Submenu title="Stats">
  //           <MenuBarExtra.Item title={`${sessions} Sessions`} />
  //           <MenuBarExtra.Item title={`${totalMinutes} Total Minutes`} />
  //           <MenuBarExtra.Item
  //             title="View History"
  //             onAction={() => launchCommand({ name: "session-history", type: LaunchType.UserInitiated })}
  //           />
  //         </MenuBarExtra.Submenu>
  //       </MenuBarExtra>
  //     );
  //   }
  // } else {
  //   return (
  //     <MenuBarExtra icon="hackclub.png">
  //       <MenuBarExtra.Section title={menuTitle} />
  //       <MenuBarExtra.Item title="Start Session" />
  //       <MenuBarExtra.Item title="Pause/Resume Session" />
  //       <MenuBarExtra.Item title="End Session" />
  //       <MenuBarExtra.Submenu title="Stats">
  //         <MenuBarExtra.Item title={`${sessions} Sessions`} />
  //         <MenuBarExtra.Item title={`${totalMinutes} Total Minutes`} />
  //         <MenuBarExtra.Item title="View History" />
  //       </MenuBarExtra.Submenu>
  //     </MenuBarExtra>
  //   );
  // }
}
