import { GiSkullCrack } from "react-icons/gi/index.js";

export default function CustomError() {
  return (
    <div className="m-auto mt-unit-2xl flex h-1/2 min-h-[250px] w-1/2 min-w-fit flex-col items-center justify-center gap-5 rounded-lg border-3 border-danger-300 bg-danger-50 p-5">
      <div className="text-9xl text-danger-500 shadow-danger">
        <GiSkullCrack />
      </div>
      <div>
        <div className="text-center text-3xl font-bold text-danger-500">
          Something went wrong
        </div>
        <div className="text-center text-lg text-danger-800">
          We are already working on fixing it
        </div>
      </div>
    </div>
  );
}
