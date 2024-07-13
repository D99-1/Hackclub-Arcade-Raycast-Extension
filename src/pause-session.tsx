import { getPreferenceValues, showHUD } from "@raycast/api";
import fetch from "node-fetch";
import { pauseSession } from "./api";

export default async function PauseSession() {
  pauseSession();
}
