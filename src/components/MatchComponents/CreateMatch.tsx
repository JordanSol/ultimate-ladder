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
    const [character, setCharacter] = useState(characters[0]);
    const {mutate, error} = trpc.match.createMatch.useMutation({onSuccess: (data) => {
        router.push(`/matches/${data.id}`)
      }});
    return (
        <div className='fixed top-0 left-0 w-screen h-screen bg-black/30 flex justify-center items-center'>
            <div className="bg-base-100 min-w-76 rounded-sm p-10 z-10">
                <h3>Create A Match:</h3>
                <div>
                    <p>
                        Character
                    </p>
                    <select value={character?.key}>
                        {characters.map((char) => {
                            return <option key={char.key} onClick={() => setCharacter(char)} value={char.key}>{char.name}</option>
                        })}
                    </select>
                </div>
                {character !== undefined ? (
                    <button className='btn btn-sm btn-primary w-full' onClick={() => mutate({character: character.key})}>
                        CREATE
                    </button>
                ) : null}
            </div>
        </div>
    )
}

export default CreateMatch