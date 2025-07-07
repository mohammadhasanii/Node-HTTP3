# Node-HTTP3

This project is a simple, modern web server built in Node.js using the **h3** framework. The main goal is to demonstrate how to build a lightweight and fast application with this framework.

**⚠️ Important Note:** Contrary to what its name might suggest, the `h3` framework does not natively implement the HTTP/3 protocol. `h3` is a modern, high-performance **web framework** that runs on Node.js's standard HTTP engine (HTTP/1.1 or HTTP/2).

To enable clients to connect to this application using the actual **HTTP/3** protocol, it must be deployed behind a **Reverse Proxy** like Nginx or Caddy. This guide explains how to achieve that.

![Example Image](demo.png)

***

## ⚙️ How This Project Works

The core code creates a simple server with two routes:

1.  The `/` route, which returns "Hello World!".
2.  The `/hello/:name` route, which returns a personalized greeting.

This logic is implemented using the `h3` framework, known for its minimalism and high performance.

```javascript
import { createServer } from 'node:http';
import { createApp, eventHandler, createRouter, toNodeListener } from 'h3';

const app = createApp();

const router = createRouter()
    .get('/', eventHandler(() => 'Hello World!'))
    .get('/hello/:name', eventHandler((event) => `Hello ${event.context.params.name}!`));

app.use(router);

// The server runs on Node's standard HTTP engine
createServer(toNodeListener(app)).listen(process.env.PORT || 3000);
console.log('App is running on port 3000');
```

***

## 🚀 Enabling HTTP/3 with Nginx

To allow users to connect to your application via HTTP/3, we need to configure Nginx as a reverse proxy.

**The final architecture will be:**

`User <--- (HTTP/3) ---> Nginx <--- (HTTP/1.1) ---> Your Node.js App`

### Step 1: Prerequisites

1.  A server (VPS) running a Linux distribution.
2.  A domain name pointed to your server's IP address.
3.  **Nginx version 1.25.0 or newer**, compiled with QUIC support.
4.  An SSL/TLS certificate for your domain (you can get one for free from Let's Encrypt).

### Step 2: Run the Node.js Application

First, run your application on the server. It's best practice to use a process manager like `pm2` to ensure the app is always running.

```bash
# Install pm2 globally
npm install pm2 -g

# Start the application with pm2
pm2 start app.js --name "h3-app"
```

This command will start your application on port `3000`.

### Step 3: Configure Nginx

Edit your site's Nginx configuration file (usually located at `/etc/nginx/sites-available/yourdomain.com`) with the following content:

```nginx
server {
    # Listen on port 443 for HTTPS, HTTP/2, and HTTP/3 traffic
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    listen 443 quic reuseport;
    listen [::]:443 quic reuseport;

    # Set your domain name
    server_name yourdomain.com;

    # SSL Certificate paths
    ssl_certificate /etc/letsencrypt/live/[yourdomain.com/fullchain.pem](https://yourdomain.com/fullchain.pem);
    ssl_certificate_key /etc/letsencrypt/live/[yourdomain.com/privkey.pem](https://yourdomain.com/privkey.pem);
    ssl_protocols TLSv1.2 TLSv1.3;

    # Advertise HTTP/3 support to browsers
    add_header Alt-Svc 'h3=":443"; ma=86400';

    # Forward all requests to the Node.js application
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# (Optional) Redirect HTTP traffic to HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$host$request_uri;
}
```

### Step 4: Restart Nginx

After saving the configuration, test it and restart Nginx.

```bash
sudo nginx -t
sudo systemctl restart nginx
```

Your application is now accessible via your domain with full **HTTP/3** support! You can verify this using online tools like **HTTP/3 Check**.
