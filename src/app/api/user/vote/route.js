import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getUserFromToken } from "@/utils/auth";

//! Some bugger is occuring here
//! Always getting server error by Supabase
async function toggleVote(incidentId, voteType, userId) {
  console.log({
    incidentId: incidentId,
    voteType: voteType,
    userId: userId,
  });

  const { data, error } = await supabase.rpc("toggle_vote", {
    p_incident_id: incidentId,
    p_user_id: userId,
    p_vote_type: true,
  });

  console.log("data:", data);

  if (error) {
    throw new Error("Server error by supabase", error.message);
  }

  return data;
}

export async function POST(request) {
  try {
    const { userId } = await getUserFromToken(request);

    const { incidentId, voteType } = await request.json();

    if (!incidentId || !voteType === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: "IncidentId and voteType are required",
        },
        { status: 400 }
      );
    }

    const { upvotes, downvotes, user_vote } = await toggleVote(
      incidentId,
      voteType,
      userId
    );

    return NextResponse.json(
      {
        success: true,
        message: "Vote updated successfully!",
        data: {
          upvotes,
          downvotes,
          userVote: user_vote,
        },
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
