import { Outlet, useLocation, useNavigate } from "@remix-run/react";
import { Tabs, Tab } from "@nextui-org/react";

export default function User() {
  const navigate = useNavigate();
  const location = useLocation().pathname.replace("/user/", "");
  if (location === "login" || location === "register") {
    return (
      <div
        className="flex align-middle flex-col justify-center"
        style={{ height: "100dvh" }}
      >
        <div className="">
          <Tabs
            size="lg"
            aria-label="options"
            selectedKey={location}
            onSelectionChange={(key) => navigate(`/user/${key}`)}
            className="flex justify-center mt-5"
          >
            <Tab key="login" title="Login" />
            <Tab key="register" title="Sign up" />
          </Tabs>
        </div>
        <div className="flex justify-center mt-5">
          <Outlet />
        </div>
      </div>
    );
  }

  return <Outlet />;
}
