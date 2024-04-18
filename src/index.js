/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

import { Client } from "@microsoft/microsoft-graph-client";
import { PublicClientApplication, InteractionType } from "@azure/msal-browser";
import { AuthCodeMSALBrowserAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser";
import { LogLevel } from "@azure/msal-browser";

/* global Office */

class OfficeAuthProvider {
  async getAccessToken(AuthenticationProviderOptions) {
    return Office.auth.getAccessToken({
      allowConsentPrompt: true,
      allowSignInPrompt: true,
      forMSGraphAccess: true,
    });
  }
}
//const authProvider = new OfficeAuthProvider();
Office.onReady(async (info) => {
  const msalConfig = {
    auth: {
      clientId: "3773bcb1-8506-4ed6-92ef-ba4ecd0a31c4",
      authority: "https://login.microsoftonline.com/514efd40-8efe-4f15-819f-34e56acf1562",
      redirectUri: "https://localhost:3000/index.html",
    },
    cache: {
      cacheLocation: "sessionStorage",
      temporaryCacheLocation: "sessionStorage",
      storeAuthStateInCookie: true,
      secureCookies: false,
      claimsBasedCachingEnabled: true,
    },
    system: {
      loggerOptions: {
        loggerCallback: (level, message, containsPii) => {
          if (containsPii) {
            return;
          }
          switch (level) {
            case LogLevel.Error:
              console.error(message);
              return;
            case LogLevel.Info:
              console.info(message);
              return;
            case LogLevel.Verbose:
              console.debug(message);
              return;
            case LogLevel.Warning:
              console.warn(message);
              return;
          }
        },
        piiLoggingEnabled: false,
      },
      windowHashTimeout: 60000,
      iframeHashTimeout: 10000,
      loadFrameTimeout: 0,
      asyncPopups: false,
    },
  };
  const msalInstance = new PublicClientApplication(msalConfig);
  this.msalInstance
    .ssoSilent({
      scopes: ["User.Read", "Mail.ReadWrite.Shared"],
    })
    .then((result) => {
      this.msalInstance.setActiveAccount(result.account);
      console.log(result.account);
    });
  const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(msalInstance, {
    account: this.msalInstance.getActiveAccount(),
    InteractionType: InteractionType.Popup,
    scopes: ["User.Read", "Mail.ReadWrite.Shared"],
  });

  const client = Client.initWithMiddleware({
    authProvider: authProvider,
  });
  Office.context.roamingSettings.set("MSGraphClient", client);
});

async function claimEmail(event) {
  const client = Office.context.roamingSettings.get("MSGraphClient");
  console.log("Claiming Email...");
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
      client.api("/me/messages/" + messageRestID).update({
        flag: {
          flagStatus: "flagged",
        },
      });
      await client.api("/me/messages/" + messageRestID + "/forward").post(forward);
    } catch (error) {
      console.log(error);
    }
  }
  console.log("Email successfully claimed!");
  event.complete();
}
function getAgentName() {
  let fullName = Office.context.mailbox.userProfile.displayName;
  return fullName.split(",")[1] + " " + fullName.split(",")[0];
}
Office.actions.associate("claimEmail", claimEmail);
