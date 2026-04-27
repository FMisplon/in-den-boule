import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import { dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schema-types";
import { structure } from "./sanity/structure";

export default defineConfig({
  name: "default",
  title: "In den Boule CMS",
  projectId,
  dataset,
  plugins: [
    deskTool({
      structure
    }),
    visionTool()
  ],
  schema: {
    types: schemaTypes
  }
});
