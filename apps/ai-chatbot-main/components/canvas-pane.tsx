"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export function CanvasPane() {
  const [activeTab, setActiveTab] = useState("artifacts");

  return (
    <div className="h-full border-l bg-muted/10 p-4">
      <Tabs onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="artifacts">Artifacts</TabsTrigger>
          <TabsTrigger value="sources">Sources</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
        </TabsList>
        <TabsContent className="mt-4" value="artifacts">
          <Card>
            <CardHeader>
              <CardTitle>AI Artifacts</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Artifacts will appear here...</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent className="mt-4" value="sources">
          <Card>
            <CardHeader>
              <CardTitle>RAG Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Sources panel...</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent className="mt-4" value="tools">
          <Card>
            <CardHeader>
              <CardTitle>Tool Inspector</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Tool calls...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
