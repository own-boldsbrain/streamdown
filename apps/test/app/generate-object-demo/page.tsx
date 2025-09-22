"use client";

import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { useState } from "react";
import { Streamdown } from "streamdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";

type OutputType = "object" | "array" | "enum" | "no-schema";

export default function GenerateObjectDemo() {
  const [outputType, setOutputType] = useState<OutputType>("object");
  const [prompt, setPrompt] = useState(
    "Generate a lasagna recipe with name, ingredients, and steps."
  );
  const [generatedObject, setGeneratedObject] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      let result: { object: unknown };

      switch (outputType) {
        case "object":
          result = await generateObject({
            model: openai("gpt-4o"),
            schema: z.object({
              recipe: z.object({
                name: z.string(),
                ingredients: z.array(z.string()),
                steps: z.array(z.string()),
              }),
            }),
            prompt,
          });
          break;

        case "array":
          result = await generateObject({
            model: openai("gpt-4o"),
            output: "array",
            schema: z.object({
              name: z.string(),
              class: z.string().describe("Character class, e.g. warrior, mage, or thief."),
              description: z.string(),
            }),
            prompt: "Generate 3 hero descriptions for a fantasy role playing game.",
          });
          break;

        case "enum":
          result = await generateObject({
            model: openai("gpt-4o"),
            output: "enum",
            enum: ["action", "comedy", "drama", "horror", "sci-fi"],
            prompt: "Classify the genre of this movie plot: " +
              "\"A group of astronauts travel through a wormhole in search of a " +
              "new habitable planet for humanity.\"",
          });
          break;

        case "no-schema":
          result = await generateObject({
            model: openai("gpt-4o"),
            output: "no-schema",
            prompt,
          });
          break;

        default:
          throw new Error(`Unsupported output type: ${outputType}`);
      }

      setGeneratedObject(result.object);
    } catch {
      setGeneratedObject({ error: "Error generating object. Please check the console for details." });
    } finally {
      setLoading(false);
    }
  };

  const getPromptPlaceholder = (type: OutputType): string => {
    switch (type) {
      case "object":
        return "Generate a lasagna recipe with name, ingredients, and steps.";
      case "array":
        return "This will generate 3 hero descriptions for a fantasy RPG.";
      case "enum":
        return "Classify the genre of this movie plot: [movie plot here]";
      case "no-schema":
        return "Generate any structured data you want.";
      default:
        return "Enter a prompt...";
    }
  };

  const renderObjectAsMarkdown = (obj: unknown): string => {
    if (!obj || typeof obj !== "object") {
      return JSON.stringify(obj, null, 2);
    }

    if (Array.isArray(obj)) {
      return obj.map((item, index) => {
        if (typeof item === "object" && item !== null) {
          return `## Item ${index + 1}\n\n${Object.entries(item)
            .map(([key, value]) => `**${key}**: ${Array.isArray(value) ? value.join(", ") : String(value)}`)
            .join("\n")}`;
        }
        return `- ${String(item)}`;
      }).join("\n\n");
    }

    if (typeof obj === "string") {
      return obj;
    }

    // For regular objects
    return Object.entries(obj as Record<string, unknown>)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `## ${key}\n\n${value.map(item => `- ${String(item)}`).join("\n")}`;
        }
        if (typeof value === "object" && value !== null) {
          return `## ${key}\n\n${renderObjectAsMarkdown(value)}`;
        }
        return `**${key}**: ${String(value)}`;
      })
      .join("\n\n");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-4 p-4">
      <h1 className="font-bold text-2xl">Generate Object Demo with Streamdown</h1>
      <p>
        This demo uses <code>generateObject()</code> to generate structured data
        and renders it with Streamdown.
      </p>

      <div className="space-y-2">
        <label className="block font-medium text-sm" htmlFor="outputType">
          Output Type:
        </label>
        <Select value={outputType} onValueChange={(value: OutputType) => setOutputType(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select output type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="object">Object (with schema)</SelectItem>
            <SelectItem value="array">Array (with schema)</SelectItem>
            <SelectItem value="enum">Enum</SelectItem>
            <SelectItem value="no-schema">No Schema (free-form JSON)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="block font-medium text-sm" htmlFor="prompt">
          Prompt:
        </label>
        <Textarea
          id="prompt"
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={getPromptPlaceholder(outputType)}
          rows={4}
          value={prompt}
        />
      </div>

      <Button disabled={loading} onClick={handleGenerate}>
        {loading ? "Generating..." : "Generate Object"}
      </Button>

      {generatedObject != null && (
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="font-semibold text-xl">Generated Object (Raw JSON):</h2>
            <pre className="whitespace-pre-wrap rounded bg-gray-100 p-4 text-sm">
              {JSON.stringify(generatedObject, null, 2)}
            </pre>
          </div>

          <div className="space-y-2">
            <h2 className="font-semibold text-xl">Rendered as Markdown with Streamdown:</h2>
            <div className="rounded border p-4">
              <Streamdown>{renderObjectAsMarkdown(generatedObject)}</Streamdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}