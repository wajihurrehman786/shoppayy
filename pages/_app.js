import Head from "next/head";
import "../styles/globals.scss";
import { Provider } from "react-redux";
import store from "../store/index";
import { PersistGate } from "redux-persist/integration/react";
import { SessionProvider } from "next-auth/react";
import { persistStore } from "redux-persist";
let persistor = persistStore(store);
function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <>
      <Head>
        <title>Shoppayy</title>
        <meta
          name="description"
          content="Shoppayy-online shopping service for all of your needs"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SessionProvider session={session}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Component {...pageProps} />
          </PersistGate>
        </Provider>
      </SessionProvider>
    </>
  );
}

export default MyApp;
