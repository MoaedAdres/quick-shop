import type { UseMutateDataOptions } from "@/Types/types";
import { downloadFileFromBinary } from "@/Utils/helperFunctions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useMutateData = <TData = any, TVariables = any, TError = any>(
  options: UseMutateDataOptions<TData, TVariables, TError>
) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const data = useMutation<TData, TError, TVariables>({
    mutationFn: options.mutationFn,
    mutationKey: options.mutationKey,
    onSuccess: (data, variables) => {
      // Invalidate specified queries
      if (options.invalidateKeys) {
        options.invalidateKeys.forEach((key) =>
          queryClient.invalidateQueries(key)
        );
      }

      // Display success message if applicable
      if (options.displaySuccess) {
        toast.success((data as any)?.data?.message);
      }

      // Navigate to a specific path if provided
      if (options.navigateToPath) {
        navigate(options.navigateToPath);
      }

      // Call custom onSuccess function
      if (options.onSuccessFn) {
        options.onSuccessFn(data, variables);
      }
      if (options.downloadFile) {
        downloadFileFromBinary({
          binaryFile: (data as any)?.data,
          mimeType:
            (data as any)?.data?.type ??
            (variables as any)?.mimeType ??
            options.mimeType,
          fileName: (variables as any)?.fileName ?? options.fileName,
          toast: toast,
        });
      }
    },
    onError: (error: TError, variables: TVariables) => {
      console.log("in onError mutation", error);
      // Display error message
      if ((error as any).status_code == 400) {
        (error as any)?.message.map(
          (field: { errors: string[]; field: string }) => {
            field.errors?.map((error) => {
              toast.error(error);
            });
          }
        );
      } else {
        toast.error((error as any)?.message || "An error occurred");
      }

      // Call custom onError function
      if (options.onErrorFn) {
        options.onErrorFn((error as any)?.message ?? "Error", variables);
      }
    },
  });

  return data;
};
