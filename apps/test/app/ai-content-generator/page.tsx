"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type GeneratedContent = {
  content: string;
  channel: string;
  generatedAt: string;
};

export default function AIContentGenerator() {
  const [channel, setChannel] = useState<string>("");
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [generatedContent, setGeneratedContent] =
    useState<GeneratedContent | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!channel) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/ai/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          channel,
          variables,
          prompt: `Gere conteúdo personalizado para ${channel}`,
          personaContext: "Comunicação profissional e amigável",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedContent(data);
      }
    } catch (_error) {
      // Error handled silently
    } finally {
      setLoading(false);
    }
  };

  const handleVariableChange = (key: string, value: string) => {
    setVariables((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const addVariable = () => {
    const key = `var${Object.keys(variables).length + 1}`;
    setVariables((prev) => ({
      ...prev,
      [key]: "",
    }));
  };

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="mb-8">
        <h1 className="mb-2 font-bold text-3xl">AI Content Generator</h1>
        <p className="text-gray-600">
          Generate personalized content for messaging templates using AI SDK
          Core integration.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Content Configuration</CardTitle>
            <CardDescription>
              Configure the channel and variables for content generation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="channel">Channel</Label>
              <Select onValueChange={setChannel} value={channel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="telegram">Telegram</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Variables</Label>
              {Object.entries(variables).map(([key, value]) => (
                <div className="flex gap-2" key={key}>
                  <Input
                    onChange={(e) => {
                      const newKey = e.target.value;
                      const newVariables = { ...variables };
                      delete newVariables[key];
                      newVariables[newKey] = value;
                      setVariables(newVariables);
                    }}
                    placeholder="Variable name"
                    value={key}
                  />
                  <Input
                    onChange={(e) => handleVariableChange(key, e.target.value)}
                    placeholder="Value"
                    value={value}
                  />
                </div>
              ))}
              <Button onClick={addVariable} variant="outline">
                Add Variable
              </Button>
            </div>

            <Button
              className="w-full"
              disabled={!channel || loading}
              onClick={handleGenerate}
            >
              {loading ? "Generating..." : "Generate Content"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generated Content</CardTitle>
            <CardDescription>
              AI-generated content for your messaging template
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedContent ? (
              <div className="space-y-4">
                <div>
                  <Label className="font-medium text-sm">Channel</Label>
                  <p className="text-gray-600 text-sm capitalize">
                    {generatedContent.channel}
                  </p>
                </div>
                <div>
                  <Label className="font-medium text-sm">Content</Label>
                  <Textarea
                    className="min-h-32"
                    readOnly
                    value={generatedContent.content}
                  />
                </div>
                <div>
                  <Label className="font-medium text-sm">Generated At</Label>
                  <p className="text-gray-600 text-sm">
                    {new Date(generatedContent.generatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ) : (
              <p className="py-8 text-center text-gray-500">
                No content generated yet. Configure your settings and click
                "Generate Content".
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Integration Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-inside list-disc space-y-1 text-sm">
              <li>
                <strong>AI SDK Core Integration:</strong> Uses the implemented
                AI SDK Core for content generation
              </li>
              <li>
                <strong>Channel Optimization:</strong> Content tailored for
                WhatsApp, SMS, Email, and Telegram
              </li>
              <li>
                <strong>Variable Substitution:</strong> Dynamic content
                replacement using template variables
              </li>
              <li>
                <strong>Template Composer Integration:</strong> Ready to
                integrate with Streamdown's messaging system
              </li>
              <li>
                <strong>Real-time Generation:</strong> Instant content creation
                with AI assistance
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
