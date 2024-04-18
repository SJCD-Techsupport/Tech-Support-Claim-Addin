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

Office.onReady(() => {
  root.render(<App />);
});

if (module.hot) {
  module.hot.accept("./App", () => {
    const NextApp = require("./App").default;
    root.render(NextApp);
  });
}
