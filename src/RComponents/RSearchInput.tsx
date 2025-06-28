import React, { type ChangeEvent, type KeyboardEvent } from "react";
import RFlex from "@/RComponents/RFlex";
import { Input } from "@/components/ui/input";
import type { RSearchInputProps } from "@/Types/types";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { icons } from "@/Constants/icons";
const RSearchInput: React.FC<RSearchInputProps> = ({
  searchLoading,
  searchData,
  handleSearchClicked,
  handleDataChanged,
  placeholder,
  inputDisabled = false,
  className = "w-[270px]",
  inputClassName,
  hideClearIcon,
}) => {
  const { t } = useTranslation();
  return (
    <RFlex className={cn(`relative h-fit w-[270px]`, className)}>
      <Input
        type="text"
        placeholder={placeholder ? t(placeholder) : t`search`}
        value={searchData}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          event.preventDefault();
          handleDataChanged(event.target.value);
        }}
        onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
          if (event.key === "Enter" && handleSearchClicked) {
            handleSearchClicked(searchData);
          }
        }}
        disabled={inputDisabled}
        className={cn("px-8", inputClassName)}
      />

      {searchLoading ? (
        <i
          className={`${icons.spinner} absolute left-2 top-[30%] text-themeLight cursor-pointer animate-spin`}
        />
      ) : (
        <i
          className={`${icons.search} absolute left-3 top-[50%] hover:text-muted-foreground -translate-y-1/2 w-4 h-4 text-themeLight cursor-pointer`}
          onClick={() => handleSearchClicked(searchData)}
        />
      )}

      {searchData !== "" && !hideClearIcon && (
        <i
          aria-hidden="true"
          className={`absolute right-3 top-[50%] hover:text-muted-foreground -translate-y-1/2 w-4 h-4 text-themeLight cursor-pointer ${icons.close}`}
          onClick={() => {
            if (searchData !== "") {
              handleDataChanged && handleDataChanged("");
              handleSearchClicked("");
            }
          }}
        />
      )}
    </RFlex>
  );
};

export default RSearchInput;
