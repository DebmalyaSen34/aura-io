import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Menu,
  User,
  FileText,
  Heart,
  MessageSquare,
  LogOut,
} from "lucide-react";

export default function SideMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (response.ok) {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  const menuItems = [
    { icon: FileText, label: "Your Incidents", href: "/user/your-incidents" },
    { icon: User, label: "Profile", href: "/user/dashboard" },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-400 hover:text-purple-500"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[300px] sm:w-[400px] bg-slate-800 border-r border-slate-700"
      >
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold text-purple-400">
            Menu
          </SheetTitle>
        </SheetHeader>
        <nav className="mt-8 flex flex-col space-y-4">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="flex items-center space-x-2 text-purple-300 hover:text-purple-100 transition-colors"
              onClick={() => setOpen(false)}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
          <Button
            variant="ghost"
            className="flex items-center justify-start space-x-2 text-red-400 hover:text-red-300 hover:bg-slate-700/50"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
