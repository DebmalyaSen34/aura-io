import { jwtVerify } from "jose";

export async function getUserFromToken(request) {
  const cookies = request.cookies;
  const authToken = cookies.get("auth_token")?.value;

  if (!authToken) {
    throw new Error("Unauthorized");
  }

  const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
  const { payload } = await jwtVerify(authToken, secretKey);

  const userId = payload.userId;
  const email = payload.email;

  if (!userId || !email) {
    throw new Error("Invalid token");
  }

  return { userId, email };
}
