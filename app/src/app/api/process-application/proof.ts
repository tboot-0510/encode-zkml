import * as ezkl from "@ezkljs/engine/nodejs";
import { initConfig } from "./preprocessing";

const config = await initConfig();

export const generateProof = async (
  normInputs: number[],
  modelPrediction: number
) => {
  // generate the proof
  try {
    const inputs = {
      input_shapes: [[16]], // to prove the correctness of the numbers of the inputs
      input_data: [normInputs], // inputs collected from the web form (private)
      output_data: [[modelPrediction]], // results of the model output (public)
    };

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

    // TODO: send a blockchain transaction to the contract

    return {proof, witness};
  } catch (error) {
    console.error("Error generating witness", error);
  }
};
