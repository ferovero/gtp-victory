// import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
// function QueryProvider({ children }) {
//   const queryClient = new QueryClient();
//   return (
//     <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
//   );
// }
// export default QueryProvider;

// "use client";

// import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
// import { useState, useEffect } from "react";

// function QueryProvider({ children }) {
//   const [isClient, setIsClient] = useState(false);
//   const [queryClient] = useState(() => new QueryClient());

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   // Don't render QueryClientProvider until we're on the client
//   if (!isClient) {
//     return children; // Render children without React Query context
//   }

//   return (
//     <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
//   );
// }

// export default QueryProvider;

"use client"

import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { useState } from "react"

// Create a client factory function
function makeQueryClient() {
  return new QueryClient()
}

let browserQueryClient = undefined

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient()
  } else {
    // Browser: make a new query client if we don't already have one
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

function QueryProvider({ children }) {
  const [queryClient] = useState(() => getQueryClient())

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

export default QueryProvider
