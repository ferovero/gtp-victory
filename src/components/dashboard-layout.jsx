import { Edit } from "lucide-react";
import { useRouter } from "next/router.js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import useConversations from "../hooks/use-conversations.jsx";
import css from "../styles/dashboard.module.css";
import adminDashboard from "../styles/admin_dashboard.module.css";
import AsidebarHeader from "./asidebar/asidebar-header.jsx";
import Conversations from "./asidebar/conversations.jsx";
import { useGlobalContext } from "./global-context.jsx";
import useUser from "../hooks/use-user.jsx";
import CollapseIcon from "./collapse-icon.jsx";
import Link from "next/link.js";
import { CSSTransition, TransitionGroup } from "react-transition-group";
export const ChatDashboardContext = createContext(null);
const adminLinks = [
  { name: "Subscribers", href: "/dashboard/subscribers" },
  { name: "Created Users", href: "/dashboard/my-users" },
  { name: "Pending User", href: "/dashboard/pending-events" },
];
const LoaderLayout = () => {
  return (
    <div className={css.css_1ne4u3u_builder_block}>
      <AsidebarSkl></AsidebarSkl>
    </div>
  );
};
const DashboardLayout = ({ children }) => {
  const {
    meQuery: { data: me },
    conversationsQuery: {
      data: conversationsData,
      isLoading: conversationsLoading,
    },
    setPage,
  } = useGlobalContext();
  if (me?.user?.isAdmin) {
    return <AdminDashboardLayout>{children}</AdminDashboardLayout>;
  }
  if (me?.user && !me?.user?.isAdmin) {
    return (
      <ChatBotDashboardLayout
        conversationsData={conversationsData}
        conversationsLoading={conversationsLoading}
        page={page}
        setPage={setPage}
      >
        {children}
      </ChatBotDashboardLayout>
    );
  }
  return <LoaderLayout></LoaderLayout>;
};
const ChatBotDashboardLayout = ({
  children,
  setPage,
  page,
  conversationsLoading,
  conversationsData,
}) => {
  const router = useRouter();
  const slug = router?.query?.slug;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { setIsFetchSlugConversation } = useGlobalContext();
  const [isWelcome, setIsWelcome] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  //   const [page, setPage] = useState(1);
  const [sidebarHeight, setSidebarHeight] = useState(0);
  const sidebarRef = useRef(null);
  const observerRef = useRef(null);
  const loadingRef = useRef(null);
  const ITEM_HEIGHT = 35;
  const [conversations, setConversations] = useState([]);
  //   const { data: conversationsData, isLoading: conversationsLoading } =
  //     useConversations(page);
  const [chatSlugConversation, setChatSlugConversation] = useState(null); // ?? this state will be used by chat board to know which conversation id is in the url to load the message.
  // ?? Measure sidebar height
  useEffect(() => {
    const measureHeight = () => {
      if (sidebarRef.current) {
        const rect = sidebarRef.current.getBoundingClientRect();
        setSidebarHeight(rect.height - 70); // Subtract header height
      }
    };
    measureHeight();
    window.addEventListener("resize", measureHeight);
    return () => window.removeEventListener("resize", measureHeight);
  }, []);
  //  ?? Intersection Observer for infinite scroll
  useEffect(() => {
    // console.log(conversationsLoading);
    if (!loadingRef.current || !hasMore) return;
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // debugger;
        const target = entries[0];
        console.log("Hitting it", target.isIntersecting);
        if (target.isIntersecting && !conversationsLoading && hasMore) {
          //   console.log("Hitting it");
          //   debugger;
          console.log("Hitting it");
          setPage((prev) => prev + 1);
        }
      },
      {
        threshold: 1,
        rootMargin: "20px",
      }
    );
    observerRef.current.observe(loadingRef.current);
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [conversationsLoading, hasMore, page, isCollapsed]);
  // ?? Handle sidebar height changes to load more items if needed
  useEffect(() => {
    if (sidebarHeight > 0 && conversations.length > 0) {
      console.log(conversations.length);
      const currentItemsHeight = conversations.length * ITEM_HEIGHT;
      const availableHeight = sidebarHeight;
      //   debugger;
      console.log(availableHeight, currentItemsHeight);
      if (
        currentItemsHeight < availableHeight &&
        hasMore &&
        !conversationsLoading
      ) {
        // const additionalItemsNeeded =
        //   Math.ceil((availableHeight - currentItemsHeight) / ITEM_HEIGHT) +
        //   BUFFER_SIZE;
        // console.log(additionalItemsNeeded);
        // if (additionalItemsNeeded > 0) {
        // debugger;
        console.log("Setting Page :: Sidebar Height When Need More");
        // setPage((prev) => prev + 1);
        // }
      }
    }
  }, [
    sidebarHeight,
    conversations,
    hasMore,
    conversationsLoading,
    isCollapsed,
  ]);
  //  ?? this use effect does things
  // ?? 1. chatSlugConversation state --> to load conversations of slug (conversation id) we have to update this state. we are doing this because
  useEffect(() => {
    if (slug) {
      setChatSlugConversation({ id: slug, name: "" });
    }
  }, [slug]);

  //  ?? Behalf of SLUG updating the welcome state --> (this state track is we are on welcome page to create new conversation).
  useEffect(() => {
    if (!slug) {
      setIsWelcome(true);
    } else {
      setIsWelcome(false);
    }
  }, [slug]);

  // ?? here we are doing two main work:
  // ?? 1. if there have conversation and the query is not in loading phase then update the conversations array state by adding new conversations. so when page --> update --> conversations fetching query run and the conversationsData will be chnage and this useEffect will update the conversations state.
  // ?? 1.1 I can use the conversationsData state to populate all conversations to asidebar but when user creates then we have that conversation id and we want to append that new conversation item at first in asidebar but there have no state who can update so we are using state instead of conversationsData so we can add newer conversation items to it top that will show to asidebar.
  // ?? 2. checking is the conversationsData has reached full page so in conversationsData res we have total pages and by comparing with the current page state we can ensure is it reached the last page and when there have not pages left then update the setHasMore state to false so that page will be not update and no query run --> (we are checking hasMore state when to update page state in above).
  useEffect(() => {
    if (conversationsData?.conversations?.length > 0 && !conversationsLoading) {
      setConversations((prev) => [...prev, ...conversationsData.conversations]);
    }
    if (
      conversationsData?.totalPages == page ||
      conversationsData?.totalPages === 0
    ) {
      setHasMore(false);
    }
  }, [conversationsData, page, conversationsLoading]);
  // ??  When to click ne button then send them to /dashboard path
  const handleNewChatBtnClick = useCallback(() => {
    setChatSlugConversation(null);
    router.push("/dashboard/", undefined, { shallow: true });
  }, [router]);
  return (
    <ChatDashboardContext.Provider
      value={{
        setChatSlugConversation,
        chatSlugConversation,
        isWelcome,
        setIsWelcome,
        setConversations,
        setIsCollapsed,
        isCollapsed,
      }}
    >
      <div className={css.css_1ne4u3u_builder_block}>
        <Asidebar
          setIsCollapsed={setIsCollapsed}
          isCollapsed={isCollapsed}
          style={{ paddingInline: "1rem" }}
        >
          <ConversationAsideBar
            chatSlugConversation={chatSlugConversation}
            conversations={conversations}
            setConversations={setConversations}
            handleNewChatBtnClick={handleNewChatBtnClick}
            setIsFetchSlugConversation={setIsFetchSlugConversation}
            sidebarRef={sidebarRef}
            loadingRef={loadingRef}
            loading={conversationsLoading}
            hasMore={hasMore}
            setIsCollapsed={setIsCollapsed}
          />
        </Asidebar>
        {children}
      </div>
    </ChatDashboardContext.Provider>
  );
};
export const AdminDashboardLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();
  const pathname = router.pathname;
  return (
    <div className={css.css_1ne4u3u_builder_block}>
      {/* <TransitionGroup component={null}>
        <CSSTransition
        in={isCollapsed}
        classNames={'asidebar_container'}
        appear={true}
        >
            <div key={"asidebar_container"}> */}
      <Asidebar
        setIsCollapsed={setIsCollapsed}
        isCollapsed={isCollapsed}
        style={{ paddingInline: "0px" }}
      >
        <div style={{ marginTop: "2rem" }}>
          {adminLinks?.map((link) => (
            <Link
              key={link.href}
              href={`/${link.href}`}
              className={adminDashboard.css_9rto4r_builder_block}
              style={{
                background: pathname == link?.href ? "#343541" : "transparent",
              }}
            >
              <span className={adminDashboard.link_btn_name}>{link.name}</span>
            </Link>
          ))}
        </div>
      </Asidebar>
      {/* </div>
        </CSSTransition>
      </TransitionGroup> */}
      {isCollapsed && (
        <div style={{ margin: "1.5rem" }}>
          <CollapseIcon onClick={() => setIsCollapsed(false)} />
        </div>
      )}
      <div style={{ height: "100dvh", overflow: "auto", width: "100%" }}>
        {children}
      </div>
    </div>
  );
};
const Asidebar = ({ children, setIsCollapsed, isCollapsed, ...props }) => {
  return (
    <aside
      className={css.asidebar}
      style={{ top: 0, display: isCollapsed ? "none" : "block" }}
    >
      <div
        className={css.css_xhlzdw_builder_block}
        builder-id="builder-c3a268b086794e93957cb7e7e93e2046"
      >
        {/* Header */}
        <AsidebarHeader
          setIsCollapsed={setIsCollapsed}
          isCollapsed={isCollapsed}
        />
        <div style={{ ...(props.style ? props.style : {}) }}>{children}</div>
      </div>
    </aside>
  );
};
const AsidebarSkl = () => {
  return (
    <aside className={css.asidebar} style={{ top: 0 }}>
      <div
        className={css.css_xhlzdw_builder_block}
        builder-id="builder-c3a268b086794e93957cb7e7e93e2046"
      >
        {/* Header */}
        <AsidebarHeader setIsCollapsed={() => {}} isCollapsed={true} />
        <div></div>
      </div>
    </aside>
  );
};
const ConversationAsideBar = ({
  chatSlugConversation,
  conversations,
  setConversations,
  handleNewChatBtnClick,
  setIsFetchSlugConversation,
  sidebarRef,
  loadingRef,
  hasMore,
  loading,
  setIsCollapsed,
}) => {
  return (
    <>
      {/* New Chat button */}
      <button className={css.add_new_chat_btn} onClick={handleNewChatBtnClick}>
        <Edit className="action_icon" />
        <span>New Chat</span>
      </button>
      {/* divider */}
      <hr
        style={{
          borderColor: "rgba(255,255, 255, 0.07)",
          marginTop: "1rem",
          marginBottom: "1rem",
        }}
      />
      {/* Conversations */}
      <Conversations
        chatSlugConversation={chatSlugConversation}
        conversations={conversations}
        hasMore={hasMore}
        loading={loading}
        loadingRef={loadingRef}
        setIsFetchSlugConversation={setIsFetchSlugConversation}
        sidebarRef={sidebarRef}
        setConversations={setConversations}
        setIsCollapsed={setIsCollapsed}
      />
    </>
  );
};
export const useChatDashboardContext = () => {
  const context = useContext(ChatDashboardContext || null);
  return context;
};
//  return (
//     <>
//       {/* <nav
//         className="builder-block builder-e84f3df110564422a675c925d94ca5dc css-1414dy5"
//         builder-id="builder-e84f3df110564422a675c925d94ca5dc"
//         style={{ height: "var(--nav-height)" }}
//       >
//         <div
//           className="builder-block builder-9b61285202b045c4b0489da22f397bef css-129cj3r"
//           builder-id="builder-9b61285202b045c4b0489da22f397bef"
//           style={{alignItems: "center"}}
//         >
//           <div
//             className="builder-block builder-ed5445d87ec14b288bd255f5efd81370 css-fxzw8h"
//             builder-id="builder-ed5445d87ec14b288bd255f5efd81370"
//           >
//             <div
//               className="builder-block builder-21a637f3315d4355a7b8a93d0f10d478 css-m55wq0"
//               builder-id="builder-21a637f3315d4355a7b8a93d0f10d478"
//             >
//               <picture>
//                 <source
//                   srcset="https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?format=webp&amp;width=100 100w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?format=webp&amp;width=200 200w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?format=webp&amp;width=400 400w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?format=webp&amp;width=800 800w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?format=webp&amp;width=1200 1200w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?format=webp&amp;width=1600 1600w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?format=webp&amp;width=2000 2000w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527"
//                   type="image/webp"
//                 />
//                 <img
//                   alt="GPTVictory Logo"
//                   conversationsLoading="lazy"
//                   fetchpriority="auto"
//                   className="builder-image css-1hbf805"
//                   src="https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527"
//                   srcset="https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?width=100 100w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?width=200 200w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?width=400 400w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?width=800 800w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?width=1200 1200w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?width=1600 1600w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?width=2000 2000w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527"
//                   sizes="160px"
//                 />
//               </picture>
//               <div className="builder-image-sizer css-pqz0xz"> </div>
//             </div>
//           </div>
//           <div
//             className="builder-block builder-fd8c31d03fe2496b9872cfb44fbd2af9 css-1932uwd"
//             builder-id="builder-fd8c31d03fe2496b9872cfb44fbd2af9"
//           >
//             {isLoading && "Loading..."}
//             {!isLoading && (
//               <a className={css.nav_profile} href="/profile">
//                 {me?.user?.name}
//               </a>
//             )}
//           </div>
//         </div>
//       </nav> */}
//       {children}
//     </>
//   );
export default DashboardLayout;
