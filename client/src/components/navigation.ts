import { 
  Squares2X2Icon, 
  TableCellsIcon, 
  ChartBarIcon, 
  LinkIcon 
} from "@heroicons/react/24/outline";

export const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Squares2X2Icon, current: true },
  { name: "Data Tables", href: "/tables", icon: TableCellsIcon, current: false },
  { name: "Reports", href: "/reports", icon: ChartBarIcon, current: false },
  { name: "Connections", href: "/connections", icon: LinkIcon, current: false },
];

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
