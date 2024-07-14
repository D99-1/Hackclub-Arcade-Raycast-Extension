import { useState } from "react";
import { Action, Form, ActionPanel } from "@raycast/api";
import fetch from "node-fetch";
import { startSession } from "./api";
import { FormValidation, useForm } from "@raycast/utils";

interface FormValues {
  description: string;
}

export default function StartSession() {
  const { handleSubmit, itemProps } = useForm<FormValues>({
    onSubmit: async (values) => {
      await startSession(values.description);
    },
    validation: {
      description: FormValidation.Required,
    },
  });

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Start Session" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField
        title="Description"
        info="What do you plan to achieve in this session?"
        placeholder="This session I will..."
        autoFocus={true}
        {...itemProps.description}
      />
      <Form.Separator />
      {/* <Form.Checkbox id='notify' label='Remind Me' defaultValue={true} info='You will get a notification 10 minutes before the session ends' /> */}
    </Form>
  );
}
