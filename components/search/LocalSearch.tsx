"use client";

import Image from "next/image";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";

import { useDebounce } from "@/hooks/useDebounce";

import { Input } from "../ui/input";

interface Props {
  route: string;
  imgSrc: string;
  placeholder: string;
  otherClasses?: string;
}

const LocalSearch = ({
  imgSrc,
  placeholder,
  otherClasses = "",
  route,
}: Props) => {
  // ! 改使用管理 url 狀態，會自動同步 https://nuqs.47ng.com/
  const [inputValue, setInputValue] = useState("");
  const [, setSearchQuery] = useQueryState("query", {
    defaultValue: "",
    shallow: false,
  });

  const debouncedValue = useDebounce(inputValue);

  useEffect(() => {
    setSearchQuery(debouncedValue);
  }, [debouncedValue, setSearchQuery]);

  return (
    <div
      className={`background-light800_darkgradient flex min-h-[56px] grow items-center gap-4
        rounded-[10px] px-4 ${otherClasses}`}
    >
      <Image
        src={imgSrc}
        width={24}
        height={24}
        alt="Search"
        className="cursor-pointer"
      />
      <Input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="paragraph-regular no-focus placeholder text-dark400_light700 border-none
          shadow-none"
      />
    </div>
  );
};

export default LocalSearch;
