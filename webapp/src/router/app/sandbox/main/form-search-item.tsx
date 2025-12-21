import { useState, useCallback, useEffect } from "react";
import { Search } from "lucide-react";

import { useLocalStore } from "./store";

import { Input } from "@/components/ui/input";

export function FormSearchItem() {
    const { localStore, setLocalStore } = useLocalStore();
    const [keyword, setKeyword] = useState<string>("");

    useEffect(() => {
        setKeyword(localStore.filter.search);
    }, [localStore.filter.search]);

    const findSandbox = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (localStore.isFetching) {
            return;
        }

        setLocalStore(prev => ({
            ...prev,
            filter: {
                ...prev.filter,
                search: keyword,
            },
        }));
    }, [keyword, localStore.isFetching]);

    return (
        <form className="relative" onSubmit={findSandbox}>
            <button
                type="button"
                className="flex absolute top-0 left-0 bottom-0 z-[1] w-10 items-center justify-center"
                >
                <Search size={18} />
            </button>
            <Input
                type="text"
                value={keyword}
                placeholder="Search sandbox"
                className="pl-10"
                onChange={(e) => setKeyword(e.target.value)}
                disabled={localStore.isFetching}
            />
        </form>
    );
}