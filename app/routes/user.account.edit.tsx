import { AccountDetails } from "~/components/accountDetails/AccountDetails";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import getToken from "~/actions/getToken";
import {
  disableAllUserNotifications,
  enableAllUserNotifications,
  UpdateUserDetails,
} from "~/api/methods/user";
import { useContext } from "react";
import { UserDetailsContext } from "~/routes/project";

export const action = async ({ request }: LoaderFunctionArgs) => {
  const token = await getToken(request);
  if (!token) {
    return redirect("/user/login");
  }

  // user details
  if (request.method === "PUT") {
    const formData = Object.fromEntries(await request.formData());

    const userData = {
      firstName: formData.firstName.toString(),
      lastName: formData.lastName.toString(),
      imageUrl: formData.imageUrl.toString(),
    };

    return UpdateUserDetails({ token, ...userData });
  }
  // user notifications
  if (request.method === "POST") {
    const formData = Object.fromEntries(await request.formData());
    const notifications = formData.notifications === "true";
    const returnUrl = formData.returnUrl.toString();

    if (notifications) {
      await enableAllUserNotifications({ token });
    } else {
      await disableAllUserNotifications({ token });
    }

    return redirect(returnUrl);
  }

  return undefined;
};

export default function UserAccountDetailsPage() {
  const { userDetails } = useContext(UserDetailsContext);

  return (
    <div className="flex grow justify-center">
      <AccountDetails editable userDetails={userDetails} />
    </div>
  );
}
