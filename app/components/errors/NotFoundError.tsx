import { FaFileCircleQuestion } from "react-icons/fa6/index.js";
import { Button, Link } from "@nextui-org/react";
import { redirect } from "@remix-run/node";

export default function NotFoundError() {
  const handlePress = () => {
    redirect("/");
  };

  return (
    <div className="m-auto mt-unit-2xl flex h-1/2 min-h-[270px] w-1/2 min-w-fit flex-col items-center justify-center gap-5 rounded-lg border-3 border-gray-800 bg-gray-100 p-5">
      <div className="text-9xl text-gray-700">
        <FaFileCircleQuestion />
      </div>
      <div>
        <div className="text-center text-3xl font-bold text-gray-700">
          404 Not found
        </div>
        <div className="text-center text-lg text-gray-800">
          Sorry, the page you're looking for cannot be found
        </div>
        <div className="mt-3 flex justify-center">
          <Button
            href={"/"}
            as={Link}
            size="md"
            color="primary"
            className="self-center text-lg"
          >
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
}
