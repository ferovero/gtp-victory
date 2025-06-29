import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
export const queryClient = new QueryClient({
    defaultOptions:{  
        queries: {
            refetchOnWindowFocus: false
        }
    }
});
function QueryProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
export default QueryProvider;
