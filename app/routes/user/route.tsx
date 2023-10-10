import { Outlet, useLocation, useNavigate } from "@remix-run/react";
import { Tabs, Tab } from "@nextui-org/react";

export default function User() {
  const navigate = useNavigate();
  const location = useLocation().pathname.replace("/user/", "").toLowerCase();
  if (location === "login" || location === "register") {
    return (
      <div
        className="flex flex-col justify-center align-middle"
        style={{ height: "100dvh" }}
      >
        <div className="">
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
