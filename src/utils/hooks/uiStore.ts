import create from "zustand";

interface UiStore {
    createMatchModal: boolean,
    toggleCreateMatchModal: () => void;
}

const useUiStore = create<UiStore>((set, get) => ({
    createMatchModal: false,
    toggleCreateMatchModal: () => {
        const modal = !get().createMatchModal
        set({createMatchModal: modal})
    }
}))

export default useUiStore