import { createContext, useContext, useEffect, useState } from "react";
import useUser from "../hooks/use-user";
import { useRouter } from "next/router";
import useConversation from "../hooks/use-conversation";
import useConversations from "../hooks/use-conversations";
import Cookies from "js-cookie";
import useAddedUsers from "../hooks/use-added-users";
import useUsers from "../hooks/use-users";
const GlobalContext = createContext(null);
const GlobalContextWrapper = ({ children }) => {
  const meQuery = useUser();
  const [page, setPage] = useState(1);
  const [content, setContent] = useState([]); // user messages array
  const [isFetchSlugConversation, setIsFetchSlugConversation] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [lastConversationItemMounted, setLastConversationItemMounted] =
    useState(false);
  const [pendingChats, setIsPendingChats] = useState([]); // ?? Now no use of this
  const addedUserQuery = useAddedUsers();
  const subscribersQuery = useUsers(page);
  // {
  //   isWelcome: false,
  //   conversationId: null,
  //   isLoader: false,
  //   userMessage: "",
  // }
  const [chatBoardTitle, setChatBoardTitle] = useState("");
  const router = useRouter();
  const conversationsQuery = useConversations(page); // ?? it is tanstack useQuery hook to fetch the data
  const {
    data: conversation,
    isLoading: messagesLoading,
    status,
    // this represents is status == "error" means unable to fetch the conversation and this should handled sperately
  } = useConversation(router.query?.slug, isFetchSlugConversation);
  useEffect(() => {
    if (conversation?.title) {
      setChatBoardTitle(conversation.title);
    }
  }, [conversation]);
  if (
    (Cookies.get("gptvct_authnz") && Cookies.get("gptvct_admin")) ||
    (!meQuery?.isLoading && meQuery?.data?.user?.isAdmin)
  ) {
    return (
      <GlobalContext.Provider
        value={{
          meQuery,
          addedUserQuery: addedUserQuery || {},
          subscribersQuery: subscribersQuery,
          page,
          setPage,
        }}
      >
        {children}
      </GlobalContext.Provider>
    );
  }
  return (
    <GlobalContext.Provider
      value={{
        content,
        setContent,
        meQuery,
        isFetchSlugConversation,
        setIsFetchSlugConversation,
        conversation,
        messagesLoading,
        status,
        conversationsQuery,
        page,
        setPage,
        chatBoardTitle,
        setChatBoardTitle,
        pendingChats,
        setIsPendingChats,
        conversations,
        setConversations,
        getSubscribers: () => ({ data: null }),
        addedUserQuery: {},
        lastConversationItemMounted,
        setLastConversationItemMounted,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  return context;
};
export default GlobalContextWrapper;
