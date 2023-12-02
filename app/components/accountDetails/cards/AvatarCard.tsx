import React from "react";
import { useNavigate } from "@remix-run/react";
import { Card, CardBody, Image, Link } from "@nextui-org/react";
import AvatarSelector from "~/components/avatarSelector/avatarSelector";

export function AvatarCard({
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
        <CardBody className="flex h-60 flex-row items-center justify-center overflow-hidden py-4">
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
