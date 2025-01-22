import React from "react";
import ReactDOM from "react-dom/client";
import { Amplify } from 'aws-amplify';
import config from './aws-exports';
import App from "./App";
import './assets/scss/style.scss';
import { AuthProvider } from './context/AuthContext';

Amplify.configure(config);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>,
    </React.StrictMode>
);