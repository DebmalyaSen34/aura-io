import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getUserFromToken } from "@/utils/auth";

async function updateVote(incidentId, voteType, userId) {
  const { data, error } = await supabase.rpc("handle_vote", {
    p_user_id: userId,
    p_incident_id: incidentId,
    p_vote_type: voteType === "up" ? 1 : voteType === "down" ? 0 : null,
  });

  if (error) {
    throw new Error(`Error while updating vote in database: ${error.message}`);
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

    await updateVote(incidentId, voteType, userId);

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
        message: error.message || "Error while updating vote in database",
      },
      { status: 500 }
    );
  }
}
