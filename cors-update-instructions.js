// After you deploy frontend and admin, update this in backend/server.js:

app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? [
            'https://your-frontend-url.vercel.app',  // Replace with actual frontend URL
            'https://your-admin-url.vercel.app'      // Replace with actual admin URL
          ] 
        : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176'],
    credentials: true
}))

// Then redeploy your backend
