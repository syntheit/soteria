import type { NextPage } from "next";

interface Props {}

const Splash: NextPage<Props> = () => {
  return (
    <div className="flex flex-col justify-center items-center w-6/12 h-full text-white">
      <h1 className="text-9xl font-bold mb-5 font-caveat soteriaTextGradient w-full text-center">
        Soteria
      </h1>
      <h2 className="text-2xl leading-10 text-center">
        We connect individuals at universities who are disposing of electronics
        to students who will have a use for them. It's a solution to the e-waste
        problem on campuses.
      </h2>
    </div>
  );
};

export default Splash;
