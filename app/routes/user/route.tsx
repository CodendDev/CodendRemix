import { Outlet, useLocation, useNavigate } from "@remix-run/react";
import { Tabs, Tab } from "@nextui-org/react";

export default function User() {
  const navigate = useNavigate();
  const location = useLocation().pathname.replace("/user/", "");

  return (
    <>
      <Tabs
        aria-label="options"
        selectedKey={location}
        onSelectionChange={(key) => navigate(`/user/${key}`)}
      >
        <Tab key="login" title="Login">
          <Outlet />
        </Tab>
        <Tab key="register" title="Sign up">
          <Outlet />
        </Tab>
      </Tabs>
    </>
  );
}
