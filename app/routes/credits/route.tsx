import CodendLogo from "~/components/utils/CodendLogo";

export default function CreditsPage() {
  return (
    <div className="flex h-screen justify-center bg-[url('/login-background.svg')] bg-cover">
      <div className="flex max-w-2xl flex-col gap-4 pt-12 text-gray-800">
        <CodendLogo className="h-52 w-52 self-center" />
        <div className="text-4xl font-bold">Credits:</div>
        <ul className="list-inside list-disc text-2xl">
          <li>Background - SVGBackgrounds.com (CC BY 4.0.)</li>
          <li>Avatars - github.com/alohe/avatars (MIT)</li>
        </ul>
      </div>
    </div>
  );
}
