import CodendLogo from "~/components/utils/CodendLogo";

export default function CreditsPage() {
  return (
    <div className="flex h-screen justify-center bg-[url('/login-background.svg')] bg-cover">
      <div className="flex max-w-2xl flex-col gap-4 pt-12 text-gray-800">
        <CodendLogo className="h-52 w-52 self-center" />
        <div className="text-4xl font-bold">Credits:</div>
        <ul className="list-inside list-disc text-2xl">
          <li>
            <span>User avatars - </span>
            <a
              href="https://github.com/alohe/avatars"
              className="font-medium text-blue-600 hover:underline dark:text-blue-500"
            >
              github.com/alohe/avatars
            </a>
            <span> (MIT)</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
