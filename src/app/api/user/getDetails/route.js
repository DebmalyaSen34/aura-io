import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getUserFromToken } from "@/utils/auth";

async function getUserData(userId) {
  const { data, error } = await supabase
    .from("user")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function GET(request) {
  try {
    const { userId, email } = await getUserFromToken(request);

    const userData = await getUserData(userId);

    return NextResponse.json(
      { message: "User successfully authenticated!", user: userData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error: ", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
