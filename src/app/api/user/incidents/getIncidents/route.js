import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getUserFromToken } from "@/utils/auth";

async function getIncidents(userId) {
  const { data, error } = await supabase
    .from("incident")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    throw new Error("Server error by supabase");
  }
  return data;
}

export async function GET(request) {
  try {
    const { userId, email } = await getUserFromToken(request);

    if (!userId || !email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const incidents = await getIncidents(userId);

    return NextResponse.json(
      { success: true, message: "Incidents fetched successfully!", incidents },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error: ", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
