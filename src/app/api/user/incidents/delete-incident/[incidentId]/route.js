import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getUserFromToken } from "@/utils/auth";

async function getAuraFromIncidents(incidentId) {
  try {
    const { data, error } = await supabase
      .from("incident")
      .select("aura_points")
      .eq("id", incidentId)
      .single();

    if (error) {
      throw new Error(
        "Server error by supabase while getting aura points from incident table"
      );
    }
    return data;
  } catch (error) {
    console.error(
      "Error while fetching aura points from incident table: ",
      error
    );
    throw error;
  }
}

async function getUserAuraAndIncidents(userId) {
  try {
    const { data, error } = await supabase
      .from("user")
      .select("*") //! Instead of selecting everything try to select only the parameters you need
      .eq("id", userId)
      .single();

    if (error) {
      throw new Error(
        "Server error by supabase while getting aura points and total incidents from users table"
      );
    }

    return data;
  } catch (error) {
    console.error("Error while fetching aura points from users table: ", error);
    throw error;
  }
}

async function updateAuraPoints(userId, auraPoints, total_user_incidents) {
  try {
    const { data, error } = await supabase
      .from("user")
      .update({
        total_aura_points: auraPoints,
        total_incidents: total_user_incidents - 1,
      })
      .eq("id", userId);

    if (error) {
      throw new Error(
        "Server error by supabase while updating aura points in users table"
      );
    }
    return data;
  } catch (error) {
    console.error("Error while updating aura points in users table: ", error);
    throw error;
  }
}

// Function that deletes the incident from the database
// throws an error if the server error occurs
async function deleteIncident(incidentId) {
  // Delete the incident
  try {
    const { data: delete_data, error } = await supabase
      .from("incident")
      .delete()
      .eq("id", incidentId);

    if (error) {
      throw new Error("Server error by supabase while deleting incident");
    }

    return delete_data;
  } catch (error) {
    console.error("Error while deleting incident: ", error);
    throw error;
  }
}

export async function DELETE(request, { params }) {
  try {
    // Get the incident ID from the request params
    const { incidentId } = params;

    // If the incident ID is not found, return bad request
    if (!incidentId) {
      return NextResponse.json(
        { success: false, message: "Incident ID is required" },
        { status: 400 }
      );
    }

    const { userId } = await getUserFromToken(request);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const incidentAuraPoints = await getAuraFromIncidents(incidentId);

    if (!incidentAuraPoints) {
      return NextResponse.json(
        { success: false, message: "Incident not found" },
        { status: 404 }
      );
    }

    const userAuraPoints = await getUserAuraAndIncidents(userId);

    if (!userAuraPoints) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Delete the incident from the database
    await deleteIncident(incidentId);

    await updateAuraPoints(
      userId,
      userAuraPoints.total_aura_points - incidentAuraPoints.aura_points,
      userAuraPoints.total_incidents
    );

    // Return the success message
    return NextResponse.json(
      { success: true, message: "Incident deleted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    // Log the error message
    console.error("Error: ", error);

    // Return the error message
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
