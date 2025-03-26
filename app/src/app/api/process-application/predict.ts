import path from "path";
import * as ort from "onnxruntime-node";

export const predict = async (inputs: number[]) => {
  try {
    const modelPath = path.join(
      __dirname,
      "../../../../../../model/network.onnx"
    );
    const session = await ort.InferenceSession.create(modelPath);

    const data = Float32Array.from(inputs);
    const tensor = new ort.Tensor("float32", data, [1, 16]);

    const feeds = {
      input: tensor,
    };

    const result = await session.run(feeds);
    return result.output.data;
  } catch (error: unknown) {
    console.error(error);
    throw error;
  }
};
