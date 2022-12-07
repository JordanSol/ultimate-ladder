import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react";

const Navbar = () => {
  const { data: sessionData } = useSession();

    return (
        <div className='w-full p-3'>
            <nav className='w-full flex justify-between items-center bg-gray-900 rounded-md p-3'>
                <Link href="/" className='btn btn-sm btn-ghost'>
                    <h5 className='font-bold text-white/80'>
                        ULTIMATE <span className='text-[hsl(280,100%,70%)]'>LADDER</span>
                    </h5>
                </Link>
                <button
                    className="btn btn-sm btn-primary"
                    onClick={sessionData ? () => signOut() : () => signIn()}
                >
                    {sessionData ? "Sign out" : "Sign in"}
                </button>
            </nav>
        </div>
    )
}

export default Navbar