import { Character } from '@prisma/client'

export const characters = [
    {
        name: "Random",
        key: Character.RANDOM
    },
    {
        name: "Mario",
        key: Character.MARIO
    },
    {
        name: "Donkey Kong",
        key: Character.DONKEYKONG
    },
    {
        name: "Link",
        key: Character.LINK
    },
    {
        name: "Samus",
        key: Character.SAMUS
    },
    {
        name: "Dark Samus",
        key: Character.DARKSAMUS
    },
    {
        name: "Yoshi",
        key: Character.YOSHI
    },
]

export const findCharacter = (key: Character) => {
    const char = characters.find((x) => x.key === key)
    if (char !== undefined) {
        return char.name
    }
}