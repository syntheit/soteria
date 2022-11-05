import styles from "./GlowImage.module.scss";
import { NextPage } from "next";

interface Props {
  src: string;
  className: string;
}

const GlowImage: NextPage<Props> = ({ src, className }) => {
  return (
    <div className={styles.container}>
      <img
        className={[styles.foregroundImage, `${className}`].join(" ")}
        src={src}
      />
      <img
        className={[styles.backgroundImage, `${className}`].join(" ")}
        src={src}
      />
    </div>
  );
};

export default GlowImage;
