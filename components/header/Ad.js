import styles from "./styles.module.scss";
import Link from "next/link";
export default function Ad() {
  return (
    <Link href="/">
      <div className={styles.ad}></div>
    </Link>
  );
}
