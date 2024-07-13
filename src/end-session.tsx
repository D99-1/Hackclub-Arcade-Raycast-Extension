import { getPreferenceValues, showHUD, Alert, confirmAlert } from "@raycast/api";
import fetch from "node-fetch";

export default async function endSession() {
  const options: Alert.Options = {
    title: "End Session?",
    message: "Are you sure you want to end the current session?",
    primaryAction: {
      title: "End Session",
      style: Alert.ActionStyle.Destructive,
      onAction: async () => {
        endSession();
      },
    },
    dismissAction: {
      title: "Cancel",
    },
  };
  await confirmAlert(options);
}
