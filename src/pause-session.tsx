import { getPreferenceValues, showHUD } from "@raycast/api";
import fetch from "node-fetch";

export default async function pauseSession() {
  try {
    const response = await fetch(`https://hackhour.hackclub.com/api/pause/${getPreferenceValues().userid}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getPreferenceValues().apiToken}`,
      },
    }).then((response)=>{
      return response.json()
    }).then((response:any)=>{
      showHUD(response.data.paused ? "Session Paused Successfully!" : "Session Resumed Successfully!")
      console.log(response.data.paused)
    })

 
  } catch (error) {
    console.error("An error occurred", error);
  }
}
