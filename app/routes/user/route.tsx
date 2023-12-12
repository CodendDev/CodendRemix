import { Outlet, useLocation, useNavigate } from "@remix-run/react";
import { Tab, Tabs } from "@nextui-org/react";
import getToken from "~/actions/getToken";
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import CodendLogo from "~/components/utils/CodendLogo";

export const loader = async ({ request }: ActionFunctionArgs) => {
  const token = await getToken(request);

  // redirect to login page if user is not logged in
  const userRegex = new RegExp("^\\/user\\/?$");
  if (userRegex.test(new URL(request.url).pathname)) {
    if (!token) {
      return redirect("/user/login");
    }
    return redirect("/user/account/details");
  }

  return null;
};

export default function User() {
  const navigate = useNavigate();
  const location = useLocation().pathname.replace("/user/", "").toLowerCase();
  if (location === "login" || location === "register") {
    return (
      <div
        className="flex flex-col bg-[url('/login-background.svg')] bg-cover pt-12 align-middle"
        style={{ height: "100dvh" }}
      >
        <div className="flex flex-col items-center">
          <CodendLogo className="mb-5 h-44 w-44" />
          <Tabs
            size="lg"
            aria-label="options"
            selectedKey={location}
            onSelectionChange={(key) => navigate(`/user/${key}`)}
            className="mt-5 flex justify-center"
          >
            <Tab key="login" title="Login" />
            <Tab key="register" title="Sign up" />
          </Tabs>
        </div>
        <div className="mt-5 flex justify-center">
          <Outlet />
        </div>
      </div>
    );
  }

  return <Outlet />;
}
