import Image from "next/image";
import styles from "../styles/Home.module.scss";
import axios from "axios";
import Header from "../components/header/index";
import { useSession, signIn, signOut } from "next-auth/react";
import Footer from "../components/footer";
export default function Home({ country }) {
  const { data: session } = useSession();
  console.log("🚀 ~ file: index.js:9 ~ Home ~ session", session);

  return (
    <div className={styles.container}>
      <Header country={country} />
      <Footer country={country} />
    </div>
  );
}
export async function getServerSideProps() {
  let data = await axios
    .get("https://api.ipregistry.co/?key=f4ujw3o5fmntg58o")
    .then((res) => {
      return res.data.location.country;
    })

    .catch((err) => {
      console.log(err);
    });
  return {
    props: {
      // country: { name: data.name, flag: data.flag.emojitwo },
      country: {
        name: "Pakistan",
        flag: "https://cdn.pixabay.com/photo/2012/04/10/22/59/pakistan-26804_960_720.png",
      },
    },
  };
}
