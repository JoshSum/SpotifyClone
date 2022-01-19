import { useSession } from "next-auth/react"
import { ChevronDownIcon } from "@heroicons/react/outline"
import { useEffect, useState } from "react";
import { shuffle } from "lodash";

const randomColors =[
    "from-black-500",
    "from-white-500",
    "from-slate-500",
    "from-gray-500",
    "from-zinc-500",
    "from-neutral-500",
    "from-stone-500",
    "from-red-500",
    "from-orange-500",
    "from-amber-500",
    "from-yellow-500",
    "from-lime-500",
    "from-green-500",
    "from-emerald-500",
    "from-teal-500",
    "from-cyan-500",
    "from-sky-500",
    "from-blue-500",
    "from-indigo-500",
    "from-violet-500",
    "from-purple-500",
    "from-fuchsia-500",
    "from-pink-500",
    "from-rose-500",
]
function Center() {
    const { data: session } = useSession();
    const [color, setColor] = useState(null);
    useEffect(() => {
        setColor(shuffle(randomColors).pop());
    }, [])
    return (
        <div className="flex-grow text-white">
            <header className="absolute top-5 right-8">
                <div className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2">
                    <img 
                        className="rounded-full w-10 h-10" 
                        src={session?.user.image} 
                        alt="user.profile.picture" 
                    />
                    <h2>{session?.user.name}</h2>
                    <ChevronDownIcon className="h-5 w-5"/>
                </div>
            </header>
            <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white padding-8`}>
                {/* <img src="" alt="" /> */}
                <h1>hello</h1>
            </section>
        </div>
    )
}

export default Center
