# Code Labeler

https://github.com/user-attachments/assets/cbee1179-9c14-462b-961a-a54a33358ae3

A Next.js web application that identifies programming languages using an AI model running entirely in your browser.

## Features

- **30 Language Support**: Detects Assembly, C, C++, C#, CSS, Go, HTML, Java, JavaScript, Python, Rust, TypeScript, and more
- **Privacy-First**: All inference runs locally in your browser - no code is sent to any server
- **Real-time Results**: See probability percentages for all supported languages
- **Fast**: Quantized ONNX model for efficient browser inference

## Prerequisites

1. Trained code classifier model from the `language-model` repo
2. Node.js 18+

## Setup

### 1. Export the trained model

First, ensure you have a trained model in the `language-model` repo:

```bash
cd ../language-model
python scripts/train_code_classifier.py
```

Then export to ONNX format:

```bash
python scripts/export_onnx.py
```

### 2. Copy model files

Run the setup script to copy model files:

```bash
./scripts/setup-model.sh
```

Or manually copy these files to `public/model/`:
- `code_classifier_quantized.onnx` - The quantized ONNX model
- `model_metadata.json` - Label mappings and config
- `tokenizer.json` - The tokenizer vocabulary

### 3. Install dependencies

```bash
npm install
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the app.

## Deployment to Vercel

1. Push this repo to GitHub
2. Connect to Vercel
3. Ensure `public/model/` contains the model files before deploying

**Note**: Model files are ~15-30MB and will be served as static assets.

## Project Structure

```
code-labeler/
├── public/
│   └── model/
│       ├── code_classifier_quantized.onnx
│       ├── model_metadata.json
│       └── tokenizer.json
├── src/
│   ├── app/
│   │   └── page.tsx          # Main UI
│   └── lib/
│       ├── classifier.ts     # ONNX model inference
│       └── tokenizer.ts      # BPE tokenization
└── scripts/
    └── setup-model.sh        # Model file setup
```

## Supported Languages

Assembly, Batchfile, C, C#, C++, CMake, CSS, Dockerfile, FORTRAN, Go, HTML, Haskell, Java, JavaScript, Julia, Lua, Makefile, Markdown, PHP, Perl, PowerShell, Python, Ruby, Rust, SQL, Scala, Shell, TeX, TypeScript, Visual Basic
