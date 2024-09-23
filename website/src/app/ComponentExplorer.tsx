"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Component } from "@prisma/client";
import { useState } from "react";
import openUiLink from "./opneuiLink";

export default function ComponentExplorer({
  defaultComponents,
}: {
  defaultComponents: Component[];
}) {
  const [components, setComponents] = useState(defaultComponents);

  return (
    <div className="mb-10">
      <h1 className="mb-4">Components Explorer</h1>
      <Input placeholder="Search" className="w-full mb-4" />
      <div>
        {components.map((comp) => {
          return (
            <div key={comp.id}>
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="font-righteous text-xl">{comp.name}</CardTitle>
                  <CardDescription>
                    created by: {comp.createdBy}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col">
                  <a
                    href={`${openUiLink()}/api/component/${comp.id}`}
                    target="_blank"
                  >
                    <Button variant={"outline"}>Link</Button>
                  </a>
                  <code className="text-sm rounded-md px-2 py-1 mt-2">
                    npx shadcn@latest add{" "}
                    {`${openUiLink()}/api/component/${comp.id}`}
                  </code>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
