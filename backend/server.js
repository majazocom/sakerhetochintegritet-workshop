const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 4000;

// sätta upp cors för att tillåta anrop från frontenden (5173)
// credentials: true är kritiskt för att tillåta sändning och mottagning av cookies cross-origin
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// login-endpoint
app.post('/login', (req, res) => {
    // här skulle man ju normaltvis verifiera lösenord, vi hoppar det denna workshop. 
    const fakeSessionId = `s-id-${Date.now()}`;
    const maxAgeInSeconds = 60 * 60 * 2; // 2 timmar

    // Sätt Cookien med ALLA säkerhetsflaggor
    res.cookie('sessionId', fakeSessionId, {
        maxAge: maxAgeInSeconds * 1000, // millisekunder
        httpOnly: true, // skyddar mot XSS
        secure: true,
        sameSite: 'Lax', // skyddar mot CSRF
        path: '/'
    });

    res.status(200).json({ message: 'Inloggning lyckades! Sessionscookie satt.' });
});

// logout endpoint (radera sessionscookien)
app.post('/logout', (req, res) => {
    // radera cookien
    res.clearCookie('sessionId', {
        httpOnly: true,
        secure: true,
        sameSite: 'Lax',
        path: '/'
    });
    res.status(200).json({ message: "Utloggning lyckades. Sessionscookie raderad." });
});

app.listen(PORT, () => {
    console.log(`Backend körs på http://localhost:${PORT}`);
});