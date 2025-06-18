import { useQuery } from "@tanstack/react-query";
import { getConversationQueryFn } from "../services/conversation";
const useConversations = (page) => {
  const key = ["conversations", page];
  const query = useQuery({
    queryFn: getConversationQueryFn(page),
    queryKey: key,
    refetchOnMount: false,
  });
  return query;
};

export default useConversations;
