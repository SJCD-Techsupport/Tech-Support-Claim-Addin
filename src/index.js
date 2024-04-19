/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global Office */
import { Client } from "@microsoft/microsoft-graph-client";
const console = window.console;
class OfficeAuthProvider {
  async getAccessToken(AuthenticationProviderOptions) {
    const tokenPromise = Office.auth.getAccessToken({
      allowConsentPrompt: true,
      allowSignInPrompt: true,
      forMSGraphAccess: true,
    });
    console.log(tokenPromise);
    return tokenPromise;
  }
}
const authProvider = new OfficeAuthProvider();
const client = Client.initWithMiddleware({
  authProvider: authProvider,
});
async function claimEmail(event) {
  console.log("Claiming email...");
  let consoleMsg = "";
  //Get currently selected message reference
  const message = Office.context.mailbox.item;
  
  if (message == undefined || message.internetMessageId.length == 0 || message.itemId.length == 0) return;
  const comment = "Claiming email:" + message.internetMessageId;
  //TODO: Determine if the message is claimed already
  //Convert the message EWS ID to REST ID
  const messageRestID = Office.context.mailbox.convertToRestId(message.itemId, Office.MailboxEnums.RestVersion.v2_0);
  //Check to see if we are in a shared inbox
  if (message.getSharedPropertiesAsync) {
    try {
      //"/users/" + this.sharedMailboxId + "/messages/" + msgRestID + "/forward"
      await client.api("/users/techsupport@sjcd.edu/" + messageRestID).update({
        flag: {
          flagStatus: "flagged",
        },
      });
      await client.api("/users/techsupport@sjcd.edu/" + messageRestID + "/forward").post({
        comment: comment,
        toRecipients: [
          {
            emailAddress: {
              name: "San Jacinto College Tech Support",
              address: "techsupport@sjcd.edu",
            },
          },
        ],
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    const forward = {
      comment: comment,
      toRecipients: [
        {
          emailAddress: {
            name: "Jose Mendez",
            address: "jose.mendez@sjcd.edu",
          },
        },
      ],
    };
    try {
      //"/users/" + this.sharedMailboxId + "/messages/" + msgRestID + "/forward"
      await client.api("/me/messages/" + messageRestID).update({
        flag: {
          flagStatus: "flagged",
        },
      });
      await client.api("/me/messages/" + messageRestID + "/forward").post(forward);
    } catch (error) {
      console.log(error);
    }
  }
  message.notificationMessages.addAsync("errors", {
    key: "error",
    message: consoleMsg,
    persistent: false,
    type: Office.MailboxEnums.ItemNotificationMessageType,
  });
  
  event.completed();
}
function getAgentName() {
  let fullName = Office.context.mailbox.userProfile.displayName;
  return fullName.split(",")[1] + " " + fullName.split(",")[0];
}
Office.actions.associate("claimEmail", claimEmail);
