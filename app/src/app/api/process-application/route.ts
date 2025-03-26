import { NextResponse } from "next/server";
import { normalizeFormData } from "./preprocessing";
import { predict } from "./predict";
import { generateProof } from "./proof";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { account, ...formData } = data;

    const normalizedInput = normalizeFormData(formData);
    console.log("Predicting...");
    const modelPrediction = await predict(normalizedInput);
    console.log("Predicting... done");

    const proof = await generateProof(
      normalizedInput,
      Number(modelPrediction[0])
    );

    return NextResponse.json({
      success: true,
      data: {
        proof,
        model_prediction: Number(modelPrediction[0]),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
