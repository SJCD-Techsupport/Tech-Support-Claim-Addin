import { LogLevel } from "@azure/msal-browser";

const msalConfig = {
  auth: {
    clientId: "3773bcb1-8506-4ed6-92ef-ba4ecd0a31c4",
    authority: "https://login.microsoftonline.com/514efd40-8efe-4f15-819f-34e56acf1562",
    redirectUri: "https://localhost:3000/taskpane.html",
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
export default msalConfig;