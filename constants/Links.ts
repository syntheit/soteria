export const links_loggedOut: {
  label: string;
  url: string;
  visibleWhenLoggedIn?: boolean;
}[][] = [
  [
    { label: "Home", url: "/", visibleWhenLoggedIn: true },
    { label: "Our Goal", url: "/goal", visibleWhenLoggedIn: true },
  ],
  [{ label: "How To Dispose Properly", url: "/tutorial" }],
];
