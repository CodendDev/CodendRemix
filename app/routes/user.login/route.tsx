import React from "react";
import { Button, Checkbox, Input, Link, Spacer } from "@nextui-org/react";
import { useNavigate } from "@remix-run/react";

export default function Login() {
  const navigate = useNavigate();
  const handleForget = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/user/forget");
  };

  return (
    <form className="max-w-lg grow px-5">
      <Input size="lg" type="email" label="Email" />
      <Spacer y={5} />
      <Input size="lg" type="password" label="Password" />
      <div className="flex align-middle justify-between my-5">
        <Checkbox size="lg">Remember me</Checkbox>
        <Link size="lg" href="/user/forget" onClick={handleForget}>
          Forgot password
        </Link>
      </div>
      <Button size="lg" color="primary">
        Login
      </Button>
    </form>
  );
}
