#!/bin/bash
# Setup script to copy model files from language-model repo

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
LANGUAGE_MODEL_DIR="${PROJECT_ROOT}/../language-model"
MODEL_OUTPUT_DIR="${PROJECT_ROOT}/public/model"

echo "Setting up Code Labeler model files..."
echo ""

# Check if language-model repo exists
if [ ! -d "$LANGUAGE_MODEL_DIR" ]; then
    echo "Error: language-model repo not found at $LANGUAGE_MODEL_DIR"
    echo "Please ensure the language-model repo is cloned alongside this repo."
    exit 1
fi

# Check if model has been trained
CHECKPOINT_PATH="${LANGUAGE_MODEL_DIR}/code_classifier_model/best_model.pth"
if [ ! -f "$CHECKPOINT_PATH" ]; then
    echo "Error: Trained model not found at $CHECKPOINT_PATH"
    echo "Please train the model first:"
    echo "  cd $LANGUAGE_MODEL_DIR"
    echo "  python scripts/train_code_classifier.py"
    exit 1
fi

# Export to ONNX if not already done
ONNX_DIR="${LANGUAGE_MODEL_DIR}/onnx_export"
ONNX_MODEL="${ONNX_DIR}/code_classifier_quantized.onnx"

if [ ! -f "$ONNX_MODEL" ]; then
    echo "Exporting model to ONNX format..."
    cd "$LANGUAGE_MODEL_DIR"
    python scripts/export_onnx.py
    echo ""
fi

# Create output directory
mkdir -p "$MODEL_OUTPUT_DIR"

# Copy model files
echo "Copying model files to $MODEL_OUTPUT_DIR..."

cp "${ONNX_DIR}/code_classifier_quantized.onnx" "$MODEL_OUTPUT_DIR/"
cp "${ONNX_DIR}/model_metadata.json" "$MODEL_OUTPUT_DIR/"
cp "${LANGUAGE_MODEL_DIR}/models/tokenizer_instruct/tokenizer.json" "$MODEL_OUTPUT_DIR/"

echo ""
echo "Model files copied successfully!"
echo ""
echo "Files in $MODEL_OUTPUT_DIR:"
ls -lh "$MODEL_OUTPUT_DIR"
echo ""
echo "You can now run the app:"
echo "  npm run dev"
