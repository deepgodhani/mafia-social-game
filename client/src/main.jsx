  import { StrictMode } from 'react'
  import { createRoot } from 'react-dom/client'
  import './index.css'
  import App from './App.jsx'
  import { GoogleOAuthProvider } from "@react-oauth/google";

  createRoot(document.getElementById('root')).render(
<GoogleOAuthProvider clientId="688581321179-qo0k6541relormo6njn7ucojc6v2jj5c.apps.googleusercontent.com">
  <App />
</GoogleOAuthProvider>
  )
