/** @type {import('@remix-run/dev').AppConfig} */
export default {
  routes(defineRoutes) {
    return defineRoutes((route) => {
      route(
        "api/project/:projectId/projectTaskStatus",
        "routes/api/projectTaskStatus/projectTaskStatusCreateAction.tsx"
      );
      route(
        "api/project/:projectId/projectTaskStatus/:statusId",
        "routes/api/projectTaskStatus/projectTaskStatusEditDeleteAction.tsx"
      );
    });
  },
  ignoredRouteFiles: ["**/.*"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",
};
