import { AccountDetails } from "~/components/accountDetails/AccountDetails";

export default function UserAccountDetailsPage() {
  return (
    <div className="flex grow justify-center">
      <AccountDetails editable={true} />
    </div>
  );
}
