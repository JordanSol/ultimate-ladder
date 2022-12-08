import create from "zustand";

interface UiStore {
    createMatchModal: boolean,
    sidebarOpen: boolean,
    toggleCreateMatchModal: () => void,
    toggleSidebar: () => void
}

const useUiStore = create<UiStore>((set, get) => ({
    createMatchModal: false,
    sidebarOpen: false,
    toggleCreateMatchModal: () => {
        const status = !get().createMatchModal;
        set({createMatchModal: status})
    },
    toggleSidebar: () => {
        const status = !get().sidebarOpen;
        set({sidebarOpen: status})
    }
}))

export default useUiStore