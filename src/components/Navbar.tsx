import Link from "next/link"
import Image from "next/image";
import useUiStore from "../utils/hooks/uiStore";
import { useSession, signIn, signOut } from "next-auth/react";

const Navbar = () => {
  const { data: sessionData } = useSession();
  const toggleSidebar = useUiStore((state) => state.toggleSidebar)

    return (
        <nav className='w-full flex justify-between items-center py-4 px-4 md:px-8 lg:px-10 absolute left-0 top-0 z-10'>
            <button className="btn btn-square btn-sm btn-ghost" onClick={() => toggleSidebar()}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
            {sessionData ? (
                <>                
                {sessionData?.user?.image ? (
                    <Link href={`/user/${sessionData.user.id}`}>
                        <div className="avatar">
                            <div className="w-10 rounded-full ring-1 ring-primary ring-offset-base-100 ring-offset-2">
                                <Image src={sessionData?.user?.image} alt="User Image" width={50} height={50}/>
                            </div>
                        </div>
                    </Link>
                ) : null}
                </>
            ) : (
            <button
                className="btn btn-sm btn-primary"
                onClick={sessionData ? () => signOut() : () => signIn()}
            >
                {sessionData ? "Sign out" : "Sign in"}
            </button>

            )}
        </nav>
        
    )
}

export default Navbar