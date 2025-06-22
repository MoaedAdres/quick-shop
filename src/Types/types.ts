import type { CSSProperties, ReactNode } from "react";

export type BreadCrumbObject = {
  path: string;
  title: string;
};
export interface RFlexProps extends React.HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  ref?: React.Ref<HTMLElement>;
}
