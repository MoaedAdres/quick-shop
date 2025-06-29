import type { UseInfiniteDataParams } from "@/Types/types";
import {
  useInfiniteQuery,
  type UseInfiniteQueryResult,
  type InfiniteData,
  type QueryObserverSuccessResult,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

export const useInfiniteData = <
  TQueryFnData,
  TError = unknown,
  TSelected = InfiniteData<TQueryFnData>,
>({
  queryKey,
  queryFn,
  enableCondition = true,
  getNextPageParam,
  onSuccessFn,
  onErrorFn,
  selectFn,
  refetchOnMount,
  initialPageParam = undefined, // Default to undefined if not provided
  retry,
}: UseInfiniteDataParams<
  TQueryFnData,
  TError,
  TSelected
>): UseInfiniteQueryResult<TSelected, TError> => {
  const data = useInfiniteQuery<TQueryFnData, TError, TSelected>({
    queryKey,
    queryFn,
    getNextPageParam,
    initialPageParam, // Added this property
    refetchOnWindowFocus: false,
    refetchOnMount: refetchOnMount ?? true,
    retry: retry ?? 1,
    enabled: enableCondition,

    select: (data: InfiniteData<TQueryFnData>) => {
      if (selectFn) {
        return selectFn(data);
      }
      return (data as any)?.data?.data;
    },
  });
  useEffect(() => {
    if (data?.isError) {
      toast.error((data.error as Error)?.message);
      onErrorFn && onErrorFn((data.error as Error)?.message);
    }
  }, [data?.isError]);

  useEffect(() => {
    onSuccessFn &&
      data?.isSuccess &&
      onSuccessFn(data as QueryObserverSuccessResult<TSelected, TError>);
  }, [data?.isSuccess]);
  return data;
};
