import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const GlobalStyles = () => (
  <style jsx="true" global="true">{`
    body {
      background-color: #f3f4f6;
    }

    .markdown-preview h1, .markdown-preview h2, .markdown-preview h3, 
    .markdown-preview h4, .markdown-preview h5, .markdown-preview h6 {
      margin-top: 1em;
      margin-bottom: 0.5em;
    }

    .markdown-preview p {
      margin-bottom: 1em;
    }

    .markdown-preview ul, .markdown-preview ol {
      margin-bottom: 1em;
      padding-left: 1em;
    }

    .markdown-preview blockquote {
      border-left: 4px solid #e5e7eb;
      padding-left: 1em;
      margin-bottom: 1em;
      font-style: italic;
      color: #4b5563;
    }

    .markdown-preview code {
      background-color: #f3f4f6;
      padding: 0.2em 0.4em;
      border-radius: 0.25em;
      font-size: 0.9em;
    }

    .markdown-preview pre {
      background-color: #f3f4f6;
      padding: 1em;
      border-radius: 0.5em;
      overflow-x: auto;
      margin-bottom: 1em;
    }

    .markdown-preview img, .markdown-preview video {
      max-width: 100%;
      height: auto;
      margin-bottom: 1em;
    }

    .markdown-preview hr {
      border: 0;
      border-top: 1px solid #e5e7eb;
      margin: 2em 0;
    }
  `}</style>
);


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalStyles/>
    <App />
  </StrictMode>,
)
