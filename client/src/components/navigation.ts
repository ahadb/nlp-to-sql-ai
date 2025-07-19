import { CircleStackIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

export const navigation = [
  { name: "NLP to SQL", href: "#", icon: CircleStackIcon, current: true },
  { name: "Explain SQL", href: "#", icon: DocumentTextIcon, current: false },
];

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
