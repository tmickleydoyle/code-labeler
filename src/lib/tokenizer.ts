/**
 * BPE tokenizer for browser use with GPT-2 byte-level encoding.
 * Loads the HuggingFace tokenizer.json format.
 */

export interface TokenSpan {
  text: string;
  tokenId: number;
  start: number;
  end: number;
}

interface TokenizerModel {
  vocab: Record<string, number>;
  merges: [string, string][];
}

interface TokenizerConfig {
  model: TokenizerModel;
  added_tokens: Array<{ id: number; content: string }>;
}

let tokenizer: Tokenizer | null = null;

// GPT-2 byte-to-unicode mapping
function bytesToUnicode(): Map<number, string> {
  const bs: number[] = [];
  const cs: number[] = [];

  // Printable ASCII and extended characters that map to themselves
  for (let i = 33; i <= 126; i++) bs.push(i); // '!' to '~'
  for (let i = 161; i <= 172; i++) bs.push(i); // '¡' to '¬'
  for (let i = 174; i <= 255; i++) bs.push(i); // '®' to 'ÿ'

  cs.push(...bs);

  // Map remaining bytes (0-32, 127-160, 173) to higher unicode points
  let n = 0;
  for (let b = 0; b < 256; b++) {
    if (!bs.includes(b)) {
      bs.push(b);
      cs.push(256 + n);
      n++;
    }
  }

  const result = new Map<number, string>();
  for (let i = 0; i < bs.length; i++) {
    result.set(bs[i], String.fromCharCode(cs[i]));
  }
  return result;
}

const BYTE_TO_UNICODE = bytesToUnicode();
const UNICODE_TO_BYTE = new Map<string, number>(
  Array.from(BYTE_TO_UNICODE.entries()).map(([k, v]) => [v, k])
);

class Tokenizer {
  private vocab: Map<string, number>;
  private merges: Map<string, string>;
  private mergeRanks: Map<string, number>;
  private encoder: Map<string, number>;
  private decoder: Map<number, string>;

  public PAD_TOKEN_ID = 0;
  public UNK_TOKEN_ID = 1;
  public BOS_TOKEN_ID = 2;
  public EOS_TOKEN_ID = 3;

  constructor(config: TokenizerConfig) {
    this.vocab = new Map(Object.entries(config.model.vocab));
    this.encoder = new Map(Object.entries(config.model.vocab));
    this.decoder = new Map(
      Object.entries(config.model.vocab).map(([k, v]) => [v, k])
    );

    // Parse merges with ranks (order matters for BPE)
    this.merges = new Map();
    this.mergeRanks = new Map();
    for (let i = 0; i < config.model.merges.length; i++) {
      const [a, b] = config.model.merges[i];
      const pair = `${a} ${b}`;
      this.merges.set(pair, a + b);
      this.mergeRanks.set(pair, i); // Lower rank = higher priority
    }

    // Update special token IDs from added_tokens
    for (const token of config.added_tokens) {
      if (token.content === "<pad>") this.PAD_TOKEN_ID = token.id;
      if (token.content === "<unk>") this.UNK_TOKEN_ID = token.id;
      if (token.content === "<bos>") this.BOS_TOKEN_ID = token.id;
      if (token.content === "<eos>") this.EOS_TOKEN_ID = token.id;
    }
  }

  private textToBytes(text: string): string {
    // Convert text to GPT-2 byte-level encoding
    const bytes = new TextEncoder().encode(text);
    let result = "";
    for (const byte of bytes) {
      result += BYTE_TO_UNICODE.get(byte) ?? "";
    }
    return result;
  }

  private applyBPE(word: string): string[] {
    if (word.length <= 1) return [word];

    let tokens = word.split("");

    while (tokens.length > 1) {
      // Find the pair with the lowest merge rank
      let bestPair: [number, string] | null = null;
      let bestRank = Infinity;

      for (let i = 0; i < tokens.length - 1; i++) {
        const pair = `${tokens[i]} ${tokens[i + 1]}`;
        const rank = this.mergeRanks.get(pair);
        if (rank !== undefined && rank < bestRank) {
          bestRank = rank;
          bestPair = [i, this.merges.get(pair)!];
        }
      }

      if (bestPair === null) break;

      const [idx, merged] = bestPair;
      tokens = [...tokens.slice(0, idx), merged, ...tokens.slice(idx + 2)];
    }

    return tokens;
  }

  encode(text: string): number[] {
    if (!text) return [];

    // GPT-2 style: split on whitespace but keep the space as prefix of next word
    // Use regex to split while preserving spaces as part of tokens
    const pattern = /'s|'t|'re|'ve|'m|'ll|'d| ?\p{L}+| ?\p{N}+| ?[^\s\p{L}\p{N}]+|\s+/gu;
    const matches = text.match(pattern) || [];

    const allTokens: number[] = [];

    for (const word of matches) {
      // Convert to byte-level encoding
      const byteWord = this.textToBytes(word);

      // Apply BPE
      const bpeTokens = this.applyBPE(byteWord);

      for (const token of bpeTokens) {
        const id = this.encoder.get(token);
        if (id !== undefined) {
          allTokens.push(id);
        } else {
          // Fallback: encode each character separately
          for (const char of token) {
            const charId = this.encoder.get(char);
            allTokens.push(charId ?? this.UNK_TOKEN_ID);
          }
        }
      }
    }

    return allTokens;
  }

  decode(tokenIds: number[]): string {
    const tokens = tokenIds
      .filter(
        (id) =>
          ![this.PAD_TOKEN_ID, this.BOS_TOKEN_ID, this.EOS_TOKEN_ID].includes(
            id
          )
      )
      .map((id) => this.decoder.get(id) ?? "")
      .join("");

    // Convert from byte-level encoding back to text
    const bytes: number[] = [];
    for (const char of tokens) {
      const byte = UNICODE_TO_BYTE.get(char);
      if (byte !== undefined) {
        bytes.push(byte);
      }
    }

    try {
      return new TextDecoder().decode(new Uint8Array(bytes));
    } catch {
      return tokens;
    }
  }

  encodeWithSpans(text: string): TokenSpan[] {
    if (!text) return [];

    const spans: TokenSpan[] = [];
    const pattern = /'s|'t|'re|'ve|'m|'ll|'d| ?\p{L}+| ?\p{N}+| ?[^\s\p{L}\p{N}]+|\s+/gu;

    let match;
    while ((match = pattern.exec(text)) !== null) {
      const word = match[0];
      const wordStart = match.index;

      const byteWord = this.textToBytes(word);
      const bpeTokens = this.applyBPE(byteWord);

      let offset = 0;
      for (const token of bpeTokens) {
        const id = this.encoder.get(token) ?? this.UNK_TOKEN_ID;

        // Calculate the actual text length for this token
        const bytes: number[] = [];
        for (const char of token) {
          const byte = UNICODE_TO_BYTE.get(char);
          if (byte !== undefined) bytes.push(byte);
        }
        let tokenText: string;
        try {
          tokenText = new TextDecoder().decode(new Uint8Array(bytes));
        } catch {
          tokenText = token;
        }

        spans.push({
          text: tokenText,
          tokenId: id,
          start: wordStart + offset,
          end: wordStart + offset + tokenText.length,
        });

        offset += tokenText.length;
      }
    }

    return spans;
  }
}

export async function loadTokenizer(): Promise<void> {
  if (tokenizer) return;

  const response = await fetch("/model/tokenizer.json");
  if (!response.ok) {
    throw new Error("Failed to load tokenizer");
  }

  const config = await response.json();
  tokenizer = new Tokenizer(config);
}

export function encode(text: string): number[] {
  if (!tokenizer) {
    throw new Error("Tokenizer not loaded. Call loadTokenizer() first.");
  }
  return tokenizer.encode(text);
}

export function decode(tokenIds: number[]): string {
  if (!tokenizer) {
    throw new Error("Tokenizer not loaded. Call loadTokenizer() first.");
  }
  return tokenizer.decode(tokenIds);
}

export function getTokenizer(): Tokenizer | null {
  return tokenizer;
}

export function encodeWithSpans(text: string): TokenSpan[] {
  if (!tokenizer) {
    throw new Error("Tokenizer not loaded. Call loadTokenizer() first.");
  }
  return tokenizer.encodeWithSpans(text);
}
