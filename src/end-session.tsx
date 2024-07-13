import { getPreferenceValues, showHUD, Alert, confirmAlert } from "@raycast/api";
import fetch from "node-fetch";
import { endSession } from "./api";

export default async function EndSession() {
  const options: Alert.Options = {
    title: "End Session?",
    message: "Are you sure you want to end the current session?",
    primaryAction: {
      title: "End Session",
      style: Alert.ActionStyle.Destructive,
      onAction: async () => {
        await endSession();
      },
    },
    dismissAction: {
      title: "Cancel",
    },
  };
  await confirmAlert(options);
}
