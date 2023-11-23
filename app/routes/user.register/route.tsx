import { Button, Input, Spacer } from "@nextui-org/react";
import React, { useState } from "react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { ApiErrors } from "~/api/types/apiErrorsTypes";
import { useActionData } from "@remix-run/react";
import { handleRegister } from "~/actions/handleRegister";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const data = Object.fromEntries(formData);
  if (
    data.email === undefined ||
    data.password === undefined ||
    data.confirmpassword === undefined ||
    data.firstname === undefined ||
    data.lastname === undefined ||
    data.imageUrl === undefined
  ) {
    return json({ errors: [] });
  }

  if (data.password !== data.confirmpassword) {
    return json({
      errors: [ApiErrors.RegisterErrors.Password.PasswordsDoesntMatch],
    });
  }

  const passwordRegex = new RegExp(
    "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[@$#!%*?&.]).{8,}$"
  );
  if (!passwordRegex.test(data.password.toString())) {
    return json({
      errors: [ApiErrors.RegisterErrors.Password.PasswordDoesntMatchRules],
    });
  }

  return handleRegister({
    firstName: data.firstname.toString(),
    lastName: data.lastname.toString(),
    email: data.email.toString(),
    password: data.password.toString(),
  });
};

export default function Register() {
  const actionData = useActionData<typeof action>();
  const errors = actionData?.errors;

  const passwordErrorMessage = () => {
    if (
      errors?.hasError(
        ApiErrors.RegisterErrors.Password.PasswordDoesntMatchRules
      )
    ) {
      return "Password must be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character (@$#!%*?&.)";
    }

    if (
      errors?.hasError(ApiErrors.RegisterErrors.Password.PasswordsDoesntMatch)
    ) {
      return "Passwords doesn't match";
    }

    return undefined;
  };
  const [passwordError, setPasswordError] = useState<string | undefined>(
    passwordErrorMessage()
  );

  const emailErrorMessage = () => {
    if (errors?.hasError(ApiErrors.RegisterErrors.Email.EmailAlreadyExists)) {
      return "Email is already taken";
    }
    if (errors?.hasError(ApiErrors.RegisterErrors.Email.EmailAddressNotValid)) {
      return "Email is not valid email address";
    }
  };
  const [emailError, setEmailError] = useState<string | undefined>(
    emailErrorMessage()
  );

  return (
    <form className="max-w-lg grow px-5" method="post">
      <Input
        color={emailError ? "danger" : "default"}
        variant="faded"
        size="lg"
        type="email"
        label="Email"
        name="email"
        isRequired={true}
        errorMessage={emailError}
        onChange={() => setEmailError(undefined)}
      />
      <Spacer y={5} />
      <div className="flex w-full gap-5">
        <Input
          variant="faded"
          size="lg"
          type="text"
          label="First name"
          name="firstname"
          isRequired={true}
        />
        <Input
          variant="faded"
          size="lg"
          type="text"
          label="Last name"
          name="lastname"
          isRequired={true}
        />
      </div>
      <Spacer y={5} />
      <div className="flex w-full gap-5">
        <Input
          variant="faded"
          color={passwordError ? "danger" : "default"}
          size="lg"
          type="password"
          label="Password"
          name="password"
          isRequired={true}
          errorMessage={passwordError}
          onChange={() => setPasswordError(undefined)}
        />
        <Input
          variant="faded"
          color={passwordError ? "danger" : "default"}
          size="lg"
          type="password"
          label="Confirm password"
          name="confirmpassword"
          isRequired={true}
        />
      </div>
      <Spacer y={5} />
      <div className="flex justify-end">
        <Button size="lg" color="primary" type="submit">
          Register
        </Button>
      </div>
    </form>
  );
}
