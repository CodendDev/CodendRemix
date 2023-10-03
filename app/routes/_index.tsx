import type { MetaFunction } from "@remix-run/node";
import { useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const [dark, setDark] = useState<"dark" | "">();

  return (
    <div className={dark}>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <button
        className="bg-white dark:bg-gray-800"
        onClick={() => setDark((prev) => (prev === "" ? "dark" : ""))}
      >
        button
      </button>
    </div>
  );
}
