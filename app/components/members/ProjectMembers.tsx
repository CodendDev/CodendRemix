import { UserDetails } from "~/api/types/baseEntitiesTypes";
import { Card } from "@nextui-org/card";
import ProjectMembersList from "~/components/members/ProjectMembersList";

interface ProjectMembersProps {
  members: UserDetails[];
  ownerId: string;
}

export function ProjectMembers(props: ProjectMembersProps) {
  const membersCount =
    props.members.length === 1 ? "1 member" : `${props.members.length} members`;

  return (
    <>
      <div className="w-full p-5 text-3xl text-emerald-800">
        Project <span className="text-lg">({membersCount})</span>
      </div>
      <Card className="w-3/4 min-w-fit">
        <ProjectMembersList {...props} />
      </Card>
    </>
  );
}
