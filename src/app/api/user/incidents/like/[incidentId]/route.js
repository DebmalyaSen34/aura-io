import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getUserFromToken } from "@/utils/auth";

//TODO: check if user has already liked post if yes then dont add another like to it
async function giveLike(incidentId, userId) {
  const { data, error } = await supabase.from("like").insert({
    incident_id: incidentId,
    user_id: userId,
  });

  if (error) {
    throw new Error("Error giving like!");
  }

  return data;
}

export async function POST(request, { params }) {
  try {
    const { incidentId } = params;

    if (!incidentId) {
      return NextResponse.json(
        { success: false, message: "Incident ID is required" },
        { status: 400 }
      );
    }

    const { userId, email } = await getUserFromToken(request);

    await giveLike(incidentId, userId);

    return NextResponse.json(
      { success: true, message: "Like added successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error: ", error);
    return NextResponse.json(
      { data: null, success: false, message: "Catch error!" },
      { status: 500 }
    );
  }
}
