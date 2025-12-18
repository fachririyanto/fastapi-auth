import { atom, useAtom } from "jotai";

interface AppStore {
    pageTitle: string;
}

const appStore = atom<AppStore>({
    pageTitle: "Home",
});

export const useAppStore = () => {
    const [store, setStore] = useAtom(appStore);
    return { store, setStore };
};