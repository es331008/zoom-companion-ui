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
    '/api/auth',
    createProxyMiddleware({
        target: 'http://localhost:5000/api/auth',
        changeOrigin: true,
    })
);

app.use(
    '/api/zoom',
    createProxyMiddleware({
        target: 'http://localhost:5001/api/zoom',
        changeOrigin: true,
    })
);

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
        target: 'http://localhost:5173',
        changeOrigin: true,
        ws: true
    })
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Secure proxy running at http://localhost:${PORT}`);
});
