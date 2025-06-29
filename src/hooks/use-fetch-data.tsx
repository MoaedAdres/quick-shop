import type { UseFetchDataParams } from "@/Types/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

export const useFetchData = <TData = any, TError = any, TSelected = TData>({
  queryKey,
  queryFn,
  enableCondition = true,
  refetchOnMount,
  selectFn,
  onErrorFn,
  onSuccessFn,
  retry,
}: UseFetchDataParams<TData, TError, TSelected>) => {
  const data = useQuery<TData, TError, TSelected>({
    queryKey,
    queryFn,
    refetchOnWindowFocus: false,
    refetchOnMount: refetchOnMount ?? true,
    retry: retry ?? 1,
    enabled: enableCondition,

    select: (data: TData) => {
      if (selectFn) {
        return selectFn(data);
      }
      return data as any;
    },
  });
  useEffect(() => {
    if (data?.isError) {
      toast.error((data.error as Error)?.message);
      onErrorFn && onErrorFn((data.error as Error)?.message);
    }
  }, [data?.isError]);
  useEffect(() => {
    onSuccessFn && data?.isSuccess && onSuccessFn(data?.data as TSelected);
  }, [data?.isSuccess]);

  return data;
};
