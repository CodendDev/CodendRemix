import React, { useEffect, useState } from "react";
import { Button, Checkbox, Input, Spacer } from "@nextui-org/react";
import { useFetcher } from "@remix-run/react";
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
  if (!data.email || !data.password) {
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

interface LoginErrors {
  errors?: ApiErrorResponse[];
}

export default function Login() {
  const fetcher = useFetcher();
  const data = fetcher.data as LoginErrors | undefined;
  const error =
    data?.errors?.hasError(ApiErrors.LoginErrors.InvalidEmailOrPassword) ??
    false;

  const [checked, setChecked] = useState<boolean>(false);
  return (
    <fetcher.Form className="max-w-lg grow px-5" method="post">
      <Input
        variant="faded"
        size="lg"
        type="email"
        label="Email"
        name="email"
        isRequired={true}
        isInvalid={error}
      />
      <Spacer y={5} />
      <Input
        variant="faded"
        size="lg"
        type="password"
        label="Password"
        name="password"
        isRequired={true}
        isInvalid={error}
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
      </div>
      <Button
        size="lg"
        color="primary"
        type="submit"
        isLoading={fetcher.state !== "idle"}
      >
        Login
      </Button>
    </fetcher.Form>
  );
}
