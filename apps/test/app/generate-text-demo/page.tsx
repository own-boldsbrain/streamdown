"use client";

import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { useState } from "react";
import { Streamdown } from "streamdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function GenerateTextDemo() {
  const [prompt, setPrompt] = useState("Invent a new holiday and describe its traditions in Markdown format.");
  const [generatedText, setGeneratedText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt,
      });
      setGeneratedText(text);
    } catch {
      setGeneratedText("Error generating text. Please check the console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <h1 className="font-bold text-2xl">Generate Text Demo with Streamdown</h1>
      <p>This demo uses <code>generateText()</code> to generate Markdown content and renders it with Streamdown.</p>

      <div className="space-y-2">
        <label className="block font-medium text-sm" htmlFor="prompt">Prompt:</label>
        <Textarea
          id="prompt"
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a prompt for generating text..."
          rows={4}
          value={prompt}
        />
      </div>

      <Button disabled={loading} onClick={handleGenerate}>
        {loading ? "Generating..." : "Generate Text"}
      </Button>

      {generatedText && (
        <div className="space-y-2">
          <h2 className="font-semibold text-xl">Generated Text (Raw):</h2>
          <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">{generatedText}</pre>

          <h2 className="text-xl font-semibold">Rendered with Streamdown:</h2>
          <div className="border p-4 rounded">
            <Streamdown>{generatedText}</Streamdown>
          </div>
        </div>
      )}
    </div>
  );
}