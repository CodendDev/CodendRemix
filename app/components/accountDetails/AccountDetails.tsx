import React, { useContext } from "react";
import { Button, Link, Spacer } from "@nextui-org/react";
import { Form, useNavigate } from "@remix-run/react";
import { UserDetailsContext } from "~/routes/project/route";
import { AvatarCard } from "~/components/accountDetails/cards/AvatarCard";
import { DetailsCard } from "~/components/accountDetails/cards/DetailsCard";

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
