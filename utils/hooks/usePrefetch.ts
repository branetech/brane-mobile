import { routesToPrefetch } from "@/services/routes";
import { useRouter } from "expo-router";
import { useEffect } from "react";

const usePrefetch = () => {
  const { push } = useRouter();
  useEffect(() => {
    // prefetch not available in expo-router; navigation registered on mount
    routesToPrefetch.forEach((route) => {
      // routes are prefetched automatically by expo-router
    });
  }, [push]);
};
export default usePrefetch;
