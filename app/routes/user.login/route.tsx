import React, { useState } from "react";
import { Button, Checkbox, Input, Link, Spacer } from "@nextui-org/react";
import { useActionData, useNavigate } from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/node";
import type { handleLoginRequest } from "~/actions/handleLogin";
import handleLogin from "~/actions/handleLogin";
import { json } from "@remix-run/node";
import type { ApiErrorResponse } from "~/api/types/apiErrorsTypes";
import { ApiErrors } from "~/api/types/apiErrorsTypes";

export const action = async ({ request }: ActionFunctionArgs) => {
  const errorHandler = (errors: ApiErrorResponse[]) => json({ errors });

  const formData = await request.formData();

  const data = Object.fromEntries(formData);
  if (data.email === undefined || data.password === undefined) {
    return errorHandler([]);
  }

  const loginRequest: handleLoginRequest = {
    email: data.email.toString(),
    password: data.password.toString(),
    remember: data.remember === "true",
    errorHandler,
  };

  return handleLogin(loginRequest);
};

export default function Login() {
  const navigate = useNavigate();
  const handleForget = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/user/forget");
  };

  const actionData = useActionData<typeof action>() as unknown as {
    errors?: ApiErrorResponse[];
  };
  const error = actionData?.errors?.hasError(
    ApiErrors.LoginErrors.InvalidEmailOrPassword
  );

  console.log(error);

  const [checked, setChecked] = useState<boolean>(false);
  return (
    <form className="max-w-lg grow px-5" method="post">
      <Input
        color={error ? "danger" : "default"}
        size="lg"
        type="email"
        label="Email"
        name="email"
        isRequired={true}
      />
      <Spacer y={5} />
      <Input
        color={error ? "danger" : "default"}
        size="lg"
        type="password"
        label="Password"
        name="password"
        isRequired={true}
        errorMessage={error && "Invalid email or password"}
      />
      <div className="my-5 flex justify-between align-middle">
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
