import { useState } from "react";
import { Action, Form, ActionPanel } from "@raycast/api";
import fetch from "node-fetch";
import { startSession } from "./api";

export default function StartSession() {
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    startSession(description);
  };

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Start Session" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="description"
        title="Description"
        info="What do you plan to achieve in this session?"
        placeholder="This session I will..."
        autoFocus={true}
        onChange={(value) => setDescription(value)}
      />
      <Form.Separator />
      {/* <Form.Checkbox id='notify' label='Remind Me' defaultValue={true} info='You will get a notification 10 minutes before the session ends' /> */}
    </Form>
  );
}
