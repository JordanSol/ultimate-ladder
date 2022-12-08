import Link from "next/link"
import Image from "next/image"
import {AiOutlineHome} from 'react-icons/ai'
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
                    <div className="avatar">
                        <div className="w-10 rounded-full ring-1 ring-primary ring-offset-base-100 ring-offset-2">
                            <Image src={session?.user?.image} alt="User Image" width={50} height={50}/>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    )
}

export default Sidebar