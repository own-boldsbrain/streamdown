"use client";

import { useState } from "react";
import { generateId, cosineSimilarity } from "@streamdown/ai-sdk-core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AISDKDemo() {
  const [response, setResponse] = useState("");

  const handleUtilityDemo = () => {
    const id1 = generateId();
    const id2 = generateId();
    const similarity = cosineSimilarity([1, 0, 0], [0, 1, 0]);

    setResponse(`Generated IDs:\n- ${id1}\n- ${id2}\n\nCosine similarity between [1,0,0] and [0,1,0]: ${similarity}`);
  };

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="mb-8">
        <h1 className="mb-2 font-bold text-3xl">AI SDK Core Demo</h1>
        <p className="text-gray-600">
          Demonstration of the AI SDK Core implementation.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Utility Functions Demo</CardTitle>
          <CardDescription>
            Test utility functions like ID generation and vector similarity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleUtilityDemo}>Run Utility Demo</Button>

          <pre className="bg-gray-50 min-h-32 p-4 rounded text-sm whitespace-pre-wrap">
            {response || "Click the button to see utility function results!"}
          </pre>
        </CardContent>
      </Card>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Available Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li><strong>generateText:</strong> Basic text generation with language models</li>
              <li><strong>streamText:</strong> Streaming text generation with real-time chunks</li>
              <li><strong>generateObject:</strong> Structured data generation with schema validation</li>
              <li><strong>embed/embedMany:</strong> Single and batch embedding generation</li>
              <li><strong>tool():</strong> Tool definition helper for function calling</li>
              <li><strong>Utility functions:</strong> ID generation, vector similarity, middleware</li>
              <li><strong>Experimental features:</strong> Image generation, speech synthesis, transcription</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}