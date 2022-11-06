import styles from "./GlowButton.module.scss";
import { NextPage } from "next";
import Link from "next/link";

interface Props {
  url: string;
  label: string;
  icon?: string;
}

const GlowButton: NextPage<Props> = ({ url, label, icon }) => {
  return (
    <Link href={url}>
      <div className={styles.container}>{label}</div>
    </Link>
  );
};

export default GlowButton;
