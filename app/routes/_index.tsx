import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Button } from "@nextui-org/react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div>
      <Button as={Link} to="/user">
        User account
      </Button>
      <Button as={Link} to="/project">
        Project
      </Button>
    </div>
  );
}
