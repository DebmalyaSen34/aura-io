import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// Function that fetches the incident from the database
// throws an error if the server error occurs
async function getIncident(incidentId) {
  const { data, error } = await supabase
    .from("incident")
    .select("*")
    .eq("id", incidentId);

  if (error) {
    throw new Error("Server error by supabase");
  }

  return data;
}

export async function GET(request, { params }) {
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

    // Fetch the incident from the database
    const incident = await getIncident(incidentId);

    // Return the incident
    return NextResponse.json(
      { success: true, message: "Incident fetched successfully!", incident },
      { status: 200 }
    );
  } catch (error) {
    // Log the error and return the error message
    console.error("Error: ", error);

    // Return the error message with status
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
