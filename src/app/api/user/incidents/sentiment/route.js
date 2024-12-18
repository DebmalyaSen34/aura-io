import { HfInference } from "@huggingface/inference";
import { NextResponse } from "next/server";

const hf = new HfInference(process.env.HUGGING_FACE_API_TOKEN);

export async function POST(request) {
  try {
    const body = await request.json();
    const { text } = body;

    const response = await hf.textClassification({
      inputs: text,
      model: "cardiffnlp/twitter-roberta-base-sentiment-latest", // Sentiment model
    });

    console.log(response);

    const negativeScore =
      response.find((r) => r.label === "negative")?.score || 0;
    const neutralScore =
      response.find((r) => r.label === "neutral")?.score || 0;
    const positiveScore =
      response.find((r) => r.label === "positive")?.score || 0;

    const aura = Math.round((positiveScore - negativeScore) * 100);

    return NextResponse.json(
      {
        success: true,
        message: "Sentiment analysis done successfully!",
        aura,
        details: {
          negativeScore,
          neutralScore,
          positiveScore,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error: ", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
