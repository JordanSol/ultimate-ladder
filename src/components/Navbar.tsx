import Link from "next/link"

const Navbar = () => {
    return (
        <div className='w-full p-2'>
            <nav className='w-full flex justify-between bg-gray-900 rounded-md p-3'>
                <Link href="/">
                    <h5 className='font-bold'>
                        ULTIMATE LADDER
                    </h5>
                </Link>
            </nav>
        </div>
    )
}

export default Navbar