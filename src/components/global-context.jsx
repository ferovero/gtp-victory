import { createContext, useContext, useState } from "react";
import useUser from "../hooks/use-user";
import { useRouter } from "next/router";
import useConversation from "../hooks/use-conversation";
const GlobalContext = createContext(null);
const GlobalContextWrapper = ({ children }) => {
  const meQuery = useUser();
  const [content, setContent] = useState([]); // user messages array
  const [isFetchSlugConversation, setIsFetchSlugConversation] = useState(false);
  const router = useRouter();
  const {
    data: conversation,
    isLoading: messagesLoading,
    status,
    // this represents is status == "error" means unable to fetch the conversation and this should handled sperately
  } = useConversation(
    router.query?.slug,
    !!router.query?.slug || isFetchSlugConversation
  );
  console.log(conversation);
  console.log(router.query?.slug);
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
