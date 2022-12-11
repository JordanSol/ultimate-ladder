import React, {type FC, useState} from 'react'
import { trpc } from '../../utils/trpc';
import { useRouter } from 'next/router';
import useUiStore from '../../utils/hooks/uiStore'
import { motion } from 'framer-motion';

const CreateMatch: FC = () => {
    const toggleModal = useUiStore((state) => state.toggleCreateMatchModal);
    const router = useRouter();
    const [arenaId, setArenaId] = useState("");
    const [arenaPw, setArenaPw] = useState("");
    const {mutate} = trpc.match.createMatch.useMutation({onSuccess: (data) => {
        toggleModal()
        router.push(`/matches/${data.id}`)
      }});

    const handleId = (e: any) => {
        setArenaId(e.target.value.toUpperCase())
    };
    const handlePw = (e: any) => {
        setArenaPw(e.target.value)
    };

    return (
        <motion.div className='fixed top-0 left-0 w-screen h-screen flex justify-center items-center'
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.14}}
        >
            <div className='relative w-screen h-screen flex justify-center items-center'>
                <div className='bg-black/50 absolute top-0 left-0 w-full h-full' onClick={toggleModal}/>
                <div className="bg-base-100 min-w-76 rounded-md p-10 z-10 flex flex-col gap-2">
                    <h3 className='font-bold text-lg'>Create A Match:</h3>
                    <div className='flex flex-col gap-2'>
                        <input className='input input-bordered w-full max-w-sm' type="text" onChange={handleId} placeholder="Arena ID" value={arenaId} />
                        <input className='input input-bordered w-full max-w-sm' type="number" onChange={handlePw} placeholder="Arena Password" value={arenaPw} />
                        <button className='btn btn-primary w-full' disabled={ arenaId.length !== 5 || arenaPw.length === 0} onClick={() => {
                                mutate({arenaId: arenaId, arenaPw: arenaPw})}}>
                            CREATE
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default CreateMatch