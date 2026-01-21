"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Editor, { BeforeMount, OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { loadModel, classifyCode, ClassificationResult, getMetadata } from "@/lib/classifier";
import { loadTokenizer, encode, encodeWithSpans, TokenSpan } from "@/lib/tokenizer";

// Token highlight colors - cycling palette matching the app theme
const TOKEN_COLORS = [
  "#60a5fa", // blue-400
  "#a78bfa", // purple-400
  "#34d399", // emerald-400
  "#fbbf24", // amber-400
  "#f87171", // red-400
  "#2dd4bf", // teal-400
  "#f472b6", // pink-400
  "#a3e635", // lime-400
];

// Inject CSS for token highlighting
const injectTokenStyles = () => {
  const styleId = "token-highlight-styles";
  if (document.getElementById(styleId)) return;

  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = TOKEN_COLORS.map(
    (color, idx) => `
      .token-highlight-${idx} {
        background-color: ${color}40 !important;
        border-bottom: 2px solid ${color} !important;
        border-radius: 2px;
      }
    `
  ).join("\n");
  document.head.appendChild(style);
};

const handleEditorWillMount: BeforeMount = (monaco) => {
  injectTokenStyles();
  monaco.editor.defineTheme("app-dark", {
    base: "vs-dark",
    inherit: false,
    rules: [
      { token: "", foreground: "f3f4f6", background: "1f2937" },
      { token: "comment", foreground: "6b7280", fontStyle: "italic" },
      { token: "keyword", foreground: "a78bfa" },
      { token: "string", foreground: "86efac" },
      { token: "number", foreground: "fcd34d" },
      { token: "type", foreground: "60a5fa" },
      { token: "class", foreground: "60a5fa" },
      { token: "function", foreground: "93c5fd" },
      { token: "variable", foreground: "f3f4f6" },
      { token: "operator", foreground: "d1d5db" },
      { token: "delimiter", foreground: "9ca3af" },
    ],
    colors: {
      "editor.background": "#1f2937",
      "editor.foreground": "#f3f4f6",
      "editor.lineHighlightBackground": "#374151",
      "editor.selectionBackground": "#4b556380",
      "editor.inactiveSelectionBackground": "#37415180",
      "editorLineNumber.foreground": "#6b7280",
      "editorLineNumber.activeForeground": "#9ca3af",
      "editorCursor.foreground": "#60a5fa",
      "editorWhitespace.foreground": "#4b5563",
      "editorIndentGuide.background": "#374151",
      "editorIndentGuide.activeBackground": "#4b5563",
      "editor.selectionHighlightBackground": "#60a5fa30",
      "editorBracketMatch.background": "#60a5fa40",
      "editorBracketMatch.border": "#60a5fa",
      "scrollbarSlider.background": "#37415180",
      "scrollbarSlider.hoverBackground": "#4b5563",
      "scrollbarSlider.activeBackground": "#6b7280",
    },
  });
};

export default function Home() {
  const [code, setCode] = useState("");
  const [results, setResults] = useState<ClassificationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingStatus, setLoadingStatus] = useState("Loading model...");
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const decorationsRef = useRef<string[]>([]);

  // Compute token spans when code changes
  const tokenSpans = useMemo((): TokenSpan[] => {
    if (!code.trim() || !isModelLoaded) return [];
    try {
      return encodeWithSpans(code);
    } catch {
      return [];
    }
  }, [code, isModelLoaded]);

  // Handle editor mount
  const handleEditorDidMount: OnMount = useCallback((editor) => {
    editorRef.current = editor;
  }, []);

  // Apply token decorations to the editor
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    if (tokenSpans.length === 0) {
      // Clear decorations
      decorationsRef.current = editor.deltaDecorations(decorationsRef.current, []);
      return;
    }

    const model = editor.getModel();
    if (!model) return;

    // Convert character offsets to Monaco positions
    const decorations: editor.IModelDeltaDecoration[] = tokenSpans.map((span, idx) => {
      const startPos = model.getPositionAt(span.start);
      const endPos = model.getPositionAt(span.end);
      const colorIdx = idx % TOKEN_COLORS.length;

      return {
        range: {
          startLineNumber: startPos.lineNumber,
          startColumn: startPos.column,
          endLineNumber: endPos.lineNumber,
          endColumn: endPos.column,
        },
        options: {
          inlineClassName: `token-highlight-${colorIdx}`,
          hoverMessage: { value: `Token #${idx + 1} (ID: ${span.tokenId})` },
        },
      };
    });

    decorationsRef.current = editor.deltaDecorations(decorationsRef.current, decorations);
  }, [tokenSpans]);

  useEffect(() => {
    const init = async () => {
      try {
        setLoadingStatus("Loading tokenizer...");
        await loadTokenizer();
        setLoadingStatus("Loading model...");
        await loadModel();
        setIsModelLoaded(true);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load model"
        );
      }
    };
    init();
  }, []);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!code.trim() || !isModelLoaded) {
      setResults([]);
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      setError(null);

      try {
        const predictions = await classifyCode(code, encode);
        setResults(predictions);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Classification failed");
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [code, isModelLoaded]);

  const topLanguage = results.length > 0 ? results[0] : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Code Language Classifier
          </h1>
          <p className="text-gray-400 text-lg">
            Powered by a 12M parameter model trained from scratch for this task
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Model is still training — this is the checkpoint after epoch 2
          </p>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {!isModelLoaded && !error && (
          <div className="mb-6 p-4 bg-blue-900/50 border border-blue-500 rounded-lg text-blue-200 text-center">
            <div className="animate-pulse">{loadingStatus}</div>
            <p className="text-sm mt-2 text-blue-300">
              First load may take a moment to download the model (~15MB)
            </p>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Input Section */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-4">
              Type your code <span className="text-gray-500">({code.length}/1000 chars{tokenSpans.length > 0 && `, ${tokenSpans.length} tokens`})</span>
            </label>
            <div
              className="w-full rounded-lg overflow-hidden border border-gray-700"
              style={{ height: "464px" }}
            >
              <Editor
                height="464px"
                defaultLanguage="plaintext"
                theme="app-dark"
                value={code}
                onChange={(value) => setCode((value || "").slice(0, 1000))}
                beforeMount={handleEditorWillMount}
                onMount={handleEditorDidMount}
                loading={
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500">
                    Loading editor...
                  </div>
                }
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  readOnly: !isModelLoaded,
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                  lineNumbers: "on",
                  renderLineHighlight: "none",
                  padding: { top: 16, bottom: 16 },
                  placeholder: "// Type code here...",
                }}
              />
            </div>

            {isLoading && (
              <div className="flex items-center justify-center gap-2 text-gray-400">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Analyzing...
              </div>
            )}
          </div>

          {/* Results Section */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-4">
              Language Predictions
            </label>

            {/* Top Prediction Card - always rendered with fixed height */}
            <div className="p-6 bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-500/50 rounded-lg h-[120px] mb-4">
              {topLanguage ? (
                <>
                  <div className="text-sm text-gray-400 mb-1">Top Prediction</div>
                  <div className="text-3xl font-bold text-white">
                    {topLanguage.label}
                  </div>
                  <div className="text-xl text-blue-400">
                    {(topLanguage.probability * 100).toFixed(1)}% confidence
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-700/50 rounded animate-pulse" />
                  <div className="h-8 w-32 bg-gray-700/50 rounded animate-pulse" />
                  <div className="h-6 w-40 bg-gray-700/50 rounded animate-pulse" />
                </div>
              )}
            </div>

            {/* Results List - always rendered with fixed height */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 h-80 overflow-y-auto">
              {results.length === 0 ? (
                <div className="space-y-3">
                  {[80, 65, 90, 70, 85, 75, 68].map((width, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between">
                        <div className="h-4 bg-gray-700/50 rounded animate-pulse" style={{ width: `${width}px` }} />
                        <div className="h-4 w-12 bg-gray-700/50 rounded animate-pulse" />
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gray-600/50 rounded-full animate-pulse"
                          style={{ width: `${idx === 0 ? 80 : [12, 8, 10, 6, 4, 3][idx - 1]}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {results.map((result, idx) => (
                    <div key={result.label} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className={idx === 0 ? "text-white font-semibold" : "text-gray-400"}>
                          {result.label}
                        </span>
                        <span className={idx === 0 ? "text-blue-400 font-semibold" : "text-gray-500"}>
                          {(result.probability * 100).toFixed(2)}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            idx === 0
                              ? "bg-gradient-to-r from-blue-500 to-purple-500"
                              : "bg-gray-600"
                          }`}
                          style={{ width: `${Math.max(result.probability * 100, 0.5)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>
            Powered by a {getMetadata()?.num_classes || 30}-language neural network classifier
          </p>
          <p className="mt-1">
            Model runs entirely in your browser - no code is sent to any server
          </p>
        </footer>
      </div>
    </div>
  );
}
