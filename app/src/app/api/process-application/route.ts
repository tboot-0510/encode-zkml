import { NextResponse } from "next/server";
import ezkl from "@ezkljs/engine";
import { initConfig, normalizeFormData } from "./proof";

const config = await initConfig(); // comment this out to avoid loading the config

export async function POST(request: Request) {
  try {
    const data = await request.json();

    console.log("data", data);

    const { settings, model, kzg, pk } = config;

    const { account, ...formData } = data;

    const normalizedInput = normalizeFormData(formData);

    // generate the proof
    const witness = ezkl.genWitness(model, normalizedInput);

    const proof = ezkl.prove(witness, pk, model, kzg);

    console.log("proof", proof);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
