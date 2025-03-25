import { NextResponse } from "next/server";
import * as ezkl from "@ezkljs/engine/nodejs";
import { initConfig, normalizeFormData } from "./preprocessing";
import { predict } from "./predict";

const config = await initConfig();

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { account, ...formData } = data;

    const normalizedInput = normalizeFormData(formData);
    console.log("Predicting...");
    const modelPrediction = await predict(normalizedInput);
    console.log("Predicting... done");

    const inputs = {
      input_shapes: [[16]], // to prove the correctness of the numbers of the inputs
      input_data: [normalizedInput], // inputs collected from the web form (private)
      output_data: [[Number(modelPrediction[0])]], // results of the model output (public)
    };

    // generate the proof
    try {
      ezkl.init_panic_hook();
      const serializedInputs = ezkl.serialize(inputs);
      const witness = ezkl.genWitness(config.model, serializedInputs);
      const witness_ser = new Uint8ClampedArray(witness.buffer);

      console.log("Generating proof...");
      const proof = ezkl.prove(
        witness_ser,
        new Uint8ClampedArray(config.pk),
        new Uint8ClampedArray(config.model),
        new Uint8ClampedArray(config.kzg)
      );
      console.log("Generating proof done");

      console.log("proof", proof);
      // TODO: send a blockchain transaction to the contract

      return NextResponse.json({
        success: true,
        data: {
          proof,
          model_prediction: Number(modelPrediction[0]),
        },
      });
    } catch (error) {
      console.error("Error generating witness", error);
    }
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
