import Head from 'next/head';
import { useEffect, useState } from 'react';
import Modal from '../components/Modal';
import EmailVerify from './email-verify';
import { builder, BuilderComponent } from '@builder.io/react';
import useUser from "../hooks/use-user";
import { useRouter } from 'next/router';
builder.init(process.env.BUILDER_PUBLIC_API_KEY);

export default function Home({ page }) {
    const [isOpen, setIsOpen] = useState(false);
    const [subscriptionType, setSubscriptionType] = useState('');
    const { data: me, isLoading } = useUser();
    const router = useRouter();
    // console.log(me);

    // ?? select all the buttons and apply event to open modal
    useEffect(() => {
        // console.log(isLoading, me?.user?.id);
        if (!isLoading && !me?.user?.id) {
            const buttonIds = ["3-day-trial-btn-1", "3-day-trial-btn-2", "3-day-trial-btn-3", "basic-subscription", "pro-subscription"];
            const buttons = buttonIds.map(buttonId => (document.getElementById(buttonId)));
            const handleButtonClick = (e) => {
                const id = e.currentTarget.getAttribute("id");
                // console.log(id);
                if (id) {
                    if (id.includes("3-day-trial-btn")) {
                        setSubscriptionType("3DTRIAL");
                    } else if (id == "basic-subscription") {
                        setSubscriptionType("BASIC")
                    } else if (id == "pro-subscription") {
                        setSubscriptionType("PRO")
                    }
                    setIsOpen(true);
                }
            };
            buttons.map(buttonElem => {
                return buttonElem.addEventListener("click", handleButtonClick);
            });
            // cleanups
            return () => {
                if (buttons.length > 0) {
                    buttons.forEach(buttonElem => {
                        buttonElem.removeEventListener("click", handleButtonClick);
                    });
                }
            }
        };
    }, [isLoading]);

    useEffect(() => {
        if (!isLoading && me?.user?.id) {
            const trialBtn = document.getElementById('3-day-trial-btn-1');
            trialBtn.innerText = "Dashboard";
            if (trialBtn) {
                trialBtn.onclick = () => {
                    router.push('/dashboard');
                };
            }
        }
    }, [me, isLoading]);
    return (
        <>
            <Head>
                <title>{page?.data?.name || 'Builder Page'}</title>
            </Head>
            <BuilderComponent model="page" content={page} />
            <button onClick={() => setIsOpen(true)}>On Off</button>
            {/* <SetLinks /> */}
            <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
                <EmailVerify subscriptionType={subscriptionType} />
            </Modal>
        </>
    );
}

export async function getStaticProps() {
    const page = await builder
        .get('page', { entry: '79f338dda63f4da79876830729b23892' })
        .promise();

    return {
        props: { page: page || null },
        revalidate: 60,
    };
}
