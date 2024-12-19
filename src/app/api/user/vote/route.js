import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getUserFromToken } from "@/utils/auth";

async function giveVotes(incidentId, voteType, userId) {
  const { data, error } = await supabase.from("incident_votes").insert({
    incident_id: incidentId,
    user_id: userId,
    vote_type: voteType === "up" ? 1 : 0,
  });

  if (error) {
    throw new Error("Server error by supabase");
  }
  return data;
}

export async function POST(request) {
  try {
    const { userId } = await getUserFromToken(request);

    const { incidentId, voteType } = await request.json();

    if (!incidentId || !voteType) {
      return NextResponse.json(
        {
          success: false,
          message: "IncidentId and voteType are required",
        },
        { status: 400 }
      );
    }

    await giveVotes(incidentId, voteType, userId);

    return NextResponse.json(
      {
        success: true,
        message: "Vote updated successfully!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while updating vote in database: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error while updating vote in database",
      },
      { status: 500 }
    );
  }
}
