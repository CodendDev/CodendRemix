import React from "react";
import { Button, Spacer } from "@nextui-org/react";
import { Link, useFetcher } from "@remix-run/react";
import { AvatarCard } from "~/components/accountDetails/cards/AvatarCard";
import { DetailsCard } from "~/components/accountDetails/cards/DetailsCard";
import { UserDetails } from "~/api/types/baseEntitiesTypes";

interface AccountDetailsProps {
  userDetails: UserDetails;
  editable?: boolean;
}
export function AccountDetails({
  editable = false,
  userDetails,
}: AccountDetailsProps) {
  const fetcher = useFetcher();

  return (
    <fetcher.Form action="/user/account/edit" method="PUT">
      <div className="flex w-[20em] min-w-[20em] flex-col justify-center py-4 md:w-[30em]">
        <div className="p-2 text-3xl text-emerald-800">Account details</div>
        <AvatarCard imageUrl={userDetails.imageUrl} editable={editable} />
        <Spacer y={4} />
        <DetailsCard user={userDetails} editable={editable} />
        {editable && (
          <div className="flex justify-between pt-4">
            <Button
              as={Link}
              color="danger"
              variant="solid"
              size="lg"
              className="font-bold"
              to="/user/account/details"
              isDisabled={fetcher.state !== "idle"}
            >
              Go back
            </Button>
            <Button
              type="submit"
              color="primary"
              size="lg"
              className="font-bold hover:bg-emerald-600"
              isLoading={fetcher.state !== "idle"}
              spinnerPlacement="end"
            >
              Apply
            </Button>
          </div>
        )}
      </div>
    </fetcher.Form>
  );
}
