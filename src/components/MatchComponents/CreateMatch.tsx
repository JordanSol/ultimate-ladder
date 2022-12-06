import {FC, useState} from 'react'
import { Character } from '@prisma/client'
import { characters } from '../../lib/characters';
import { trpc } from '../../utils/trpc';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import useUiStore from '../../utils/hooks/uiStore'

const CreateMatch: FC = () => {
    const toggleModal = useUiStore((state) => state.toggleCreateMatchModal);
    const router = useRouter();
    const [character, setCharacter] = useState();
    const [arenaId, setArenaId] = useState("");
    const [arenaPw, setArenaPw] = useState("");
    const {mutate, error} = trpc.match.createMatch.useMutation({onSuccess: (data) => {
        router.push(`/matches/${data.id}`)
      }});

    const handleOnChange = (e: any) => {
        setCharacter(e.target.value)
    };
    const handleId = (e: any) => {
        setArenaId(e.target.value)
    };
    const handlePw = (e: any) => {
        setArenaPw(e.target.value)
    };

    return (
        <div className='fixed top-0 left-0 w-screen h-screen flex justify-center items-center'>
            <div className='relative w-screen h-screen flex justify-center items-center'>
                <div className='bg-black/30 absolute top-0 left-0 w-full h-full' onClick={toggleModal}/>
                <div className="bg-base-100 min-w-76 rounded-sm p-10 z-10">
                    <h3>Create A Match:</h3>
                    <div className='flex flex-col gap-2'>
                        <select value={character} onChange={handleOnChange}>
                            <option value="" disabled selected>Select A Character</option>
                            {characters.map((char) => {
                                return <option key={char.key} value={char.key}>{char.name}</option>
                            })}
                        </select>
                        <input type="text" onChange={handleId} placeholder="Arena ID" value={arenaId} />
                        <input type="text" onChange={handlePw} placeholder="Arena Password" value={arenaPw} />
                        <button className='btn btn-sm btn-primary w-full' disabled={!character || arenaId.length < 4 || arenaPw.length === 0} onClick={() => {
                            if (character) {
                                mutate({character: character, arenaId: arenaId, arenaPw: arenaPw})
                            }}}>
                            CREATE
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateMatch