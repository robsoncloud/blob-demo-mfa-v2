import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { HashRouter } from "react-router-dom";
import { AuthenticationResult, EventMessage, EventType, PublicClientApplication } from "@azure/msal-browser";

import {msalConfig } from "./authConfig"
import { MsalProvider } from "@azure/msal-react";

const msalInstance = new PublicClientApplication(msalConfig)

if(!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
  msalInstance.setActiveAccount(msalInstance.getActiveAccount())
}

msalInstance.addEventCallback( (event: EventMessage) => {
  if(event.eventType == EventType.LOGIN_SUCCESS && (event.payload as AuthenticationResult).account ) {
    const account = (event.payload as AuthenticationResult).account
    msalInstance.setActiveAccount(account)
  }
})

createRoot(document.getElementById("root")!).render(
  
    <MsalProvider instance={msalInstance} >
    <HashRouter>
      <App />
    </HashRouter>
    </MsalProvider>
  
);
