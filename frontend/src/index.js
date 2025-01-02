import React from "react";
import ReactDOM from "react-dom/client";
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';
import { PreferencesProvider } from './context/PreferencesContext';
import App from "./App";
import './assets/scss/style.scss';

Amplify.configure(awsconfig);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <PreferencesProvider>
            <App />
        </PreferencesProvider>
    </React.StrictMode>
);
