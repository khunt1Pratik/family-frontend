import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById('root')).render(
    <GoogleOAuthProvider clientId="331708234-ga421t6sje1feksp5jg0g3q217dd0i0a.apps.googleusercontent.com">
        <App />
    </GoogleOAuthProvider>
);
