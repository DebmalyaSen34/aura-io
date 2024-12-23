import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getUserFromToken } from "@/utils/auth";

async function renameUser(userId, newName) {
  const { data: renameData, error: renameError } = await supabase
    .from("user")
    .update({ name: newName })
    .eq("id", userId);

  if (renameError) {
    throw new Error(
      "There was an error while updating new user name in the database.",
      renameError.message
    );
  }

  return renameData;
}

export async function POST(request) {
  try {
    const { newName } = await request.json();

    if (!newName) {
      return NextResponse.json(
        {
          success: false,
          message: "New name is required.",
        },
        {
          status: 400,
        }
      );
    }

    const { userId } = await getUserFromToken(request);

    await renameUser(userId, newName);

    return NextResponse.json(
      {
        success: true,
        message: "User name updated successfully.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error while renaming user name caught.", error);
    return NextResponse.json(
      {
        success: false,
        message: "There was an error while renaming user name.",
      },
      {
        status: 500,
      }
    );
  }
}
