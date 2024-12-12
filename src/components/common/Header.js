import { Avatar, AvatarFallback } from "../ui/avatar";

export default function Header({nameSymbol}){
    return(
        <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl fixed top-0 w-full z-50">
                <div className="container flex items-center justify-between h-14 px-4">
                    <h1 className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-slate-600 bg-clip-text text-transparent">
                        Aura.io
                    </h1>
                    <Avatar className="h-8 w-8 bg-purple-600">
                        <AvatarFallback>{nameSymbol}</AvatarFallback>
                    </Avatar>
                </div>
            </header>
    )
}