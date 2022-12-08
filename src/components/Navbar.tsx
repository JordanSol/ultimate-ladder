import Link from "next/link"
import useUiStore from "../utils/hooks/uiStore";
import { useSession, signIn, signOut } from "next-auth/react";

const Navbar = () => {
  const { data: sessionData } = useSession();
  const toggleSidebar = useUiStore((state) => state.toggleSidebar)

    return (
        <nav className='w-full flex justify-between items-center p-4'>
            <button className="btn btn-square btn-sm btn-ghost" onClick={() => toggleSidebar()}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
            <button
                className="btn btn-sm btn-primary"
                onClick={sessionData ? () => signOut() : () => signIn()}
            >
                {sessionData ? "Sign out" : "Sign in"}
            </button>
        </nav>
        
    )
}

export default Navbar