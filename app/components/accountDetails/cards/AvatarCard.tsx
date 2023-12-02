import React from "react";
import { Link } from "@remix-run/react";
import { Card, CardBody, Image, Link as UILink } from "@nextui-org/react";
import AvatarSelector from "~/components/avatarSelector/avatarSelector";

interface AvatarCardProps {
  imageUrl: string;
  editable: boolean;
}
export function AvatarCard({ editable, imageUrl }: AvatarCardProps) {
  return (
    <>
      <div className="px-2 py-2 text-lg">Your avatar</div>
      <Card className="bg-[url('/login-background.svg')] bg-cover">
        <CardBody className="flex h-60 flex-row items-center justify-center overflow-hidden py-4">
          {editable ? (
            <EditableAvatarCard imageUrl={imageUrl} />
          ) : (
            <UneditableAvatarCard imageUrl={imageUrl} />
          )}
        </CardBody>
      </Card>
    </>
  );
}

function UneditableAvatarCard({ imageUrl }: Omit<AvatarCardProps, "editable">) {
  return (
    <>
      <Image
        alt="User avatar"
        className="border-3 border-emerald-500 object-cover"
        src={imageUrl}
        height={200}
        radius="full"
      />
      <UILink
        as={Link}
        to="/user/account/edit"
        isBlock
        className="mt-auto cursor-pointer whitespace-nowrap px-2 py-1 text-sm italic text-emerald-800"
      >
        Change avatar
      </UILink>
    </>
  );
}

function EditableAvatarCard({ imageUrl }: Omit<AvatarCardProps, "editable">) {
  return (
    <div className="p-1">
      <AvatarSelector
        borderColor="border-emerald-500"
        currentAvatar={imageUrl}
      />
    </div>
  );
}
