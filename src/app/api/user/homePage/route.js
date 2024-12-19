import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getUserFromToken } from "@/utils/auth";
import client from "@/lib/db";

async function getIncidents(page = 1, limit = 6, userId) {
  const offset = (page - 1) * limit;
  const cacheKey = `incidents:${userId}:${offset}:${limit}`;

  const cachedData = await client.get(cacheKey);

  if (cachedData) {
    console.log("Used cached Data");
    return JSON.parse(cachedData);
  }

  console.log("Used fresh Data");

  const { data, error, count } = await supabase
    .from("incident")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .neq("user_id", userId)
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error("Server error by supabase");
  }

  const result = { incidents: data, total: count };

  await client.set(cacheKey, JSON.stringify(result), "EX", 60 * 30);

  return result;
}

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "6");

    const { userId } = await getUserFromToken(request);
    const { incidents, total } = await getIncidents(page, limit, userId);

    return NextResponse.json(
      {
        success: true,
        message: "Incidents fetched successfully!",
        incidents,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error from catch: ", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
