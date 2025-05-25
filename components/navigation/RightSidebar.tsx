import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { auth, signOut } from "@/auth";
import ROUTES from "@/constants/routes";

import NavLinks from "./navbar/NavLinks";
import TagCard from "../cards/TagCard";
import { Button } from "../ui/button";

const hotQuestions = [
  { _id: "1", title: "How to create a custom hook in React?" },
  { _id: "2", title: "How to use React Query?" },
  { _id: "3", title: "How to use Redux?" },
  { _id: "4", title: "How to use React Router?" },
  { _id: "5", title: "How to use React Context?" },
];

const popularTags = [
  { _id: "1", name: "react", questions: 100 },
  { _id: "2", name: "javascript", questions: 200 },
  { _id: "3", name: "typescript", questions: 150 },
  { _id: "4", name: "nextjs", questions: 50 },
  { _id: "5", name: "react-query", questions: 75 },
];

const RightSidebar = async () => {
  // TODO: 暫時寫死
  const userId = 0;
  const session = await auth();

  return (
    <section
      className="custom-scrollbar background-light900_dark200 light-border shadow-light-300
        sticky top-0 right-0 flex h-screen w-[350px] flex-col gap-6 overflow-y-auto
        border-l p-6 pt-36 max-xl:hidden dark:shadow-none"
    >
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {hotQuestions.map(({ _id, title }) => {
            return (
              <Link
                key={_id}
                href={ROUTES.PROFILE(_id)}
                className="flex-between cursor-pointer gap-7"
              >
                <p className="body-medium text-dark500_light700">{title}</p>
                <Image
                  src="/icons/chevron-right.svg"
                  alt="Chevorn"
                  width={20}
                  height={20}
                  className="inverted-colors"
                />
              </Link>
            );
          })}
        </div>
      </div>
      <div>
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
        <div className="mt-7 flex w-full flex-col gap-4">
          {popularTags.map(({ _id, name, questions }) => {
            return (
              <TagCard
                key={_id}
                _id={_id}
                name={name}
                questions={questions}
                showCount
                compact
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
