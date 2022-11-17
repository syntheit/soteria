export const links: {
  label: string;
  url: string;
  icon_name?: string;
  show_only_when_logged_in?: boolean;
  show_only_when_logged_out?: boolean;
}[] = [
  {
    label: "Home",
    url: "/",
    icon_name: "home",
    show_only_when_logged_out: true,
  },
  {
    label: "Feed",
    url: "/",
    icon_name: "inbox",
    show_only_when_logged_in: true,
  },
  { label: "Our Goal", url: "/goal", icon_name: "target-arrow" },
  { label: "Dispose Properly", url: "/tutorial", icon_name: "recycle" },
];
