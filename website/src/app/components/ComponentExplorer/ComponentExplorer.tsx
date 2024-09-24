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
import openUiLink from "../../opneuiLink";
import useDelayedEffect from "@/hooks/useDelayedEffect";
import { findComponents } from "./action";
import { Switch } from "@/components/ui/switch";

export default function ComponentExplorer({
  defaultComponents,
  userEmail,
}: {
  defaultComponents: Component[];
  userEmail: string;
}) {
  const [components, setComponents] = useState<Component[]>(defaultComponents);
  const [search, setSearch] = useState("");
  const [showMyComponents, setShowMyComponents] = useState(false);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // Toggle switch handler
  const toggleShowMyComponents = () => {
    setShowMyComponents((prev) => !prev);
  };

  // Use delayed effect to fetch components based on search input and toggle state
  useDelayedEffect(
    () => {
      const fetchComponents = async () => {
        const where: any = showMyComponents
          ? {
              createdBy: userEmail,
            }
          : {};

        if (search) {
          where.name = {
            contains: search,
            mode: "insensitive",
          };
        }

        const updatedComponents = await findComponents({
          where,
          orderBy: { name: "asc" },
          take: 50,
        });

        setComponents(updatedComponents);
      };

      fetchComponents();
    },
    [search, showMyComponents],
    500
  );

  return (
    <div className="mb-10">
      <div className="flex items-center">
      <h1 className="mb-4 mr-2">Components Explorer</h1>
      <label className="flex items-center mb-4">
        <Switch
          checked={showMyComponents}
          onCheckedChange={toggleShowMyComponents}
          className="mr-2"
        />
        <span className="text-sm">Only Mine</span>
      </label>
      </div>

      {/* Search Input */}
      <Input
        placeholder="Search"
        className="w-full mb-4"
        value={search}
        onChange={handleSearchChange}
      />

      {/* Components List */}
      <div>
        {components.length === 0 ? (
          <p>No components found.</p>
        ) : (
          components.map((comp) => (
            <div key={comp.id}>
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="font-righteous text-xl">
                    {comp.name}
                  </CardTitle>
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
          ))
        )}
      </div>
    </div>
  );
}
