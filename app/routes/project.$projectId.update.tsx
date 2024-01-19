import { useOutletContext } from "react-router";
import ProjectEditor from "~/components/project/ProjectEditor";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
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
  const response = await updateProject({
    token,
    projectId,
    name: data.name.toString(),
    description: data.description.toString(),
  });

  return response ? redirect(`/project/${params.projectId!}/board`) : undefined;
};

export default function UpdateProjectPage() {
  // @ts-ignore
  const { project } = useOutletContext();
  return <ProjectEditor projectPromise={project} />;
}
