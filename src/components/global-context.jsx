import { createContext, useContext, useState } from "react";
import useUser from "../hooks/use-user";
import { useRouter } from "next/router";
import useConversation from "../hooks/use-conversation";
import useConversations from "../hooks/use-conversations";
const GlobalContext = createContext(null);
const GlobalContextWrapper = ({ children }) => {
  const meQuery = useUser();
  const [content, setContent] = useState([]); // user messages array
  const [isFetchSlugConversation, setIsFetchSlugConversation] = useState(false);
  const router = useRouter();
  const [page, setPage] = useState(1);
  const conversationsQuery = useConversations(page); // ?? it is tanstack useQuery hook to fetch the data
  const {
    data: conversation,
    isLoading: messagesLoading,
    status,
    // this represents is status == "error" means unable to fetch the conversation and this should handled sperately
  } = useConversation(
    router.query?.slug,
    !!router.query?.slug || isFetchSlugConversation
  );
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
