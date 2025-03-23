import { awscdk, javascript, JsonPatch, ReleasableCommits } from "projen";
import { JobStep } from "projen/lib/github/workflows-model";
import { YarnNodeLinker } from "projen/lib/javascript";
import { ReleaseTrigger } from "projen/lib/release";

const project = new awscdk.AwsCdkConstructLibrary({
  author: "Roman Naumenko",
  authorAddress: "hi@catenary.cloud",
  packageName: "@catenarycloud/routemaster",
  cdkVersion: "2.173.2",
  // constructsVersion: "10.4.2",
  majorVersion: 0,
  defaultReleaseBranch: "main",
  release: true,
  releaseTrigger: ReleaseTrigger.continuous(),
  // prerelease: "beta",
  prettier: true,
  jsiiVersion: "~5.7.0",
  name: "RouteMaster",
  keywords: ["awscdk", "cdk", "route53", "cross-account", "aws orgs"],
  description:
    "High level construct to manage zones in a central account. Sets permissions via AWS Org",
  packageManager: javascript.NodePackageManager.YARN_BERRY,
  projenrcTs: true,
  license: "Apache-2.0",
  releasableCommits: ReleasableCommits.featuresAndFixes(),
  repositoryUrl: "https://github.com/CatenaryCloudHQ/RouteMaster.git",
  yarnBerryOptions: {
    version: "4.6.0",
    zeroInstalls: false,
    yarnRcOptions: {
      nodeLinker: YarnNodeLinker.NODE_MODULES,
    },
  },
  deps: [],
  devDeps: ["esbuild"],
  bundledDeps: ["@aws-sdk/client-route-53", "@types/aws-lambda"],
});

const res = project.github?.tryFindWorkflow("release");

if (res) {
  res.file?.patch(
    JsonPatch.add("/jobs/release/steps/3", {
      name: "Install Specific Yarn Version",
      run: "corepack enable && yarn set version 4.6.0",
    }),
    JsonPatch.add("/jobs/release_npm/steps/2", {
      name: "Install Specific Yarn Version",
      run: "corepack enable && yarn set version 4.6.0",
    }),
  );
}

if (project.github) {
  const buildWorkflow = project.github.workflows.find(
    (wf) => wf.name === "build",
  );

  const upgradeWorkflow = project.github.workflows.find(
    (wf) => wf.name === "upgrade-main",
  );

  // console.log("upgradeWorkflow", upgradeWorkflow);

  if (buildWorkflow && upgradeWorkflow) {
    const buildJob = buildWorkflow.getJob("build");
    const jsJob = buildWorkflow.getJob("package-js");
    const upgradeJob = upgradeWorkflow.getJob("upgrade");
    if (
      buildJob &&
      "steps" in buildJob &&
      jsJob &&
      "steps" in jsJob &&
      upgradeJob &&
      "steps" in upgradeJob
    ) {
      const corepack = {
        name: "Install Specific Yarn Version",
        run: "corepack enable && yarn set version 4.6.0",
      };

      const buildSteps = buildJob.steps as unknown as () => JobStep[];
      const jsSteps = jsJob.steps as unknown as JobStep[];
      const upgradeSteps = upgradeJob.steps as unknown as JobStep[];

      buildWorkflow.updateJob("package-js", {
        ...jsJob,
        steps: [corepack, ...jsSteps],
      });

      buildWorkflow.updateJob("build", {
        ...buildJob,
        steps: [corepack, ...buildSteps()],
      });

      upgradeWorkflow.updateJob("upgrade", {
        ...upgradeJob,
        steps: [corepack, ...upgradeSteps],
      });
    }
  }
}

// Add some extras to npmignore
project.npmignore?.addPatterns(".yarn", ".yarn*");

project.synth();
