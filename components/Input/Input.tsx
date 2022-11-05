import styles from "./Input.module.scss";
import { NextPage } from "next";

interface Props {}



const Input: NextPage<Props> = () => {
  return (
    <div className={styles.container}>
        <input />
    </div>
  );
};

export default Input;
