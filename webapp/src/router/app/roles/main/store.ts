import { atom, useAtom } from "jotai";

import type { Role } from "@/lib/types/role";

interface LocalStore {
    items: Role[];
    count: number;
    isFetching: boolean;
    filter: {
        search: string;
        page: number;
        limit: number;
    };
    capability: {
        canAddItem: boolean;
        canEditItem: boolean;
        canDeleteItem: boolean;
    };
}

const localStoreAtom = atom<LocalStore>({
    items: [],
    count: 0,
    isFetching: true,
    filter: {
        search: "",
        page: 1,
        limit: 10,
    },
    capability: {
        canAddItem: false,
        canEditItem: false,
        canDeleteItem: false,
    },
});

export const useLocalStore = () => {
    const [localStore, setLocalStore] = useAtom(localStoreAtom);
    return { localStore, setLocalStore };
};