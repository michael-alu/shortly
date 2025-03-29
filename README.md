# Shortly - URL Shortening App

Shortly is a lightweight and efficient URL shortener application that allows users to shorten long URLs into concise, easily shareable links. The project consists of a **frontend** (Shortly) built with HTML, CSS, and JavaScript, and a **backend** (Shortly API) powered by TypeScript and Express.

## Table of Contents
- [Live Demo](#live-demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Challenges & Solutions](#challenges--solutions)
- [Credits](#credits)

## Live Demo
[Shortly Live Version](https://www.michael-alu.tech) 

## Features
- Shorten long URLs into easy-to-use links
- Copy shortened URLs to clipboard
- Retrieve details about previously shortened links
- Responsive design for mobile and desktop users

## Tech Stack
### Frontend (Shortly)
- HTML
- CSS
- JavaScript

### Backend (Shortly API)
- TypeScript
- Node.js
- Express.js
- MongoDB

## Getting Started

### Installation
To set up **Shortly** locally, follow these steps:

#### 1. Clone the repository
```sh
# Clone the frontend

git clone https://github.com/michael-alu/shortly.git
cd shortly
```

#### 2. Install dependencies
```sh
# Install frontend dependencies

yarn install
```

### Running the Application
#### Start the Frontend
```sh
open index.html
```

## API Endpoints
The backend acts as a **proxy** to securely call the Bit.ly API instead of making direct requests from the frontend. Below are the key endpoints:

| Method | Endpoint         | Description                |
|--------|-----------------|----------------------------|
| POST   | `/shorten`      | Shortens a given URL using the Bit.ly API |
| DELETE | `/delete/:id`   | Deletes a shortened URL   |

### API Documentation
Shortly API is built using Express.js as a secure proxy for Bit.ly. You can find the official Bit.ly API documentation here:
[Bit.ly API Documentation](https://dev.bitly.com/)

## Deployment
The project was deployed on our **school-assigned web servers** for the frontend, while the **proxy API was deployed on Render**.

### Using the Hosted Backend
Instead of setting up the backend locally, use our hosted proxy API:
```
https://shortly-api-liif.onrender.com
```
Replace API calls in your frontend code with the above URL.

### Frontend Deployment on School Servers
Our frontend is hosted on our dedicated school-assigned web servers. We leverage NGINX for serving static assets and HAProxy for load balancing. Here’s a quick breakdown:

#### Web Servers Setup
Shortly is deployed on two web servers (`web-01` and `web-02`) running NGINX. The files are located in:
```sh
/var/www/shortly
```
Below is the configuration snippet implemented to handle incoming traffic:
```nginx
server {
    listen 80;
    server_name michael-alu.tech www.michael-alu.tech;

    # Headers for tracking the server instance
    add_header X-Served-By 6530-web-01;
    error_page 404 /404.html;

    location / {
        root /var/www/shortly;
        try_files $uri $uri/ =404;
    }
}
```

#### Load Balancer Configuration
Our load balancer (`lb-01`) is powered by HAProxy, which sits in front of web-01 and web-02. HAProxy dynamically routes incoming requests based on server health, ensuring high availability and even load distribution. This setup minimizes downtime and keeps performance on point.

## Challenges & Solutions
### **Challenge 1: CORS Issues**
- **Problem**: The frontend couldn’t communicate with the backend due to CORS restrictions.
- **Solution**: Added CORS middleware to the backend using `cors` package.

### **Challenge 2: Handling Invalid URLs**
- **Problem**: Users entered invalid URLs that broke the API response.
- **Solution**: Implemented URL validation before processing input.

## Credits
- **API References**:
  - [Bit.ly API](https://dev.bitly.com/)
  - [Express.js](https://expressjs.com/)

---
Feel free to contribute or raise issues via GitHub! 🎉
