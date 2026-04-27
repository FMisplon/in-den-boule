import { defineCliConfig } from "sanity/cli";
import { dataset, projectId } from "./sanity/env";

export default defineCliConfig({
  api: { projectId, dataset },
  // Set this once the final hosted studio URL is chosen.
  // Example: studioHost: "indenboule-cms"
});
