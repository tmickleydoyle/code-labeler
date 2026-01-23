"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  testCases,
  languages,
  tiers,
  tierLabels,
  tierDescriptions,
  tierColors,
  groupByLanguage,
  getStats,
  Tier,
  TestCase,
} from "@/lib/evalData";

// Code block component with syntax highlighting styling
function CodeBlock({ code, language }: { code: string; language: string }) {
  return (
    <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5 bg-gray-800 border-b border-gray-700">
        <span className="text-xs text-gray-400">{language}</span>
        <button
          onClick={() => navigator.clipboard.writeText(code)}
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          Copy
        </button>
      </div>
      <pre className="p-3 text-sm overflow-x-auto">
        <code className="text-gray-200 font-mono whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}

// Tier badge component
function TierBadge({ tier }: { tier: Tier }) {
  return (
    <span
      className={`px-2 py-0.5 text-xs font-medium rounded border ${tierColors[tier]}`}
    >
      {tierLabels[tier]}
    </span>
  );
}

// Test card component
function TestCard({ test }: { test: TestCase }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const codePreview =
    test.code.length > 100 ? test.code.slice(0, 100) + "..." : test.code;

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:border-gray-600 transition-colors">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left p-4 flex items-start justify-between gap-4"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-white">{test.id}</span>
            <TierBadge tier={test.tier} />
          </div>
          <p className="text-sm text-gray-400 mt-1 truncate">
            {test.description}
          </p>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isExpanded && (
        <div className="px-4 pb-4">
          <CodeBlock code={test.code} language={test.language} />
        </div>
      )}
      {!isExpanded && (
        <div className="px-4 pb-4">
          <pre className="text-xs text-gray-500 font-mono truncate">
            {codePreview}
          </pre>
        </div>
      )}
    </div>
  );
}

// Language section component
function LanguageSection({
  language,
  tests,
  defaultExpanded = false,
}: {
  language: string;
  tests: TestCase[];
  defaultExpanded?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 bg-gray-800 hover:bg-gray-750 transition-colors flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-white">{language}</span>
          <span className="text-sm text-gray-400">
            {tests.length} test{tests.length !== 1 ? "s" : ""}
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isExpanded && (
        <div className="p-4 space-y-3 bg-gray-850">
          {tests.map((test) => (
            <TestCard key={test.id} test={test} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function EvalsPage() {
  const [filterLanguage, setFilterLanguage] = useState<string>("all");
  const [filterTier, setFilterTier] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const stats = getStats();
  const grouped = groupByLanguage();

  // Filter tests based on selections
  const filteredTests = useMemo(() => {
    return testCases.filter((test) => {
      const matchesLanguage =
        filterLanguage === "all" || test.language === filterLanguage;
      const matchesTier = filterTier === "all" || test.tier === filterTier;
      const matchesSearch =
        searchQuery === "" ||
        test.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.code.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesLanguage && matchesTier && matchesSearch;
    });
  }, [filterLanguage, filterTier, searchQuery]);

  // Group filtered tests by language
  const filteredGrouped = useMemo(() => {
    return filteredTests.reduce(
      (acc, test) => {
        if (!acc[test.language]) {
          acc[test.language] = [];
        }
        acc[test.language].push(test);
        return acc;
      },
      {} as Record<string, TestCase[]>
    );
  }, [filteredTests]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <header className="text-center mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Classifier
          </Link>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Evaluation Suite
          </h1>
          <p className="text-gray-400 text-lg">
            Testing the classifier across {stats.languages} languages
          </p>
          <p className="text-gray-500 text-sm mt-2">
            {stats.total} test cases across {tiers.length} difficulty tiers
          </p>
        </header>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {tiers.map((tier) => (
            <div
              key={tier}
              className={`p-4 rounded-lg border ${tierColors[tier].replace("text-", "border-").split(" ")[2]} bg-gray-800/50`}
            >
              <div className="text-2xl font-bold text-white">
                {stats.byTier[tier]}
              </div>
              <div className={`text-sm ${tierColors[tier].split(" ")[1]}`}>
                {tierLabels[tier]}
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-8">
          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs text-gray-400 mb-1">Search</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tests..."
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Language Filter */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Language
              </label>
              <select
                value={filterLanguage}
                onChange={(e) => setFilterLanguage(e.target.value)}
                className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Languages</option>
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang} ({grouped[lang]?.length || 0})
                  </option>
                ))}
              </select>
            </div>

            {/* Tier Filter */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Difficulty
              </label>
              <select
                value={filterTier}
                onChange={(e) => setFilterTier(e.target.value)}
                className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Tiers</option>
                {tiers.map((tier) => (
                  <option key={tier} value={tier}>
                    {tierLabels[tier]} ({stats.byTier[tier]})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-3 text-sm text-gray-400">
            Showing {filteredTests.length} of {stats.total} tests
          </div>
        </div>

        {/* Test Cases */}
        <div className="space-y-4 mb-12">
          {Object.keys(filteredGrouped)
            .sort()
            .map((language) => (
              <LanguageSection
                key={language}
                language={language}
                tests={filteredGrouped[language]}
                defaultExpanded={filterLanguage !== "all"}
              />
            ))}

          {filteredTests.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              No tests match your filters.
            </div>
          )}
        </div>

        {/* Tier Explanations */}
        <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-500/50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Difficulty Tiers Explained
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {tiers.map((tier) => (
              <div key={tier} className="flex items-start gap-3">
                <TierBadge tier={tier} />
                <p className="text-sm text-gray-300">{tierDescriptions[tier]}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>
            These test cases evaluate the classifier&apos;s ability to identify
            programming languages
          </p>
          <p className="mt-1">
            from clear examples to intentionally ambiguous code snippets
          </p>
        </footer>
      </div>
    </div>
  );
}
