import React from "react";
import { UserDetails } from "~/api/types/baseEntitiesTypes";
import { Button, Card, CardBody, Spacer } from "@nextui-org/react";
import { FaUserEdit } from "react-icons/fa/index.js";
import { DetailsInput } from "~/components/accountDetails/DetailsField";
import { Link } from "@remix-run/react";

export function DetailsCard({
  user,
  editable,
}: {
  user: UserDetails;
  editable: boolean;
}) {
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
            to="/user/account/edit"
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
        </CardBody>
      </Card>
    </>
  );
}
