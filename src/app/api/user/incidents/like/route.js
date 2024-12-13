import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getUserFromToken } from "@/utils/auth";

async function getAllLikes(userId) {
  const { data, error } = await supabase
    .from("likes")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function GET(request) {
  try {
    const { userId, email } = await getUserFromToken(request);

    const likes = await getAllLikes(userId);

    return NextResponse.json(
      { data: likes, success: true, message: "Likes fetched successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error: ", error);
    return NextResponse.json(
      { data: null, success: false, message: error.message },
      { status: 400 }
    );
  }
}
