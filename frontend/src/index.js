import React from "react";
import ReactDOM from "react-dom/client";
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';
import App from "./App";
import './assets/scss/style.scss';

Amplify.configure(awsconfig);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
