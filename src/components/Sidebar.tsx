import Link from "next/link"
import { signOut } from "next-auth/react"
import {AiOutlineHome, AiOutlineUser} from 'react-icons/ai'
import {RiMedalLine} from 'react-icons/ri'
import {RxExit} from 'react-icons/rx'

import { useSession } from "next-auth/react"

import useUiStore from "../utils/hooks/uiStore"

const Sidebar = () => {
    const {data: session} = useSession();
    const sidebarOpen = useUiStore((state) => state.sidebarOpen);

    return (
        <div className={`relative transition-all h-screen`}>
            <div className={`h-screen p-4 px-5 flex flex-col bg-slate-900 items-center justify-between shadow-inner transition-all`}>
                <div className='flex flex-col items-center gap-4'>
                    <Link href="/" className=''>
                        <h5 className='font-bold text-white/80 text-lg'>
                            U<span className='text-[hsl(280,100%,70%)]'>L</span>
                        </h5>
                    </Link>
                    <hr className='w-full border-gray-300/50'/>
                    <ul className="flex flex-col gap-5">
                        <li>
                            <Link href="/" className='flex items-center text-xl hover:text-primary'>
                                <AiOutlineHome className="transition-all shrink-0"/>
                                <span className={`text-sm w-full ml-3 ${!sidebarOpen && "w-[0px] !ml-0"} transition-all`}>
                                    {sidebarOpen && "Home"}
                                </span>
                            </Link>
                        </li>
                        <li >
                            <Link href="/" className='flex items-center text-xl hover:text-primary'>
                                <AiOutlineUser className="transition-all shrink-0"/>
                                <span className={`text-sm w-full ml-3 ${!sidebarOpen && "w-[0px] !ml-0"} transition-all`}>
                                    {sidebarOpen && "Profile"}
                                </span>
                            </Link>
                        </li>
                        <li >
                            <Link href="/ranked" className='flex items-center text-xl hover:text-primary'>
                                <RiMedalLine className="transition-all shrink-0"/>
                                <span className={`text-sm w-full ml-3 ${!sidebarOpen && "w-[0px] !ml-0"} transition-all`}>
                                    {sidebarOpen && "Ranked"}
                                </span>
                            </Link>
                        </li>
                    </ul>
                </div>
                {session?.user?.image ? (
                    <button className={`hover:scale-110 hover:text-white transition-all flex`} onClick={() => signOut()}>
                        <RxExit className='text-xl' />
                    </button>
                ) : null}
            </div>
        </div>
    )
}

export default Sidebar