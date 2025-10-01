import type { Todo } from "../types/Todo";

export const TODO_SECTIONS: Record<
  Todo["status"],
  { title: string; icon: string; bgColor: string; countStyle: string }
> = {
  todo: {
    title: "시작 전",
    icon: "⊙",
    bgColor: "bg-blue-500",
    countStyle: "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300",
  },
  inProgress: {
    title: "진행 중",
    icon: "▷",
    bgColor: "bg-orange-500",
    countStyle:
      "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300",
  },
  done: {
    title: "완료",
    icon: "✔",
    bgColor: "bg-green-500",
    countStyle:
      "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
  },
};
