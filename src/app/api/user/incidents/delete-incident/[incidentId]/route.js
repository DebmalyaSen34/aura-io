import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// Function that deletes the incident from the database
// throws an error if the server error occurs
async function deleteIncident(incidentId) {
  const { data, error } = await supabase
    .from("incident")
    .delete()
    .eq("id", incidentId);

  //! There is a bug here
  //TODO: Fix the bug
  if (error) {
    throw new Error("Server error by supabase");
  }

  return data;
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

    // Delete the incident from the database
    await deleteIncident(incidentId);

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
