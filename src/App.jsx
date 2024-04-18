import * as React from "react";

import { ThemeProvider } from "@fluentui/react";
/* global Office */
class App extends React.Component {
  constructor(props) {
    super(props);
    this.init();
  }
  async init() {
    const client = Office.context.roamingSettings.get("MSGraphClient");
    if (client === null) {
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
  }
  render() {
    return <h1>Welcome to the claim addin!</h1>;
  }
}

export default App;
