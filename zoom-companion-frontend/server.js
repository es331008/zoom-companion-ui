import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

const securityHeaders = {
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'X-Content-Type-Options': 'nosniff',
    'Content-Security-Policy': "default-src 'self' https:; connect-src 'self' https:; script-src 'self' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https:",
    'Referrer-Policy': 'no-referrer',
};


app.use((req, res, next) => {
    Object.entries(securityHeaders).forEach(([header, value]) => {
        res.setHeader(header, value);
    });
    next();
});

app.use(
    '/api/bot',
    createProxyMiddleware({
        target: 'http://localhost:5002/api/bot',
        changeOrigin: true,
    })
);

app.use(
    '/',
    createProxyMiddleware({
        target: 'http://localhost:3000',
        changeOrigin: true,
        ws: true
    })
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Secure proxy running at http://localhost:${PORT}`);
});
