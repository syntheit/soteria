const additionalLinkTags = [
  {
    rel: "icon",
    href: "/favicon-32.png",
    size: "32x32",
  },
  {
    rel: "icon",
    href: "/favicon-128.png",
    size: "128x128",
  },
  {
    rel: "icon",
    href: "/favicon-192.png",
    size: "192x192",
  },
];

const description =
  "Soteria aims to reduce campus e-waste by connecting faculty with unneeded equipment to students with interest in technology";

export const index = {
  title: "Soteria",
  description,
  openGraph: {
    url: "https://www.soteria.matv.io",
    title: "Soteria",
    description,
    site_name: "Soteria",
  },
  additionalLinkTags,
};
