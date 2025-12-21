import { atom, useAtom } from "jotai";

interface MenuAccess {
    canAccessRole: boolean;
    canAccessUser: boolean;
    canAccessSandbox: boolean;
}

interface AppStore {
    pageTitle: string;

    // menu access
    isLoadingMenuAccess: boolean;
    menuAccess: MenuAccess;
}

const appStore = atom<AppStore>({
    pageTitle: "Home",
    isLoadingMenuAccess: true,
    menuAccess: {
        canAccessRole: false,
        canAccessUser: false,
        canAccessSandbox: false,
    },
});

export const useAppStore = () => {
    const [store, setStore] = useAtom(appStore);
    return { store, setStore };
};