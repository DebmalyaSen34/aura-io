import { NextResponse } from "next/server";
import { getUserFromToken } from "@/utils/auth";
import client from "@/lib/db";

async function destroyCookies() {
  const response = NextResponse.json(
    { success: true, message: "Logged out successfully!" },
    { status: 200 }
  );
  response.cookies.set("auth_token", "", { path: "/", expires: new Date(0) });
  return response;
}

async function removeRedisCache(userId) {
  const pattern = `incidents:${userId}:*`;
  let cursor = "0";
  do {
    const reply = await client.scan(cursor, {
      MATCH: pattern,
      COUNT: 100,
    });

    cursor = reply.cursor;
    const keys = reply.keys;

    if (keys.length > 0) {
      await client.del(keys);
    }
  } while (cursor !== "0");
}

export async function POST(request) {
  try {
    const { userId, email } = await getUserFromToken(request);

    if (!userId || !email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    //TODO: Remove Redis cache
    // await removeRedisCache(userId);

    return destroyCookies(request);
  } catch (error) {
    console.error("Error logging out", error);
    return NextResponse.json(
      { success: false, message: "Error logging out" },
      { status: 500 }
    );
  }
}
