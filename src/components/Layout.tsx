import type { FC } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

interface LayoutProps {
    children: any
}

const Layout: FC<LayoutProps> = ({children}) => {
    return (
        <main className="flex max-h-screen h-screen overflow-hidden">
            {/* <Navbar/> */}
            <Sidebar/>
            <div className='grow z-10 bg-base-100 transition-all flex flex-col'>
                <Navbar/>
                <section className='h-full w-full grow flex flex-col items-center overflow-auto'>
                    {children}
                </section>
            </div>
        </main>
    )
}

export default Layout