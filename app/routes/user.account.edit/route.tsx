import { AccountDetails } from "~/components/accountDetails/AccountDetails";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import getToken from "~/actions/getToken";
import { setIsFavourite } from "~/api/methods/project";
import { UpdateUserDetails } from "~/api/methods/user";

export const action = async ({ request }: LoaderFunctionArgs) => {
  const token = await getToken(request);
  if (!token) {
    return redirect("/user/login");
  }

  if (request.method !== "POST") {
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

  return redirect("/user/account/details");
};

export default function UserAccountDetailsPage() {
  return (
    <div className="flex grow justify-center">
      <AccountDetails editable={true} />
    </div>
  );
}
