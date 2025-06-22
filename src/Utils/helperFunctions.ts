export function capitalizeFirstLetter(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function getQueryParamsFromURL(url: string): URLSearchParams {
  const queryParamString = url.split("?");
  console.log("queryParamString", queryParamString[1]);
  const queryParams = new URLSearchParams(`?${queryParamString[1]}`);
  return queryParams;
}
export function truncatePargraph(pargraph: string, count: number = 20) {
  const cutedParagraph = pargraph.slice(0, count);
  return pargraph.length <= count ? pargraph : `${cutedParagraph}...`;
}
export const downloadFileFromBinary = ({
  binaryFile,
  mimeType = "application/pdf",
  fileName = "file",
  toast,
}: {
  binaryFile: any;
  mimeType: string;
  fileName: string;
  toast: any;
}) => {
  const blob = new Blob([binaryFile], {
    type: mimeType,
  });
  console.log("blob", blob);
  const blobUrl = window.URL.createObjectURL(blob);
  console.log("blobUrl", blobUrl);
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = `${fileName}`;

  // Check if the browser supports creating a Blob URL
  if ("download" in a) {
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else {
    toast({
      title: "error_downloading_file",
      description:
        "your_browser_does_not_support_blob_URLs_or_download_attribute",
    });
  }

  // Clean up by revoking the Blob URL
  URL.revokeObjectURL(blobUrl);
};
export const createFormDataFromObject = (object: { [key: string]: any }) => {
  const formData = new FormData();
  Object.keys(object).map((key) => formData.set(key, object[key]));
  return formData;
};

export const convertQueryParamsToObject = (queryParams: URLSearchParams) => {
  const queryObject: { [key: string]: string } = {};

  queryParams.forEach((value, key) => {
    if (value && key) queryObject[key] = value;
  });
  return queryObject;
};

export const readFile: any = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = () => {
      reject(reader.error);
    };

    reader.readAsDataURL(file);
  });
};
