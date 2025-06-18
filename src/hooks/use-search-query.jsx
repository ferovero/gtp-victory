import { useEffect, useState } from "react";

const useSearchQuery = () => {
  const [searchQuery, setSearchQuery] = useState({});
  useEffect(() => {
    if (typeof window !== undefined && window) {
      const searchQuery = {};
      window.location.search
        .replace("?", "")
        .split("&")
        .forEach((searchItem) => {
          const key = searchItem.split("=")[0];
          const value = decodeURIComponent(searchItem.split("=")[1]);
          searchQuery[key] = value;
        });
      setSearchQuery(searchQuery);
    }
  }, []);
  return searchQuery;
};

export default useSearchQuery;
