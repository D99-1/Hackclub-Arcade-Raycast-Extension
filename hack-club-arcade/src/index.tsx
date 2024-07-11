import { useState, useEffect } from "react";
import { MenuBarExtra, showToast, Toast, getPreferenceValues } from "@raycast/api";
import fetch from "node-fetch";

export default function Command() {
  const [menuTitle, setMenuTitle] = useState("Loading..."); // Initial title set to "Loading..."

  const getTime = async () => {
    console.log("Starting session...");
      await fetch(`https://hackhour.hackclub.com/api/session/${getPreferenceValues().userid}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${getPreferenceValues().apiToken}`,
        },
      }).then((response) => {
        console.log(response);
        return response.json();
      }).then((data) => {
        console.log(data.data.remaining);
        setMenuTitle((data.data.remaining > 0) ? `${data.data.remaining} Minutes Remaining`:"No Active Session");
      }).catch((error) => {
        console.error("Error:", error);
        showToast(Toast.Style.Failure, "Error", "Failed to fetch session data");
      })
  };

  useEffect(() => {
    getTime();
  }, []);

  return (
    <MenuBarExtra title={menuTitle} icon="./assets/Inverted Colors.png">
      <MenuBarExtra.Item title="Start Session" onAction={getTime} />  
    </MenuBarExtra>
  );
}
