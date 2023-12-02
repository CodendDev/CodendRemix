import { AccountDetails } from "~/components/accountDetails/AccountDetails";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import getToken from "~/actions/getToken";
import { UpdateUserDetails } from "~/api/methods/user";
import { UserDetails } from "~/api/types/baseEntitiesTypes";
import { useOutletContext } from "react-router";

export const action = async ({ request }: LoaderFunctionArgs) => {
  const token = await getToken(request);
  if (!token) {
    return redirect("/user/login");
  }

  if (request.method !== "PUT") {
    return undefined;
  }

  const formData = Object.fromEntries(await request.formData());

  const userData = {
    firstName: formData.firstName.toString(),
    lastName: formData.lastName.toString(),
    imageUrl: formData.imageUrl.toString(),
  };

  const response = UpdateUserDetails({ token, ...userData });

  if (!response) {
    return undefined;
  }

  return {};
};

export default function UserAccountDetailsPage() {
  const { userDetails }: { userDetails: UserDetails } = useOutletContext();

  return (
    <div className="flex grow justify-center">
      <AccountDetails editable userDetails={userDetails} />
    </div>
  );
}
