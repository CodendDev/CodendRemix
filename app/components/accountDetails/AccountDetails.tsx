import { UserDetails } from "~/api/types/baseEntitiesTypes";
import { useOutletContext } from "react-router";
import {
  Button,
  Card,
  CardBody,
  Image,
  Input,
  Link,
  Spacer,
} from "@nextui-org/react";
import { FaUserEdit } from "react-icons/fa/index.js";
import { Form, useNavigate } from "@remix-run/react";
import AvatarSelector from "~/components/avatarSelector/avatarSelector";
import { useContext } from "react";
import { UserDetailsContext } from "~/routes/project/route";

export function AccountDetails({ editable = false }: { editable?: boolean }) {
  const { userDetails } = useContext(UserDetailsContext);
  const navigate = useNavigate();

  return (
    <Form action={"/user/account/edit"} method="PUT">
      <div className="flex w-[20em] min-w-[20em] flex-col justify-center py-4 md:w-[30em]">
        <div className="p-2 text-3xl text-emerald-800">Account details</div>
        <AvatarCard imageUrl={userDetails.imageUrl} editable={editable} />
        <Spacer y={4} />
        <DetailsCard user={userDetails} editable={editable} />
        {editable && (
          <div className="flex justify-end gap-2 pt-4">
            <Button
              as={Link}
              color="danger"
              variant="solid"
              size="lg"
              className="font-bold"
              onPress={() => navigate("/user/account/details")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              size="lg"
              className="font-bold hover:bg-emerald-600"
            >
              Apply
            </Button>
          </div>
        )}
      </div>
    </Form>
  );
}

function AvatarCard({
  imageUrl,
  editable,
}: {
  imageUrl: string;
  editable: boolean;
}) {
  const navigate = useNavigate();
  return (
    <>
      <div className="px-2 py-2 text-lg">Your avatar</div>
      <Card className="bg-[url('/login-background.svg')] bg-cover">
        <CardBody className="flex h-60 flex-row items-center justify-center py-4">
          {editable ? (
            <div className="p-1">
              <AvatarSelector
                borderColor="border-emerald-500"
                currentAvatar={imageUrl}
              />
            </div>
          ) : (
            <>
              <Image
                alt="User avatar"
                className="border-3 border-emerald-500 object-cover"
                src={imageUrl}
                height={200}
                radius="full"
              />
              <Link
                isBlock
                className="mt-auto cursor-pointer whitespace-nowrap px-2 py-1 text-sm italic text-emerald-800"
                onPress={() => navigate("/user/account/edit")}
              >
                Change avatar
              </Link>
            </>
          )}
        </CardBody>
      </Card>
    </>
  );
}

function DetailsCard({
  user,
  editable,
}: {
  user: UserDetails;
  editable: boolean;
}) {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <div className="p-2 text-lg">About you</div>
        {!editable && (
          <Button
            as={Link}
            size="sm"
            color="primary"
            variant="light"
            className="text-lg"
            startContent={<FaUserEdit />}
            onPress={() => navigate("/user/account/edit")}
          >
            Edit
          </Button>
        )}
      </div>
      <Card className="p-2">
        <CardBody className="flex flex-col items-start justify-center pb-4 pt-2">
          <DetailsDiv
            label="First name"
            name="firstName"
            value={user.firstName}
            editable={editable}
          />
          <Spacer y={5} />
          <DetailsDiv
            label="Last name"
            name="lastName"
            value={user.lastName}
            editable={editable}
          />
          <Spacer y={5} />
          <DetailsDiv
            label="Email"
            name="email"
            value={user.email}
            editable={editable}
            readOnly={true}
          />
        </CardBody>
      </Card>
    </>
  );
}

function DetailsDiv({
  label,
  name,
  value,
  editable,
  readOnly = false,
}: {
  label: string;
  name: string;
  value: string;
  editable: boolean;
  readOnly?: boolean;
}) {
  return (
    <>
      <div className="text-md px-2 py-1 text-emerald-800">{label}</div>
      <Input
        name={name}
        aria-label={label}
        required
        variant="bordered"
        defaultValue={value}
        minLength={1}
        maxLength={30}
        isReadOnly={readOnly || !editable}
        classNames={{ input: "text-lg" }}
      />
    </>
  );
}
