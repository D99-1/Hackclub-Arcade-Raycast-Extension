import { useState } from "react";
import { Action, Form, ActionPanel } from "@raycast/api";
import fetch from "node-fetch";
import { startSession } from "./api";
import { FormValidation, useForm } from "@raycast/utils";

interface FormValues {
  text: string;
  file: string[] | undefined;
}

export default function SendScrapInSlack() {
  const { handleSubmit, itemProps } = useForm<FormValues>({
    onSubmit: async (values) => {},
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
