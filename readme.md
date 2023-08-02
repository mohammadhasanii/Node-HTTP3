# Node-HTTP3

This is a simple web application written in Node.js using the H3 framework. H3 is a lightweight and fast framework for building web applications that uses HTTP/3 for processing requests and responses.

![Example Image](https://www.zdnet.com/a/img/resize/8c124d7505313d9c9830fb14c6ca9bb1e902dd68/2018/11/12/2df16a7a-72be-437b-ae9a-7267a33085ea/http3.png?auto=webp&width=1280)

## Installation

To install the dependencies, run the following command:


npm install
## Usage

To start the server, run the following command:
```bash
npm start
```

This will start the server on port 3000. You can then visit http://localhost:3000/ in your web browser to see the "Hello World!" message.

You can also visit http://localhost:3000/hello/{name} to see a personalized message that includes the name you specify in the URL.

## Code Overview

The code starts by importing the necessary modules and creating an H3 app:

```js
import { createServer } from 'node:http';
import { createApp, eventHandler, createRouter, toNodeListener } from 'h3';

const app = createApp();
It then creates an H3 router that handles requests to the root path ("/") and the "/hello/{name}" path:

const router = createRouter()
    .get('/', eventHandler(() => 'Hello World!'))
    .get('/hello/:name', eventHandler((event) => `Hello ${event.context.params.name}!`)
    );

app.use(router);
Finally, it creates an HTTP server using Node.js and starts listening for incoming requests:

createServer(toNodeListener(app)).listen(process.env.PORT || 3000);
console.log('app is running on port 3000');
```

## Run application

```js
node app.js