import { defineCliConfig } from "sanity/cli";
import { dataset, projectId } from "./sanity/env";

export default defineCliConfig({
  api: { projectId, dataset },
  deployment: {
    appId: "ikm5rj7pre98z4szkxyoby4d"
  }
});
