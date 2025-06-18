import { createContext, useContext, useState } from "react";
const GlobalContext = createContext(null);
const GlobalContextWrapper = ({ children }) => {
  const [content, setContent] = useState([]); // user messages array
  const [isFetchSlugConversation, setIsFetchSlugConversation] = useState(true);
  return (
    <GlobalContext.Provider
      value={{
        content,
        setContent,
        isFetchSlugConversation,
        setIsFetchSlugConversation,
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
