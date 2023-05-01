import Header from "../components/header/index";
import Footer from "../components/footer/index";
import styles from "../styles/signin.module.scss";
import axios from "axios";
import Link from "next/link";
import { Field, Form, Formik, FormikProps } from "formik";
import * as Yup from "yup";
import LoginInput from "../components/inputs/loginInput/index";
import { useState } from "react";
import CircledIconBtn from "../components/buttons/circledIconBtn/index";
import { BiLeftArrowAlt } from "react-icons/bi";
import { getProviders, signIn } from "next-auth/react";
import DotLoaderSpinner from "../components/loaders/DotLoaderSpinner/index";
import Router from "next/router";
import { getSession } from "next-auth/react";

const initialvalues = {
  login_email: "",
  login_password: "",
  name: "",
  email: "",
  password: "",
  conf_password: "",
  success: "",
  error: "",
  login_error: "",
};
export default function signin({ providers, callbackUrl, csrfToken }) {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(initialvalues);
  const {
    login_email,
    login_password,
    name,
    email,
    password,
    conf_password,
    success,
    error,
    login_error,
  } = user;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };
  const loginValidation = Yup.object({
    login_email: Yup.string()
      .required("Email is required")
      .email("Please enter your email"),
    login_password: Yup.string().required("Password is required"),
  });
  const registerValidation = Yup.object({
    name: Yup.string()
      .required("What's your name")
      .min(2, "First name must be between 2 to 16 characters")
      .max(16, "First name must be between 2 to 16 characters")
      .matches(/^[aA-zZ]/, "Numbers and Special Characters are not allowed"),
    email: Yup.string()
      .required(
        "You'll need this email address to login and to reset your password"
      )
      .email("Enter a valid email address"),
    password: Yup.string()
      .required(
        "Enter a combination of atleast 6 numbers ,letters and punctuation marks(Such as ! and &)"
      )
      .min(6, "Enter atleast 6 numbers")
      .max(36, "Password must not be more than 36 characters long"),
    conf_password: Yup.string()
      .required("Confirm your password")
      .oneOf([Yup.ref("password")], "Password must match"),
  });
  const signUpHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/auth/signup", {
        name,
        email,
        password,
      });
      setUser({ ...user, error: "", success: data.message });
      setLoading(false);
      setTimeout(async () => {
        let options = {
          redirect: false,
          email: email,
          password: password,
        };
        const res = await signIn("credentials", options);
        Router.push("/");
      }, 2000);
    } catch (error) {
      setLoading(false);
      // Check if error.response exists and has a data property
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        // Use error.response.data.message as error message
        setUser({ ...user, success: "", error: error.response.data.message });
      } else {
        // Otherwise, set a generic error message
        setUser({
          ...user,
          success: "",
          error: "An error occurred. Please try again later.",
        });
      }
    }
  };
  const SignInHandler = async () => {
    setLoading(true);
    let options = {
      redirect: false,
      email: login_email,
      password: login_password,
    };
    const res = await signIn("credentials", options);
    setUser({ ...user, success: "", error: "" });
    setLoading(false);
    if (res?.error) {
      setLoading(false);
      setUser({ ...user, login_error: res?.error });
    } else {
      return Router.push(callbackUrl || "/");
    }
  };
  return (
    <>
      {loading && <DotLoaderSpinner loading={loading} />}
      <Header />
      <div className={styles.login}>
        <div className={styles.login__container}>
          <div className={styles.login__header}>
            <div className={styles.back__svg}>
              <BiLeftArrowAlt />
            </div>
            <span>
              We be happy to join us ! <Link href="/">Go Store</Link>
            </span>
          </div>
          <div className={styles.login__form}>
            <h1>Sign In</h1>
            <p>Get Access to one of the best Eshopping Services in the world</p>
            <Formik
              enableReinitialize
              initialValues={{
                login_email,
                login_password,
              }}
              validationSchema={loginValidation}
              onSubmit={() => {
                SignInHandler();
              }}
            >
              {(form) => (
                <Form>
                  <LoginInput
                    type="text"
                    name="login_email"
                    icon="email"
                    placeholder="Email Address"
                    onChange={handleChange}
                  />
                  <LoginInput
                    type="password"
                    name="login_password"
                    icon="password"
                    placeholder="Password"
                    onChange={handleChange}
                  />
                  <CircledIconBtn type="submit" text="Sign In" />
                  {login_error && (
                    <span className={styles.error}>{login_error}</span>
                  )}
                  <div className={styles.forgot}>
                    <Link href="/forget">Forgot Password</Link>
                  </div>
                </Form>
              )}
            </Formik>
            <div className={styles.login__socials}>
              <span className={styles.or}>Or continue with</span>
              <div className={styles.login__socials_wrap}>
                {providers.map((provider) => {
                  if (provider.name == "Credentials") {
                    return;
                  }
                  return (
                    <div key={provider.name}>
                      <button
                        className={styles.social__btn}
                        onClick={() => signIn(provider.id)}
                      >
                        <img src={`../../icons/${provider.name}.png`} alt="" />
                        Sign in with {provider.name}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        {/* 2nd level */}
        <div className={styles.login__container}>
          <div className={styles.login__form}>
            <h1>Sign Up</h1>
            <p>Get Access to one of the best Eshopping Services in the world</p>
            <Formik
              enableReinitialize
              initialValues={{
                name,
                email,
                password,
                conf_password,
              }}
              validationSchema={registerValidation}
              onSubmit={() => {
                signUpHandler();
              }}
            >
              {(form) => (
                <Form>
                  <LoginInput
                    type="text"
                    name="name"
                    icon="user"
                    placeholder="Full Name"
                    onChange={handleChange}
                  />
                  <LoginInput
                    type="text"
                    name="email"
                    icon="email"
                    placeholder="Email Address"
                    onChange={handleChange}
                  />
                  <LoginInput
                    type="password"
                    name="password"
                    icon="password"
                    placeholder="Password"
                    onChange={handleChange}
                  />
                  <LoginInput
                    type="password"
                    name="conf_password"
                    icon="password"
                    placeholder="Re-Type Password"
                    onChange={handleChange}
                  />
                  <CircledIconBtn type="submit" text="Sign up" />
                </Form>
              )}
            </Formik>
            <div>
              {success && <span className={styles.success}>{success}</span>}
            </div>
            <div>{error && <span className={styles.error}>{error}</span>}</div>
          </div>
        </div>
      </div>
      <Footer country="Pakistan" />
    </>
  );
}

export async function getServerSideProps(context) {
  const { req, query } = context;
  const session = await getSession({ req });
  const { callbackUrl } = query;
  if (session) {
    return {
      redirect: {
        destination: callbackUrl,
      },
    };
  }
  //It is creating problem while onclick login and due to the project is not connected to the
  // github repository it is not downloading certain files from the github repository
  // beacuse it has not permissions given to it by the github repository
  // const csrfToken = await getCsrfToken(context);
  const providers = Object.values(await getProviders());
  return {
    props: { providers, callbackUrl },
  };
}
