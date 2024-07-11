import { useState, useEffect } from "react";
import { MenuBarExtra, showToast, Toast, getPreferenceValues } from "@raycast/api";
import fetch from "node-fetch";

export default function Command() {
  const [menuTitle, setMenuTitle] = useState("");
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const getTime = async () => {
    setMenuTitle("Loading...");
      await fetch(`https://hackhour.hackclub.com/api/session/${getPreferenceValues().userid}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${getPreferenceValues().apiToken}`,
        }
            }).then((response) => {
        console.log(response);
        return response.json();
      }).then((data) => {
        console.log(data.data.remaining);
        setMenuTitle((data.data.remaining > 0) ? data.data.remaining > 1 ? `${data.data.remaining} Minutes Remaining`:`${data.data.remaining} Minute Remaining`:"No Active Session");
        if(data.data.remaining > 0){
          setRunning(true);
        }else{
          setRunning(false);
        }
      }).catch((error) => {
        console.error("Error:", error);
        showToast(Toast.Style.Failure, "Error", "Failed to fetch session data");
      })
  }

  const getStats = async () => {
    await fetch(`https://hackhour.hackclub.com/api/stats/${getPreferenceValues().userid}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${getPreferenceValues().apiToken}`,
      }
          }).then((response) => {
      console.log(response);
      return response.json();
    }).then((data) => {
      setSessions(data.data.sessions);
      setTotalMinutes(data.data.total);
  }).catch((error) => {
    console.error("Error:", error);
    showToast(Toast.Style.Failure, "Error", "Failed to fetch session data");
  })
}

  useEffect(() => {
    getTime();
    getStats();
  }, []);

if(running){
  return (
    <MenuBarExtra icon="hackclub.png">
      <MenuBarExtra.Section title={menuTitle} />
      <MenuBarExtra.Item title="Pause/Resume Session" onAction={getTime} />  
      <MenuBarExtra.Item title="Start Session" />  
      <MenuBarExtra.Submenu title="Stats">
      <MenuBarExtra.Item title={`${sessions} Sessions`} />
      <MenuBarExtra.Item title={`${totalMinutes} Total Minutes`} />
        </MenuBarExtra.Submenu>
    </MenuBarExtra>
  );
}else{
  return (
    <MenuBarExtra icon="hackclub.png">
      <MenuBarExtra.Section title={menuTitle} />
      <MenuBarExtra.Item title="Start Session" onAction={getTime}/>  
      <MenuBarExtra.Item title="Pause/Resume Session"  />  
      <MenuBarExtra.Submenu title="Stats">
      <MenuBarExtra.Item title="Sessions" />
      <MenuBarExtra.Item title="Total Minutes" />
        </MenuBarExtra.Submenu>
      </MenuBarExtra>
  );
}
}