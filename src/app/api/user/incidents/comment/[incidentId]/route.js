import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getUserFromToken } from "@/utils/auth";

async function giveComment(incidentId, userId, content) {
  const { data, error } = await supabase.from("comment").insert({
    incident_id: incidentId,
    user_id: userId,
    content: content,
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

    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { success: false, message: "Content is required" },
        { status: 400 }
      );
    }

    const { userId, email } = await getUserFromToken(request);

    await giveComment(incidentId, userId, content);

    return NextResponse.json(
      { success: true, message: "Comment added successfully" },
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
