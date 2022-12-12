import type { FC } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import {motion, AnimatePresence} from 'framer-motion'
import { useRouter } from 'next/router'

interface LayoutProps {
    children: any
}

const Layout: FC<LayoutProps> = ({children}) => {
    const router = useRouter()
    return (
        <main className="flex max-h-screen h-screen overflow-hidden">
            {/* <Navbar/> */}
            <Sidebar/>
            <div className='grow z-10 bg-base-100 transition-all flex flex-col relative overflow-x-visible'>
                <Navbar/>
                <AnimatePresence exitBeforeEnter>
                    <motion.section className='h-full w-full grow flex flex-col items-center overflow-auto'
                        initial={{opacity: 0, scale: 0.98, y: 5}}
                        animate={{opacity: 1, scale: 1, y: 0}}
                        exit={{opacity: 0, scale: 0.98, y: 5}}
                        transition={{duration: 0.12}}
                        key={router.route}
                    >
                        {children}
                    </motion.section>
                </AnimatePresence>
            </div>
        </main>
    )
}

export default Layout