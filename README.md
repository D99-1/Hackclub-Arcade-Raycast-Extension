# Hack Club Arcade

Manage your Hack Club Arcade sessions from Raycast. The extension provides commands for:

- Starting a new session, with work description
- Pausing/resuming the current session
- Sending scraps to active slack thread
- Ending the current session
- Viewing session history

All these actions can also be completed through an menu bar menu.

## Installation

![screenshot1](https://github.com/user-attachments/assets/9102d3c4-5136-4870-8238-3549bb10702a)
![screenshot2](https://github.com/user-attachments/assets/ccaab431-a67a-4161-b392-9b78628f52b0)
![screenshot3](https://github.com/user-attachments/assets/8ba78c3a-f33a-4a88-9f47-7d26ab96c30b)
![screenshot4](https://github.com/user-attachments/assets/30e443a7-d62c-485d-9f14-549b781c2a00)
![screenshot5](https://github.com/user-attachments/assets/c2f6f1cf-e031-43b7-950c-b1ef0cb1a77f)
![screenshot6](https://github.com/user-attachments/assets/7577f7f4-9c9b-44ea-a021-aeaa7e62415e)
![screenshot7](https://github.com/user-attachments/assets/75d574f2-c581-4808-9f08-04f95d72abf0)
![screenshot8](https://github.com/user-attachments/assets/25be4e14-2672-4ac0-8d98-bb29fba46105)
![screenshot9](https://github.com/user-attachments/assets/94c9fb58-bf9d-4b8d-b046-bd1540b82abe)
![screenshot10](https://github.com/user-attachments/assets/0cae9003-8134-45d4-a052-7291118dc2e3)
*(Note: after entering dev mode and enabling the menu bar command, you can close the terminal window)*

## Scrap Posting

In order to post scraps from the extension, you will need to create a new slack application with permissions. Then, add it to hackclub and copy its user token. Heres how you can do it:

1. Go to <https://api.slack.com/apps> and create a new app, selecting the 'From Scratch option'. Give it a name, and select 'Hack Club' as the workspace.
2. In the sidebar, select 'OAuth & Permissions' then scroll down to 'User Token Scopes'. Add the `chat:write` and `files:write` scopes.
3. Scroll up and click the 'Install to Workspace' button, and confirm. Now there will be a field called 'User OAuth Token' in its place.
4. Copy and paste the token into the extension 'Slack API Token'preferences field.

Now, using the command you can send messages with text and optionally files straight to your slack thread!
