import fetch from "node-fetch";
import { pauseSession } from "./api";

export default async function PauseSession() {
  pauseSession();
}
