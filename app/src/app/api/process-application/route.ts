import { NextResponse } from "next/server";
import * as ezkl from "@ezkljs/engine/nodejs";
import { initConfig, normalizeFormData } from "./proof";
import { predict } from "./predict";

const config = await initConfig(); // comment this out to avoid loading the config

export async function POST(request: Request) {
  try {
    // const data = await request.json();

    const data = {
      account: "0x8b22897ABc3f204263c9eB76Dc166F52e2F01b40",
      gender: "Male",
      married: "No",
      dependents: "1",
      education: "Graduate",
      selfEmployed: "Yes",
      applicantIncome: "290909",
      coapplicantIncome: "",
      loanAmount: "2334",
      loanTerm: "11",
      creditHistory: "1",
      propertyArea: "Semiurban",
    };

    const { model, kzg, pk } = config;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { account, ...formData } = data;

    const normalizedInput = normalizeFormData(formData);
    console.log("Predicting...");
    const modelPrediction = await predict(normalizedInput);
    console.log("Model prediction", modelPrediction);

    const inputs = {
      input_shapes: [[16]], // to prove the correctness of the numbers of the inputs
      input_data: [normalizedInput], // inputs collected from the web form (private)
      output_data: [modelPrediction], // results of the model output (public)
    };

    // generate the proof
    try {
      ezkl.init_panic_hook();
      const serializedInputs = ezkl.serialize(inputs);
      console.log("serializedInputs", model);
      const witness = ezkl.genWitness(model, serializedInputs);
      console.log("witness", witness);

      const witness_ser = new Uint8ClampedArray(witness.buffer);
      console.log("witness_ser", witness_ser);

      const proof = ezkl.prove(
        witness_ser,
        new Uint8ClampedArray(pk),
        new Uint8ClampedArray(model),
        new Uint8ClampedArray(kzg)
      );

      console.log("proof", proof);
    } catch (error) {
      console.error("Error generating witness", error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
