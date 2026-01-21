import * as ort from "onnxruntime-web";

let session: ort.InferenceSession | null = null;
let metadata: ModelMetadata | null = null;

export interface ModelMetadata {
  num_classes: number;
  label_map: Record<string, number>;
  id_to_label: Record<string, string>;
  max_length: number;
  vocab_size: number;
}

export interface ClassificationResult {
  label: string;
  probability: number;
}

export async function loadModel(): Promise<void> {
  if (session) return;

  // Configure ONNX Runtime for browser
  ort.env.wasm.wasmPaths = "/";
  ort.env.logLevel = "error"; // Suppress warnings (e.g., "Unknown CPU vendor" on Apple Silicon)

  const [modelResponse, metadataResponse] = await Promise.all([
    fetch("/model/code_classifier_quantized.onnx"),
    fetch("/model/model_metadata.json"),
  ]);

  if (!modelResponse.ok) {
    throw new Error("Failed to load model. Make sure to export the model first.");
  }

  const modelBuffer = await modelResponse.arrayBuffer();
  session = await ort.InferenceSession.create(modelBuffer, {
    executionProviders: ["wasm"],
  });

  metadata = await metadataResponse.json();
}

export function getMetadata(): ModelMetadata | null {
  return metadata;
}

function softmax(logits: Float32Array): number[] {
  const maxLogit = Math.max(...logits);
  const exps = Array.from(logits).map((l) => Math.exp(l - maxLogit));
  const sumExps = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sumExps);
}

export async function classify(
  tokenIds: number[],
  attentionMask: number[]
): Promise<ClassificationResult[]> {
  if (!session || !metadata) {
    throw new Error("Model not loaded. Call loadModel() first.");
  }

  const maxLength = metadata.max_length;

  // Pad or truncate
  const paddedIds = tokenIds.slice(0, maxLength);
  const paddedMask = attentionMask.slice(0, maxLength);

  while (paddedIds.length < maxLength) {
    paddedIds.push(0); // PAD token
    paddedMask.push(0);
  }

  const inputIdsTensor = new ort.Tensor(
    "int64",
    BigInt64Array.from(paddedIds.map(BigInt)),
    [1, maxLength]
  );

  const attentionMaskTensor = new ort.Tensor(
    "int64",
    BigInt64Array.from(paddedMask.map(BigInt)),
    [1, maxLength]
  );

  const results = await session.run({
    input_ids: inputIdsTensor,
    attention_mask: attentionMaskTensor,
  });

  const logits = results.logits.data as Float32Array;
  const probabilities = softmax(logits);

  // Create results array with all languages
  const allResults: ClassificationResult[] = probabilities.map((prob, idx) => ({
    label: metadata!.id_to_label[idx.toString()] || `Unknown_${idx}`,
    probability: prob,
  }));

  // Sort by probability descending
  allResults.sort((a, b) => b.probability - a.probability);

  return allResults;
}

export async function classifyCode(code: string, tokenize: (text: string) => number[]): Promise<ClassificationResult[]> {
  const tokenIds = tokenize(code);
  const attentionMask = tokenIds.map(() => 1);
  return classify(tokenIds, attentionMask);
}
