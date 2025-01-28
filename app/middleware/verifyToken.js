import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET_KEY ; // Use the same secret key

export function verifyToken(token) {
  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded; // Return the decoded token (user details)
  } catch (error) {
    throw new Error("Invalid or expired token", error.message);
  }
}

