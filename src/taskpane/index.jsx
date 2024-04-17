import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";

import { initializeIcons } from "@fluentui/react/lib/Icons";

initializeIcons();

/* global document, Office, module, require */

const title = "Contoso Task Pane Add-in";
const rootElement = document.getElementById("container");
const root = createRoot(rootElement);

Office.onReady(async () => {
  root.render(<App />);
});

if (module.hot) {
  module.hot.accept("./components/App", () => {
    const NextApp = require("./components/App").default;
    root.render(NextApp);
  });
}
