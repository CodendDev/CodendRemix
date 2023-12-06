import { AccountDetails } from "~/components/accountDetails/AccountDetails";
import { useOutletContext } from "react-router";
import { UserDetails } from "~/api/types/baseEntitiesTypes";

export default function UserAccountDetailsPage() {
  const { userDetails }: { userDetails: UserDetails } = useOutletContext();

  return (
    <div className="flex grow justify-center">
      <AccountDetails userDetails={userDetails} />
    </div>
  );
}
