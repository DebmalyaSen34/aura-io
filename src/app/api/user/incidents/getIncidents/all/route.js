import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

async function getIncidents(page = 1, limit = 12) {
  const offset = (page - 1) * limit;

  const { data, error, count } = await supabase
    .from("incident")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error("Server error by supabase");
  }
  return { incidents: data, total: count };
}

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "12");

    const { incidents, total } = await getIncidents(page, limit);

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
    console.error("Error: ", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
