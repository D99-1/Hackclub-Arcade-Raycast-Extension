import { Action, Form, ActionPanel, getPreferenceValues, showHUD, PopToRootType } from "@raycast/api";
import fetch from "node-fetch";
import { FormValidation, showFailureToast, useCachedPromise, useForm } from "@raycast/utils";
import { getCurrentSession, useSlack } from "./api";

interface FormValues {
  text: string;
  file: string[] | undefined;
}

export default function SendScrapInSlack() {
  const { data: currentSessionData } = useCachedPromise(getCurrentSession);
  const { handleSubmit, itemProps } = useForm<FormValues>({
    onSubmit: async (values) => {
      try {
        const slack = useSlack();
        if (!slack) {
          showFailureToast("Slack API Token is not configured", { title: "Failed to send scrap" });
          return;
        }

        const messageTs = currentSessionData?.messageTs;
        if (!messageTs) {
          showFailureToast("Could not fetch slack thread id", { title: "Failed to send scrap" });
          return;
        }

        const response = await slack?.chat.postMessage({
          text: values.text,
          channel: "C06SBHMQU8G",
          thread_ts: messageTs,
        });
        if (!response.ok) {
          await showFailureToast(response.error, { title: "Failed to pause session" });
        }

        await showHUD("Scrap sent successfully!", { popToRootType: PopToRootType.Immediate });
      } catch (error) {
        console.error("An error occurred", error);
      }
    },
    validation: {
      text: FormValidation.Required,
    },
  });

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Send Scrap" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField
        title="Text"
        info="The text content of the slack message"
        placeholder="I am working on..."
        autoFocus={true}
        {...itemProps.text}
      />
      <Form.Separator />
      <Form.FilePicker title="Files" info="The files you want to send in slack" {...itemProps.file} />
    </Form>
  );
}
