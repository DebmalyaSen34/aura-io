import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getUserFromToken } from "@/utils/auth";

async function getUserData(userId) {
    const { data, error } = await supabase
        .from("user")
        .select("*")
        .eq("id", userId)
        .single();

    if (error) {
        throw new Error(
            "There was an error by supabase while fetching data from DB!"
        );
    }

    return data;
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        let userId = searchParams.get("userId");

        if (!userId) {
            const user = await getUserFromToken(request);
            userId = user.userId;
        }

        if (!userId) {
            return NextResponse.json({
                success: false,
                message: "No userId was found to fetch data!",
            }, {
                status: 404,
            });
        }

        const userData = await getUserData(userId);

        return NextResponse.json({
            success: true,
            message: "User successfully fetched!",
            user: userData,
        }, { status: 200 });
    } catch (error) {
        console.error("Error while fetching user data in try-catch: ", error);
        return NextResponse.json({
            success: false,
            error: error.message,
        }, { status: 500 });
    }
}