import { NextSeo } from "next-seo";

export const defaultDescription = "One man's trash is another man's treasure";

const Layout = ({ children, metadata }) => {
  return (
    <div className="bg-black w-full mt-10">
      <NextSeo {...metadata} />
      <main className="flex justify-center">
        <div className="flex justify-center items-center flex-col w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
