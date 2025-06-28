import type { BreadCrumbObject } from "@/Types/types";
import { type Location, type Params } from "react-router-dom";

export const generateBreadcrumbFromLocation = (
  location: Location,
  pathParams: Params
): BreadCrumbObject[] => {
  // Extract path and query parameters
  const pathNameArray = location.pathname.slice(1).split("/");
  const params = new URLSearchParams(location.search);
  const queryObject: { [key: string]: string } = {};

  params.forEach((value, key) => {
    queryObject[key] = value;
  });
  // Clone pathParams to safely modify it
  const remainingPathParams = { ...pathParams };

  // Generate breadcrumb objects
  const breadcrumbObjects = pathNameArray.map((pathSegment, index) => {
    // Generate the cumulative path up to the current index
    const path = "/" + pathNameArray.slice(0, index + 1).join("/");

    // Find a matching path parameter key and index
    const { key } = checkIfThePathnameIsParam(pathSegment, remainingPathParams);

    // Set title based on either the path segment or query parameter value
    const title = key ? queryObject[key] ?? pathSegment : pathSegment;

    // Remove the matched key from remainingPathParams if found
    if (key) delete remainingPathParams[key];

    return { title, path };
  });

  console.log("breadcrumb: Path segments:", pathNameArray);
  console.log("breadcrumb: Path parameters:", pathParams);
  console.log("breadcrumb: Query parameter values:", queryObject);
  // console.log("breadcrumb: Breadcrumb objects:", breadcrumbObjects);

  return breadcrumbObjects;
};

// Helper function to find the path parameter key and its index if it matches the given path segment
const checkIfThePathnameIsParam = (pathSegment: string, pathParams: Params) => {
  const entries = Object.entries(pathParams);
  const index = entries.findIndex(([_, value]) => value === pathSegment);
  const key = entries[index]?.[0];
  return { key, queryIndex: index };
};
