import React, { useState } from "react";
import { Button, Checkbox, Input, Link, Spacer } from "@nextui-org/react";
import { useNavigate } from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/node";
import type { handleLoginRequest } from "~/actions/handleLogin";
import handleLogin from "~/actions/handleLogin";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const data = Object.fromEntries(formData);
  if (data.email === undefined || data.password === undefined) {
    return false;
  }

  const loginRequest: handleLoginRequest = {
    email: data.email.toString(),
    password: data.password.toString(),
    remember: data.remember === "true",
  };

  return handleLogin(loginRequest);
};

export default function Login() {
  const navigate = useNavigate();
  const handleForget = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/user/forget");
  };

  const [checked, setChecked] = useState<boolean>(false);
  return (
    <form className="max-w-lg grow px-5" method="post">
      <Input size="lg" type="email" label="Email" name="email" />
      <Spacer y={5} />
      <Input size="lg" type="password" label="Password" name="password" />
      <div className="flex align-middle justify-between my-5">
        <Checkbox
          size="lg"
          name="remember"
          onClick={() => setChecked((prev) => !prev)}
        >
          Remember me
        </Checkbox>
        <input type="hidden" name="remember" value={checked.toString()} />
        <Link size="lg" href="/user/forget" onClick={handleForget}>
          Forgot password
        </Link>
      </div>
      <Button size="lg" color="primary" type="submit">
        Login
      </Button>
    </form>
  );
}
