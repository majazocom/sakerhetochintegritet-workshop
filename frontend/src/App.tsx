import React, { useState } from "react";
import DOMPurify from "dompurify";

const API_BASE_URL = 'http://localhost:4000';

const XSSComponent = () => {
  const [input, setInput] = useState<string>('Skriv in något här...');
  const [safeHtml, setSafeHtml] = useState<string>('Säker output visaas här.');
  const [unsafeHtml, setUnsafeHtml] = useState<string>('....Osäker output...');

  // funktion för osäker rendering. Modul 4.1
  const renderUnsafe = (html: string) => {
    // Varning: denna funktion skapar ett XSS-hål och används endast i studiesyfte.
    setUnsafeHtml(html);
  };

  // funktion för säker rendering
  const renderSafe = (html: string) => {
    // använda oss av DOMPurify för att rensa HTML:en innan den används
    const sanitized = DOMPurify.sanitize(html);
    setSafeHtml(sanitized);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    // uppdatera båda renderingarna direkt för att se skillnaden
    renderUnsafe(value);
    renderSafe(value);
  };

  return (
    <section>
      <h2>Modul 4</h2>
      <input type="text" value={input} onChange={handleChange} />
      <div dangerouslySetInnerHTML={{ __html: unsafeHtml }}></div>
      <div dangerouslySetInnerHTML={{ __html: safeHtml }}></div>
    </section>
  )
}

const App = () => {
  const [userName, setUserName] = useState<string>('');
  const [userPassword, setUserPassword] = useState<string>('');
  const [status, setStatus] = useState<string>("Väntar på inloggning...");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Försöker logga in...');

    // 'credentials: include' är nödvändigt för att skicka cookies cross-origin
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, userPassword }),
        credentials: 'include'
      });

      if (response.ok) {
        setStatus('Inloggning lyckades! Sessionscookie satt (HttpOnly/SameSite');
        // 2.2: Skapa en enkel funktion som lagrar ett fiktivt ID i localStorage vid inloggning
        localStorage.setItem('userPref', 'dark_mode');
        localStorage.setItem('farlig_token', 'XSS_target_123');
      } else {
        setStatus('Inloggning misslyckades');
      }
    } catch (error) {
      setStatus(`Fel: ${error}.message`);
    }
  }

  return (
    // form>div>input*2
    <main>
      <form onSubmit={handleLogin}>
        <h2>Inloggning</h2>
        <p>Status: {status}</p>
        <div>
          <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
          <input type="password" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} />
        </div>
        <button type="submit">Logga in</button>
      </form>
      <XSSComponent />
    </main>
  )
}

// slå ihop allt
const RootApp = () => (
  <App />
);

export default RootApp;