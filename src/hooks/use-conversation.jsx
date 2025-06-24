import { useQuery } from "@tanstack/react-query";
import { getAllMessagesQueryFn } from "../services/conversation";

const useConversation = (conversationId, isFetchUseConversation) => {
  console.log(!!conversationId, isFetchUseConversation);
  const shouldFetch = !!conversationId && isFetchUseConversation;
  const query = useQuery({
    queryFn: getAllMessagesQueryFn(conversationId),
    queryKey: ["chat", conversationId],
    staleTime: Infinity,
    enabled: !!conversationId && isFetchUseConversation,
    refetchOnMount: false, // ?? this is important for this bcz when enabled toggles from false → true, it’s equivalent to a new mount.and default refetchOnMount:true then each time this will realod even if there have any cached data,
    retry: 3,
  });
  console.log(shouldFetch);
  console.log(query.isFetching, query.isLoading, query.status);
  return shouldFetch ? query : { data: {}, isLoading: false };
};

export default useConversation;
