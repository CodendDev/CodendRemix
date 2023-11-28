import ProjectEditor from "~/components/project/ProjectEditor";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { createProject } from "~/api/methods/project";
import getToken from "~/actions/getToken";

export const action = async ({ request }: ActionFunctionArgs) => {
  const token = await getToken(request);
  if (!token) {
    return undefined;
  }

  const data = Object.fromEntries(await request.formData());
  const id = await createProject({
    token,
    name: data.name.toString(),
    description: data.description.toString(),
  });

  if (id) {
    return redirect(`/project/${id}`);
  }

  return undefined;
};

export default function CreateProjectPage() {
  return (
    <div>
      <div>Create project</div>
      <ProjectEditor />
    </div>
  );
}
