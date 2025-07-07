import { createServer } from 'node:http';
import { createApp, eventHandler, createRouter, toNodeListener, setResponseHeader } from 'h3';

const app = createApp();

const router = createRouter()
    // ✨ FEATURE ADDED HERE
    .get('/', eventHandler((event) => {
        // Set the Cache-Control header to cache the response for 60 seconds
        // This tells browsers and CDNs to store this response.
        setResponseHeader(event, 'Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');
        return 'Hello World!';
    }))
    .get('/hello/:name', eventHandler((event) => `Hello ${event.context.params.name}!`));

app.use(router);
createServer(toNodeListener(app)).listen(process.env.PORT || 3000);
console.log('App is running on port 3000');