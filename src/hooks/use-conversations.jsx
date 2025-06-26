import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getConversationQueryFn } from "../services/conversation";
import { useEffect } from "react";
const useConversations = (page) => {
  const key = ["conversations", page];
  //   const queryClient = useQueryClient();
  const query = useQuery({
    queryFn: getConversationQueryFn(page),
    queryKey: key,
    refetchOnMount: false,
    staleTime: Infinity,
  });

  //   useEffect(() => {
  //     console.log(queryClient.getQueriesData(["conversations", 1]));
  //   }, [query.data]);
  return query;
};

export default useConversations;
