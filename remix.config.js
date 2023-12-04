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
      route(
        "api/project/:projectId/sprints/:sprintId/task/:taskId/:taskType/move",
        "routes/api/projectTask/projectTaskMoveAction.tsx"
      );
    });
  },
  ignoredRouteFiles: ["**/.*"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",
};
