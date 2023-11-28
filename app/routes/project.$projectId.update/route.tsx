import { useOutletContext } from "react-router";
import ProjectEditor from "~/components/project/ProjectEditor";
import { ActionFunctionArgs } from "@remix-run/node";
import getToken from "~/actions/getToken";
import { updateProject } from "~/api/methods/project";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const token = await getToken(request);
  if (!token) {
    return undefined;
  }

  if (request.method !== "PUT") {
    return undefined;
  }

  const projectId = params.projectId!;
  const data = Object.fromEntries(await request.formData());
  return updateProject({
    token,
    projectId,
    name: data.name.toString(),
    description: data.description.toString(),
  });
};

export default function UpdateProjectPage() {
  // @ts-ignore
  const { projectPromise } = useOutletContext();

  return (
    <div className="flex h-full flex-col items-center overflow-x-scroll">
      <div className="w-full border-b-1 border-emerald-700 p-10 text-2xl">
        Update project
      </div>
      <div className="flex h-full w-1/2 items-center justify-center">
        <ProjectEditor projectPromise={projectPromise} />
      </div>
    </div>
  );
}
