import type { FC } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

interface LayoutProps {
    children: any
}

const Layout: FC<LayoutProps> = ({children}) => {
    return (
        <main className="flex  min-h-screen h-full">
            {/* <Navbar/> */}
            <Sidebar/>
            <div className='grow z-10 bg-base-100 transition-all'>
                <Navbar/>
                <section className='h-full grow flex flex-col items-center'>
                    {children}
                </section>
            </div>
        </main>
    )
}

export default Layout