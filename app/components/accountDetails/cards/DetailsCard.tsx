import React from "react";
import { UserDetails } from "~/api/types/baseEntitiesTypes";
import { useNavigate } from "@remix-run/react";
import { Button, Card, CardBody, Link, Spacer } from "@nextui-org/react";
import { FaUserEdit } from "react-icons/fa/index.js";
import {
  DetailsField,
  DetailsInput,
} from "~/components/accountDetails/DetailsField";
import { Switch } from "@nextui-org/switch";

export function DetailsCard({
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
          <DetailsInput
            label="First name"
            name="firstName"
            value={user.firstName}
            editable={editable}
          />
          <Spacer y={5} />
          <DetailsInput
            label="Last name"
            name="lastName"
            value={user.lastName}
            editable={editable}
          />
          <Spacer y={5} />
          <DetailsInput
            label="Email"
            name="email"
            value={user.email}
            editable={editable}
            readOnly={true}
          />
          <Spacer y={5} />
          <DetailsField label="Notifications" item={<Switch />} />
        </CardBody>
      </Card>
    </>
  );
}
