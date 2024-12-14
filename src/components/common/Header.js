import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import SideMenu from "./sideMenu";

export default function Header({ nameSymbol }) {
  return (
    <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-xl fixed top-0 w-full z-50">
      <div className="w-full flex items-center justify-between h-14 px-4">
        <div className="flex items-center space-x-4">
          <SideMenu />
          <Link
            href="/"
            className="text-xl font-semibold text-purple-400 hover:text-purple-300 transition-colors"
          >
            Aura.io
          </Link>
        </div>
        <Link href="/user/dashboard">
          <Avatar className="h-8 w-8 bg-purple-600 hover:bg-purple-500 transition-colors">
            <AvatarFallback>{nameSymbol}</AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  );
}
