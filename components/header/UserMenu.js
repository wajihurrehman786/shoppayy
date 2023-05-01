import Link from "next/link";
import styles from "./styles.module.scss";
import { signIn, signOut } from "next-auth/react";
export default function UserMenu({ session }) {
  return (
    <div className={styles.menu}>
      <h4>Welcome to shoppay !</h4>
      {session ? (
        <div className={styles.flex}>
          <img src={session.user.image} alt="" className={styles.menu__img} />
          <div className={styles.col}>
            <span>Welcome Back ,</span>
            <h4> {session.user.name}</h4>
            <span onClick={() => signOut()}>Sign Out</span>
          </div>
        </div>
      ) : (
        <div className={styles.flex}>
          <button className={styles.btn_primary}>Register</button>
          <button className={styles.btn_outlined} onClick={() => signIn()}>
            Sign In
          </button>
        </div>
      )}
      <ul>
        <li className={styles.li}>
          <Link href="/profile">Account</Link>
        </li>
        <li className={styles.li}>
          <Link href="/profile/orders">My Orders</Link>
        </li>
        <li className={styles.li}>
          <Link href="/profile/messages">Message Center</Link>
        </li>
        <li className={styles.li}>
          <Link href="/profile/address">Address</Link>
        </li>
        <li className={styles.li}>
          <Link href="/profile/whishlist">WhishList</Link>
        </li>
      </ul>
    </div>
  );
}
