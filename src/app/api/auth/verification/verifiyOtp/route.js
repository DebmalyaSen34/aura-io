import { NextResponse } from "next/server";
import client from "@/lib/db";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request) {
  try {
    const { email, otp } = await request.json();

    console.log("Details:!!!!!!!!!!!!");

    console.log(email, otp);

    if (!client.isOpen) {
      await client.connect();
      console.log("Reconnecting with redis!");
    }

    const storedOtp = await client.get(`${email}_otp`);

    if (!storedOtp) {
      console.log("No otp was found with your email address!");
      return NextResponse.json(
        { success: false, message: "No otp was found with you email address!" },
        { status: 404 }
      );
    }

    if (storedOtp !== otp) {
      console.log("Invalid otp was provided!");
      return NextResponse.json(
        { success: false, message: "Invalid otp was provided!" },
        { status: 401 }
      );
    }

    const userDataJson = await client.get(email);

    if (!userDataJson) {
      console.log("User data was not found!");
      return NextResponse.json(
        { success: false, message: "User data was not found!" },
        { status: 404 }
      );
    }

    const userData = JSON.parse(userDataJson);

    console.log("User data: ", userData);

    const { error: userError } = await supabase.from("user").insert({
      password: userData.password,
      name: userData.name,
      email: userData.email,
    });

    if (userError) {
      console.log(
        "There was an error while registering you into out database!"
      );
      return NextResponse.json(
        { success: false, message: "Error while inserting into database!" },
        { status: 500 }
      );
    }

    await client.del(email);
    await client.del(`${email}_otp`);

    await client.disconnect();

    console.log("Successully registered!");
    return NextResponse.json(
      { success: true, message: "Successfully registered!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("There was internal error: ", error);
    return NextResponse.json(
      { success: false, message: "Internal error!" },
      { status: 500 }
    );
  }
}
