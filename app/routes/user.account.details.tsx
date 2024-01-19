import { AccountDetails } from "~/components/accountDetails/AccountDetails";
import { useContext } from "react";
import { UserDetailsContext } from "~/routes/project";

export default function UserAccountDetailsPage() {
  const { userDetails } = useContext(UserDetailsContext);

  return (
    <div className="flex grow justify-center">
      <AccountDetails userDetails={userDetails} />
    </div>
  );
}
