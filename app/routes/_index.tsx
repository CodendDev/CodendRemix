import CodendLogo from "~/components/utils/CodendLogo";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import getToken from "~/actions/getToken";
import { Link, useLoaderData } from "@remix-run/react";
import { getUserDetails } from "~/api/methods/user";
import { UserDetails } from "~/api/types/baseEntitiesTypes";
import { Avatar, Button, Link as NextLink } from "@nextui-org/react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const token = await getToken(request);
  let userDetails = undefined;
  if (token) {
    userDetails = await getUserDetails({ token });
  }

  return json({ userDetails: userDetails });
};

export default function Index() {
  const { userDetails } = useLoaderData<typeof loader>();

  return (
    <div className="flex h-screen justify-center bg-[url('/login-background.svg')] bg-cover">
      <div className="flex w-[30em] flex-col items-center justify-center gap-10 pt-12">
        <CodendLogoAndName />
        {userDetails ? (
          <LoggedUserWelcome {...userDetails} />
        ) : (
          <NotLoggedUserWelcome />
        )}
        <div className="mt-auto flex flex-col items-center justify-center p-1">
          <span>
            Copyright &copy; 2024 Piotr Zajączkowski Mateusz Maksimowicz
          </span>
          <NextLink color="primary" href="/credits">
            Credits
          </NextLink>
        </div>
      </div>
    </div>
  );
}

function CodendLogoAndName() {
  return (
    <div className="flex flex-col items-center justify-center gap-7">
      <CodendLogo className="h-52 w-52" />
      <div className="flex flex-row text-7xl">
        <span className="font-bold text-emerald-500">Cod</span>
        <span className="font-bold text-foreground">end</span>
      </div>
    </div>
  );
}

function LoggedUserWelcome(userDetails: UserDetails) {
  return (
    <div className="flex flex-col gap-3 text-3xl">
      <div className="flex flex-row items-center justify-center">
        Welcome back,{" "}
        <span className="ml-2 text-emerald-500">{userDetails?.firstName}</span>
        <Avatar src={userDetails.imageUrl} size="lg" className="ml-2" />
      </div>
      <div>
        <span className="text-2xl">Your projects, all in one place.</span>
        <Button
          as={Link}
          color="primary"
          to="/project"
          className="ml-2 text-xl"
          size="md"
        >
          Projects
        </Button>
      </div>
    </div>
  );
}

function NotLoggedUserWelcome() {
  return (
    <div className="flex flex-col gap-3 text-2xl">
      <div className="Block items-center justify-center">
        Take control of your projects with
        <span className="ml-2 inline-flex text-emerald-500">Codend</span>
      </div>
      <div className="mt-5 flex flex-row items-center justify-center gap-5">
        <Button
          as={Link}
          to={"/user/login"}
          className="text-2xl font-bold"
          color="primary"
        >
          Login
        </Button>
        <Button
          as={Link}
          to={"/user/register"}
          className="text-2xl font-bold"
          color="primary"
        >
          Register
        </Button>
      </div>
    </div>
  );
}
