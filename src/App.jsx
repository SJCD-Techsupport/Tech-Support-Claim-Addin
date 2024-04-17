import * as React from "react";

import { ThemeProvider } from "@fluentui/react";

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <ThemeProvider></ThemeProvider>;
  }
}

export default App;
