import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getUserFromToken } from "@/utils/auth";

// Function that validates the request body
// throws an error if the request body is invalid
async function validateRequestBody(request) {
  const { description, aura_points } = await request.json();

  if (!description || !aura_points) {
    throw new Error("Invalid request body");
  }

  return { description, aura_points };
}

// Function that inserts the incident into the database
// throws an error if the server error occurs
async function insertIncident(userId, description, aura_points) {
  //! Name of the table is very important
  //! Suffered from a bug for a long time because of this
  const { data, error } = await supabase.from("incident").insert({
    user_id: userId,
    description: description,
    aura_points: aura_points,
  });

  if (error) {
    throw new Error("Server error by supabase");
  }

  return data;
}

export async function POST(request) {
  try {
    // Get the user info from the token
    const { userId, email } = await getUserFromToken(request);

    // If the user info is not found, return unauthorized
    if (!userId || !email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Validate the request body
    const { description, aura_points } = await validateRequestBody(request);

    // Insert the incident into the database
    await insertIncident(userId, description, aura_points);

    // Return the success message
    return NextResponse.json(
      {
        success: true,
        message: "Incident created successfully!",
      },
      { status: 201 }
    );
  } catch (error) {
    // Catch the error and return the error message
    console.error("Error creating incident: ", error);

    // Return the error message
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error caught by try-catch!",
      },
      { status: 500 }
    );
  }
}
