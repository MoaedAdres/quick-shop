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

export type RSearchInputProps = {
  searchData: string;
  handleSearchClicked: (value: string) => void;
  handleDataChanged: (value: string) => void;
  searchLoading?: boolean;
  placeholder?: string;
  inputDisabled?: boolean;
  className?: string;
  removeCloseIcon?: boolean;
  inputClassName?: string;
  hideClearIcon?: boolean;
};
