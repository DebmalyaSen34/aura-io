import { NextResponse } from "next/server";
import { getUserFromToken } from "@/utils/auth";

async function destroyCookies() {
  const response = NextResponse.json(
    { success: true, message: "Logged out successfully!" },
    { status: 200 }
  );
  response.cookies.set("auth_token", "", { path: "/", expires: new Date(0) });
  return response;
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

    return destroyCookies(request);
  } catch (error) {
    console.error("Error logging out", error);
    return NextResponse.json(
      { success: false, message: "Error logging out" },
      { status: 500 }
    );
  }
}
