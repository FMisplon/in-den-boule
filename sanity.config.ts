import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schema-types";

export default defineConfig({
  name: "default",
  title: "In den Boule CMS",
  projectId,
  dataset,
  plugins: [deskTool()],
  schema: {
    types: schemaTypes
  }
});
