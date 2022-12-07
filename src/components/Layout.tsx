import type { FC } from 'react'
import Navbar from './Navbar'

interface LayoutProps {
    children: any
}

const Layout: FC<LayoutProps> = ({children}) => {
    return (
        <main className="flex flex-col min-h-screen h-full">
            <Navbar/>
            <section className='h-full grow flex flex-col items-center'>
                {children}
            </section>
        </main>
    )
}

export default Layout