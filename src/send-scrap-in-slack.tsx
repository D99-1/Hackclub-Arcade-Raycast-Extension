import { Action, Form, ActionPanel, getPreferenceValues, showHUD, PopToRootType, Toast, showToast } from "@raycast/api";
import fetch from "node-fetch";
import path from "path";
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

        const filesUrls: string[] = [];
        if (values.file !== undefined && values.file.length > 0) {
          const toast = await showToast({
            style: Toast.Style.Animated,
            title: "Uploading files",
          });
          for (const file of values.file) {
            const filename = path.basename(file);
            const response = await slack?.files.uploadV2({
              file: file,
              filename: filename,
            });

            if (!response.ok) {
              await showFailureToast(response.error, { title: "Failed to upload file" });
            }

            filesUrls.push(response["files"][0]["files"][0]["permalink"]);
          }
          console.log(JSON.stringify(filesUrls));
          toast.style = Toast.Style.Success;
          toast.message = "Uploaded files";
        }

        const attachments =
          filesUrls.length > 0
            ? filesUrls.map((url) => ({image_url: url }))
            : [];
        // const blocks = [{type: "image", alt_text: "uploaded image", "image_url": "https://private-user-images.githubusercontent.com/111339712/348129959-9102d3c4-5136-4870-8238-3549bb10702a.jpeg?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MjA4Nzg0OTAsIm5iZiI6MTcyMDg3ODE5MCwicGF0aCI6Ii8xMTEzMzk3MTIvMzQ4MTI5OTU5LTkxMDJkM2M0LTUxMzYtNDg3MC04MjM4LTM1NDliYjEwNzAyYS5qcGVnP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9QUtJQVZDT0RZTFNBNTNQUUs0WkElMkYyMDI0MDcxMyUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNDA3MTNUMTM0MzEwWiZYLUFtei1FeHBpcmVzPTMwMCZYLUFtei1TaWduYXR1cmU9YmJhMTUzMTk5OGJlYWI2OTk0M2U5NTg5MWIzMTk1NGE4YzZkMzQ5ZGZjZTRhOGJjMmYwZTVmOGQ4NzBmY2IzOCZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QmYWN0b3JfaWQ9MCZrZXlfaWQ9MCZyZXBvX2lkPTAifQ.7yJXGozG3m2ievwNP4WTyOAALyXsDCDepU1cbVK0ANM"}];
        console.log(JSON.stringify(attachments));
        const response = await slack?.chat.postMessage({
          text: values.text,
          channel: "C06SBHMQU8G",
          thread_ts: messageTs,
          attachments: attachments,
        });
        if (!response.ok) {
          await showFailureToast(response.error, { title: "Failed to pause session" });
        }

        console.log(JSON.stringify(response));
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
