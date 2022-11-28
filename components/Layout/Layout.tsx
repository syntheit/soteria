import { NextSeo } from "next-seo";

export const defaultDescription = "One man's trash is another man's treasure";

const Layout = ({ children, metadata }) => {
  return (
    <div className="bg-black w-full h-full">
      <NextSeo {...metadata} />
      <main className="flex justify-center h-full">
        <div className="flex justify-center items-center flex-col w-full h-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
