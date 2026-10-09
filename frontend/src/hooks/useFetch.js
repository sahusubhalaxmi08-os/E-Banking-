import { useCallback, useEffect, useState } from "react";

export default function useFetch(fetchFunction, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const execute = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await fetchFunction();
      setData(result);
      return result;
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Request failed"
      );
      throw err;
    } finally {
      setLoading(false);
    }
    // The caller should memoize fetchFunction when dependencies matter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  useEffect(() => {
    execute().catch(() => {});
  }, [execute]);

  return { data, loading, error, refetch: execute };
}