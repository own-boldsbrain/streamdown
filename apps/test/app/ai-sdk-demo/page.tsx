"use client";

import {
  cosineSimilarity,
  generateId,
  getModel,
  listAvailableModels,
} from "@streamdown/ai-sdk-core";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AISDKDemo() {
  const [response, setResponse] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [availableModels, setAvailableModels] = useState<
    Record<string, string[]>
  >({});

  const handleUtilityDemo = () => {
    const id1 = generateId();
    const id2 = generateId();
    const similarity = cosineSimilarity([1, 0, 0], [0, 1, 0]);

    setResponse(
      `Generated IDs:\n- ${id1}\n- ${id2}\n\nCosine similarity between [1,0,0] and [0,1,0]: ${similarity}`
    );
  };

  const handleRegistryDemo = () => {
    const models = listAvailableModels();
    setAvailableModels(models);
    setResponse(
      `Available providers and models:\n${JSON.stringify(models, null, 2)}`
    );
  };

  const handleModelDemo = () => {
    if (!selectedProvider) {
      return;
    }
    if (!selectedModel) {
      setResponse("Please select a model");
      return;
    }

    try {
      getModel(selectedProvider, selectedModel);
      setResponse(
        `Successfully loaded model: ${selectedProvider}/${selectedModel}\nModel loaded successfully!`
      );
    } catch (error) {
      setResponse(`Error loading model: ${(error as Error).message}`);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="mb-8">
        <h1 className="mb-2 font-bold text-3xl">AI SDK Core Demo</h1>
        <p className="text-gray-600">
          Demonstration of the AI SDK Core implementation with providers and
          registry.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Utility Functions Demo</CardTitle>
            <CardDescription>
              Test utility functions like ID generation and vector similarity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleUtilityDemo}>Run Utility Demo</Button>

            <pre className="min-h-32 whitespace-pre-wrap rounded bg-gray-50 p-4 text-sm">
              {response || "Click the button to see utility function results!"}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Provider Registry Demo</CardTitle>
            <CardDescription>
              Explore available providers and models
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleRegistryDemo}>List Available Models</Button>

            <div className="space-y-2">
              <Label htmlFor="provider">Provider</Label>
              <Select
                onValueChange={setSelectedProvider}
                value={selectedProvider}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(availableModels).map((provider) => (
                    <SelectItem key={provider} value={provider}>
                      {provider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Select onValueChange={setSelectedModel} value={selectedModel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {selectedProvider &&
                    availableModels[selectedProvider]?.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              disabled={!(selectedProvider && selectedModel)}
              onClick={handleModelDemo}
            >
              Load Model
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Available Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-inside list-disc space-y-1 text-sm">
              <li>
                <strong>generateText:</strong> Basic text generation with
                language models
              </li>
              <li>
                <strong>streamText:</strong> Streaming text generation with
                real-time chunks
              </li>
              <li>
                <strong>generateObject:</strong> Structured data generation with
                schema validation
              </li>
              <li>
                <strong>embed/embedMany:</strong> Single and batch embedding
                generation
              </li>
              <li>
                <strong>tool():</strong> Tool definition helper for function
                calling
              </li>
              <li>
                <strong>Provider Registry:</strong> Easy access to OpenAI and
                mock providers
              </li>
              <li>
                <strong>Utility functions:</strong> ID generation, vector
                similarity, middleware
              </li>
              <li>
                <strong>Experimental features:</strong> Image generation, speech
                synthesis, transcription
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
