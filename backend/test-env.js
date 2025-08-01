import 'dotenv/config';

console.log("Environment Variables Check:");
console.log("ADMIN_EMAIL:", process.env.ADMIN_EMAIL);
console.log("ADMIN_PASSWORD:", process.env.ADMIN_PASSWORD ? "***SET***" : "NOT SET");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "***SET***" : "NOT SET");
console.log("CLOUDINARY_NAME:", process.env.CLOUDINARY_NAME ? "***SET***" : "NOT SET");
console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY ? "***SET***" : "NOT SET");
console.log("CLOUDINARY_SECRET_KEY:", process.env.CLOUDINARY_SECRET_KEY ? "***SET***" : "NOT SET");
console.log("MONGODB_URI:", process.env.MONGODB_URI ? "***SET***" : "NOT SET");
console.log("MONGODB_URL:", process.env.MONGODB_URL ? "***SET***" : "NOT SET");
