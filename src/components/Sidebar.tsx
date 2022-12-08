import Link from "next/link"
import { signOut } from "next-auth/react"
import {AiOutlineHome} from 'react-icons/ai'
import {RxExit} from 'react-icons/rx'

import { useSession } from "next-auth/react"

import useUiStore from "../utils/hooks/uiStore"

const Sidebar = () => {
    const {data: session} = useSession();
    const sidebarOpen = useUiStore((state) => state.sidebarOpen);

    return (
        <div className={`${!sidebarOpen && "w-0"} relative transition-all h-screen`}>
            <div className={`${!sidebarOpen && "md:relative absolute"} h-screen p-4 flex flex-col bg-slate-900 items-center justify-between shadow-inner`}>
                <div className='flex flex-col items-center gap-2'>
                    <Link href="/" className=''>
                        <h5 className='font-bold text-white/80'>
                            U<span className='text-[hsl(280,100%,70%)]'>L</span>
                        </h5>
                    </Link>
                    <ul>
                        <li className='flex gap-2 items-center text-xl'>
                            <AiOutlineHome/>
                        </li>
                    </ul>
                </div>
                {session?.user?.image ? (
                    <button className='hover:scale-110 hover:text-white transition-all' onClick={() => signOut()}>
                        <RxExit className='text-xl' />
                    </button>
                ) : null}
            </div>
        </div>
    )
}

export default Sidebar