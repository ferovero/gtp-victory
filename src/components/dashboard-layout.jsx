import { Edit, Loader } from "lucide-react";
import Link from "next/link.js";
import { useRouter } from "next/router.js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import adm_css from "../styles/admin_dashboard.module.css";
import css from "../styles/dashboard.module.css";
import AsidebarHeader from "./asidebar/asidebar-header.jsx";
import Conversations from "./asidebar/conversations.jsx";
import CollapseIcon from "./collapse-icon.jsx";
import { useGlobalContext } from "./global-context.jsx";
import { queryClient } from "./query-provider.jsx";
import Cookies from "js-cookie";
import { useMutation } from "@tanstack/react-query";
import { searchUserMutationFn } from "../services/user-api.js";
import clsx from "clsx";
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
  } = useGlobalContext();
  const isAdmin = Cookies.get("gptvct_admin");
  const isAuthnz = Cookies.get("gptvct_authnz");
  if ((isAdmin && isAuthnz) || me?.user?.isAdmin) {
    return <AdminDashboardLayout>{children}</AdminDashboardLayout>;
  }
  if ((!isAdmin && isAuthnz) || (me?.user && !me?.user?.isAdmin)) {
    const {
      conversationsQuery: {
        data: conversationsData,
        isLoading: conversationsLoading,
      },
      page,
      setPage,
    } = useGlobalContext();
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
  const {
    setIsFetchSlugConversation,
    setChatBoardTitle,
    conversations,
    setConversations,
    meQuery,
    lastConversationItemMounted,
    setLastConversationItemMounted,
  } = useGlobalContext();
  console.log(meQuery?.data?.user?.email);
  const [isWelcome, setIsWelcome] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [sidebarHeight, setSidebarHeight] = useState(0);
  const sidebarRef = useRef(null);
  const observerRef = useRef(null);
  const loadingRef = useRef(null);
  const ITEM_HEIGHT = 35;
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
  //   console.log(lastConversationItemMounted);
  //  ?? Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loadingRef.current || !hasMore) return;
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        console.log(target.isIntersecting, lastConversationItemMounted);
        if (
          target.isIntersecting &&
          !conversationsLoading &&
          hasMore &&
          lastConversationItemMounted
        ) {
          if (queryClient.getQueryData(["conversations", page])?.success) {
            setPage((prev) => prev + 1);
            setLastConversationItemMounted(false);
          }
        }
      },
      {
        threshold: 0.7,
        // rootMargin: "20px",
      }
    );
    observerRef.current.observe(loadingRef.current);
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [conversationsLoading, hasMore, page, lastConversationItemMounted]);
  // !! UNUSED ?? Handle sidebar height changes to load more items if needed
  //   useEffect(() => {
  //     if (sidebarHeight > 0 && conversations.length > 0) {
  //       const currentItemsHeight = conversations.length * ITEM_HEIGHT;
  //       const availableHeight = sidebarHeight;
  //       if (
  //         currentItemsHeight < availableHeight &&
  //         hasMore &&
  //         !conversationsLoading
  //       ) {
  //         // const additionalItemsNeeded =
  //         //   Math.ceil((availableHeight - currentItemsHeight) / ITEM_HEIGHT) +
  //         //   BUFFER_SIZE;
  //         // console.log(additionalItemsNeeded);
  //         // if (additionalItemsNeeded > 0) {
  //         // debugger;
  //         console.log("Setting Page :: Sidebar Height When Need More");
  //         // setPage((prev) => prev + 1);
  //         // }
  //       }
  //     }
  //   }, [
  //     sidebarHeight,
  //     conversations,
  //     hasMore,
  //     conversationsLoading,
  //     isCollapsed,
  //   ]);
  //  ?? this use effect does things
  // ?? 1. chatSlugConversation state --> to load conversations of slug (conversation id) we have to update this state. we are doing this because
  //  ?? 2. Behalf of SLUG updating the welcome state --> (this state track is we are on welcome page to create new conversation).
  useEffect(() => {
    if (slug) {
      setChatSlugConversation({ id: slug, name: "" });
      setIsWelcome(false);
    } else {
      setIsWelcome(true);
    }
  }, [slug]);

  // ?? here we are doing two main work:
  // ?? 1. if there have conversation and the query is not in loading phase then update the conversations array state by adding new conversations. so when page --> update --> conversations fetching query run and the conversationsData will be chnage and this useEffect will update the conversations state.
  // ?? 1.1 I can use the conversationsData state to populate all conversations to asidebar but when user creates then we have that conversation id and we want to append that new conversation item at first in asidebar but there have no state who can update so we are using state instead of conversationsData so we can add newer conversation items to it top that will show to asidebar.
  // ?? 2. checking is the conversationsData has reached full page so in conversationsData res we have total pages and by comparing with the current page state we can ensure is it reached the last page and when there have not pages left then update the setHasMore state to false so that page will be not update and no query run --> (we are checking hasMore state when to update page state in above).
  useEffect(() => {
    if (conversationsData?.conversations?.length > 0 && !conversationsLoading) {
      console.log(":::::::: Adding Item to the conversations ::::::::");
      setConversations((prev) => [...prev, ...conversationsData.conversations]);
    }
    if (
      conversationsData?.totalPages == page ||
      conversationsData?.totalPages <= page ||
      conversationsData?.totalPages === 0
    ) {
      setHasMore(false);
    }
  }, [conversationsData, page, conversationsLoading]);
  //   console.log("CONVERSATION LENGTH ::::: ", conversations.length);
  //  ?? this is important because when route will be change then conversations state will be trash and page will become 1 and the observer will be increment the page by 1 and this will become 2 and in above useEffect this will see the 2nd page conversations and put is to the conversations and we get lose our 1st page conversation item so to fix that when route will be chnage first set the page to 1 and then process will be follow again and in fecthing we have cached conversations data by page that will come instantely got it
  //   useEffect(() => {
  //     console.log(page);
  //     for (let i = 1; i <= page; i++) {
  //       setPage((prev) => {
  //         const queryData = queryClient.getQueryData(["conversations", i]);
  //         console.log(queryData);
  //         setConversations((prev) => [...prev, queryData.conversations]);
  //         return prev;
  //       });
  //     }
  //   }, [router, page]);
  // ??  When to click ne button then send them to /dashboard path
  const handleNewChatBtnClick = useCallback(() => {
    setChatSlugConversation(null);
    setChatBoardTitle("");
    if (window.innerWidth < 768) {
      setIsCollapsed(true);
    }
    router.push("/dashboard/", undefined, { shallow: true });
  }, [router]);
  //   useEffect(() => {
  //     if (typeof window !== "undefined") {
  //       const handleResize = () => {
  //         if (window.innerWidth < 768) {
  //         //   setIsCollapsed(true);
  //         } else {
  //           setIsCollapsed(false);
  //         }
  //       };
  //       window.addEventListener("resize", handleResize);
  //       return () => window.removeEventListener("resize", handleResize);
  //     }
  //   }, []);
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
            conversationsLoading={conversationsLoading}
            setLastConversationItemMounted={setLastConversationItemMounted}
          />
        </Asidebar>
        {children}
      </div>
    </ChatDashboardContext.Provider>
  );
};
export const AdminDashboardLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [isResultFetching, setIsResultFetching] = useState(false);
  const router = useRouter();
  const pathname = router.pathname;
  return (
    <div className={css.css_1ne4u3u_builder_block}>
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
              className={adm_css.css_9rto4r_builder_block}
              style={{
                background: pathname == link?.href ? "#343541" : "transparent",
              }}
            >
              <span className={adm_css.link_btn_name}>{link.name}</span>
            </Link>
          ))}
        </div>
      </Asidebar>
      {isCollapsed && (
        <div style={{ margin: "1.5rem" }}>
          <CollapseIcon onClick={() => setIsCollapsed(false)} />
        </div>
      )}
      <div style={{ height: "100dvh", overflow: "auto", width: "100%" }}>
        <div
          style={{
            paddingInline: "1.75rem",
            paddingTop: "1.5rem",
          }}
        >
          <SearchCustomer
            setIsSearching={setIsSearching}
            setSearchResult={setSearchResult}
            setIsResultFetching={setIsResultFetching}
          />
          {isSearching && (
            <SearchResult
              searchResult={searchResult}
              isResultFetching={isResultFetching}
            />
          )}
        </div>
        {!isSearching && children}
      </div>
    </div>
  );
};
const Asidebar = ({ children, setIsCollapsed, isCollapsed, ...props }) => {
  const { meQuery } = useGlobalContext();
  const router = useRouter();
  console.log(meQuery);
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
        <div
          style={{
            height: "40px",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "0.2rem 0.75rem",
          }}
        >
          <div
            style={{
              height: "30px",
              width: "100%",
              border: "1px solid rgba(299,299,299,0.4)",
              fontSize: "0.8rem",
              marginTop: "0px",
              color: "rgba(299,299,299,0.8)",
            }}
            className={css.css_9rto4r_builder_block}
            onClick={() => router.push("/auth/profile")}
          >
            {meQuery?.isLoading && "Loading Profile..."}
            {!meQuery?.isLoading && meQuery?.data?.user?.email}
          </div>
        </div>
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
  conversationsLoading,
  setLastConversationItemMounted,
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
        conversationsLoading={conversationsLoading}
        setLastConversationItemMounted={setLastConversationItemMounted}
      />
    </>
  );
};
const SearchCustomer = ({
  setIsSearching,
  setSearchResult,
  setIsResultFetching,
}) => {
  const [searchStr, setSearchStr] = useState("");
  const delay = 500;
  let timerRef = useRef(null);
  const { mutate, isLoading } = useMutation({
    mutationFn: searchUserMutationFn,
    onSuccess: (res) => {
      setSearchResult((prev) => [...res.users]);
    },
  });
  useEffect(() => {
    setIsResultFetching(isLoading);
  }, [isLoading]);
  const searchInLocalMemory = (searchStr) => {
    const users = queryClient
      .getQueriesData(["users"])
      ?.flatMap(([_, item]) => item.users);
    if (users?.length > 0) {
      const result = users?.filter(
        (user) =>
          user?.email.startsWith(searchStr) ||
          user?.subscription?.customerId?.startsWith(searchStr)
      );
      setSearchResult(result);
    }
  };
  const handleSearchStrChange = (e) => {
    // console.log(e.target.value);
    setSearchStr(e.target.value);
    const value = e.target.value?.trim();
    if (value == "" || !value) {
      //   console.log("satisfied");
      setIsSearching(false);
      setSearchResult([]);
      return;
    }
    setIsSearching(true);
    if (timerRef.current) {
      console.log("Clearing Timeot....");
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      searchInLocalMemory(value);
      mutate(value);
    }, delay);
  };
  return (
    <div className={adm_css.searchBox}>
      <input
        type="text"
        value={searchStr}
        onChange={handleSearchStrChange}
        placeholder="Search"
      />
    </div>
  );
};
const SearchResult = ({ searchResult, isResultFetching, setSearchResult }) => {
  return (
    <div style={{ padding: "1rem 0" }}>
      <h1 style={{ marginTop: "2rem" }}>
        Results
        {isResultFetching && <span style={{fontSize: "0.75rem", color: "rgba(299,299,299,0.6)", display: "inline-block", marginLeft: "1rem"}}> 
           <Loader style={{width: "14px", marginRight: "0.6rem"}} />  Searching in DB...</span>}
      </h1>
      {/* <div style={{ padding: "1rem" }}>
        {searchResult?.map((item) => {
          return (
            <div key={item.email}>
              <div>{item.email}</div>
              <div>{item.subscription?.customerId}</div>
            </div>
          );
        })}
        {isResultFetching && "Searching..."}
      </div> */}
      <div className={adm_css.wrapper}>
        <table className={clsx(adm_css.table, adm_css.subscribers)}>
          <thead className={adm_css.thead}>
            <tr>
              <th className={adm_css.th}>#</th>
              <th className={adm_css.th}>Email</th>
              <th className={adm_css.th}>Plan</th>
              <th className={adm_css.th}>Status</th>
              <th className={adm_css.th}>Subscribed On</th>
              <th className={adm_css.th}>Next Billing</th>
              <th className={adm_css.th}>Customer Id</th>
              <th className={adm_css.th}>Invoice</th>
              <th className={adm_css.th}>Canceled At</th>
            </tr>
          </thead>
          <tbody style={{ position: "relative" }}>
            {searchResult?.length > 0 &&
              searchResult?.map((user, idx) => {
                const subscription = user?.subscription;
                const plan = subscription?.plan;
                const status = subscription.status;
                return (
                  <tr key={user.id} className={adm_css.tr}>
                    <td className={adm_css.td}>{idx + 1}</td>
                    <td className={adm_css.td}>{user.email}</td>
                    <td className={adm_css.td}>{plan}</td>
                    <td className={adm_css.td}>{status}</td>
                    <td className={adm_css.td}>
                      {new Date(user.createdAt).toDateString()}
                    </td>
                    <td className={adm_css.td}>
                      {new Date(subscription.periodEnd).toDateString()}
                    </td>
                    <td className={adm_css.td}>{subscription.customerId}</td>
                    <td className={adm_css.td}>{subscription.invoice}</td>
                    <td className={adm_css.td}>
                      {subscription.cancel && new Date(subscription.canceledAt)}
                    </td>
                  </tr>
                );
              })}
            {!searchResult && isResultFetching && (
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "0.75rem",
                  position: "absolute",
                  left: 0,
                }}
              >
                <Loader className="spin_loader" />
              </div>
            )}
          </tbody>
        </table>
      </div>
      {/* <Paginate setPage={setPage} page={page} totalPages={data?.totalPages} /> */}
    </div>
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
//               <a className={css.nav_profile} href="/auth/profile">
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
