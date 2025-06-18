import '../styles/globals.css';
import '../styles/form_page.css';
import Head from 'next/head';
import Script from 'next/script';
import ClientWrapper from '../components/client-wrapper';
import QueryProvider from '../components/query-provider';
import GlobalContextWrapper from '../components/global-context';

function MyApp({ Component, pageProps }) {
    // Use the layout defined at the page level, if available
    const getLayout = Component.getLayout || ((page) => page);
    return (
        <>
            <Head>
                {/* Responsivní meta + safe-area */}
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, viewport-fit=cover"
                />
                {/* Embed Builder CSS (náhrada linku z Develop panelu) */}
                <link
                    rel="stylesheet"
                    href="https://cdn.builder.io/css/12fbc69635214ef6a9ed64f1b0a166db/builder.css"
                />
            </Head>

            {/* Webcomponents SDK načíst _před_ Reactem */}
            <Script
                src="https://cdn.builder.io/js/webcomponents"
                strategy="beforeInteractive"
            />
            {/* Inicializace s tvým public API key */}
            <Script id="builder-init" strategy="beforeInteractive">
                {`Builder.init('c68c3c02570a4745a92bbb7557b1e04c');`}
            </Script>
            <QueryProvider>
                <GlobalContextWrapper>
                    <ClientWrapper>
                        {getLayout(<Component {...pageProps} />)}
                    </ClientWrapper>
                </GlobalContextWrapper>
            </QueryProvider>
        </>
    );
}

export default MyApp;
