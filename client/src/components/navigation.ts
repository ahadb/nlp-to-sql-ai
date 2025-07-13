import { CircleStackIcon } from "@heroicons/react/24/outline";

export const navigation = [
  { name: "NLP to SQL", href: "#", icon: CircleStackIcon, current: true },
];

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
