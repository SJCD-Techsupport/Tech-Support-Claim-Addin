import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { Client } from "@microsoft/microsoft-graph-client";
import { PublicClientApplication, InteractionType } from "@azure/msal-browser";
import { AuthCodeMSALBrowserAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser";
import { LogLevel } from "@azure/msal-browser";
import { initializeIcons } from "@fluentui/react/lib/Icons";

initializeIcons();

/* global document, Office, module, require */

const title = "Contoso Task Pane Add-in";
const rootElement = document.getElementById("container");
const root = createRoot(rootElement);

Office.onReady(async () => {
  const client = Office.context.roamingSettings.get("MSGraphClient");
  if (client === null){
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
  } 
  root.render(<App />);
});

if (module.hot) {
  module.hot.accept("./App", () => {
    const NextApp = require("./App").default;
    root.render(NextApp);
  });
}
