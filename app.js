import { createServer } from 'node:http';
import { createApp, eventHandler, createRouter, toNodeListener } from 'h3';

const app = createApp();

const router = createRouter()
    .get('/', eventHandler(() => 'Hello World!'))
    .get('/hello/:name', eventHandler((event) => `Hello ${event.context.params.name}!`)
    );




app.use(router);
createServer(toNodeListener(app)).listen(process.env.PORT || 3000);
console.log('app is running on port 3000')