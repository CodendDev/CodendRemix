import { UserDetails } from "~/api/types/baseEntitiesTypes";
import { useOutletContext } from "react-router";
import { Button, Card, CardBody, Image, Link, Spacer } from "@nextui-org/react";
import { FaUserEdit } from "react-icons/fa/index.js";

export function AccountDetails({ editable = false }: { editable: boolean }) {
  const user: UserDetails = useOutletContext();
  return (
    <div className="flex w-[20em] min-w-[20em] flex-col justify-center md:w-[30em]">
      <div className="px-2 py-4 text-3xl text-emerald-800">Account details</div>
      <AvatarCard imageUrl={user.imageUrl} />
      <Spacer y={4} />
      <DetailsCard user={user} />
    </div>
  );
}

function AvatarCard({ imageUrl }: { imageUrl: string }) {
  return (
    <>
      <div className="px-2 py-2 text-lg">Your avatar</div>
      <Card className="bg-[url('/login-background.svg')] bg-cover p-2">
        <CardBody className="flex flex-row items-center justify-center py-2">
          <Image
            alt="User avatar"
            className="border-3 border-emerald-500 object-cover"
            src={imageUrl}
            radius="full"
          />
          <Link
            isBlock
            className="ml-2 mt-auto cursor-pointer whitespace-nowrap px-2 py-1 text-sm italic text-emerald-800"
          >
            Change avatar here
          </Link>
        </CardBody>
      </Card>
    </>
  );
}

function DetailsCard({ user }: { user: UserDetails }) {
  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <div className="p-2 text-lg">About you</div>
        <Button
          as={Link}
          href={"/user/account/edit"}
          size="sm"
          color="primary"
          variant="light"
          className="text-lg"
          startContent={<FaUserEdit />}
        >
          Edit
        </Button>
      </div>
      <Card className="p-2">
        <CardBody className="flex flex-col items-start justify-center py-2">
          <DetailsDiv label="First name" value={user.firstName} />
          <Spacer y={5} />
          <DetailsDiv label="Last name" value={user.lastName} />
          <Spacer y={5} />
          <DetailsDiv label="Email" value={user.email} />
        </CardBody>
      </Card>
    </>
  );
}

function DetailsDiv({ label, value }: { label: string; value: string }) {
  return (
    <>
      <div className="text-md px-2 py-1 text-emerald-800">{label}</div>
      <Card className="w-full border-1 border-gray-200 bg-gray-100 px-3 py-1 shadow-none">
        <div className="text-lg">{value}</div>
      </Card>
    </>
  );
}
