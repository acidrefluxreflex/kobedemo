"use client";

import { ResourceHeader } from "./header";
import { ResourceFilters } from "./filters";
import { ResourceList } from "./resource-list";

export function ResourceManagement() {
  return (
    <div className="container mx-auto py-8 px-4">
      <ResourceHeader />
      <ResourceFilters />
      <ResourceList />
    </div>
  );
}
