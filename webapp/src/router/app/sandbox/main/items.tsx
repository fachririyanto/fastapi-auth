import { useState, useEffect } from "react";

import { useSandbox } from "@/lib/hooks/useSandbox";
import { useLocalStore } from "./store";

import {
    Table,
    TableRow,
    TableHeader,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";

import { Skeleton } from "@/components/ui/skeleton";
import { CustomPagination } from "@/components/custom/pagination";

import { ButtonActions } from "./button-actions";

export function Items() {
    const { localStore, setLocalStore } = useLocalStore();
    const [totalPage, setTotalPage] = useState<number>(0);

    useEffect(() => {
        setTotalPage(
            Math.ceil(localStore.count / localStore.filter.limit)
        );
    }, [localStore.count, localStore.filter]);

    return (
        <div className="grid gap-4">
            <div className="overflow-hidden border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted hover:bg-muted">
                            <TableHead>Sandbox Name</TableHead>
                            <TableHead className="w-[180px]">Created At</TableHead>
                            <TableHead className="w-px">&nbsp;</TableHead>
                        </TableRow>
                    </TableHeader>
                    <ItemDetails />
                </Table>
            </div>
            <CustomPagination
                currentPage={localStore.filter.page}
                totalPage={totalPage}
                pageRange={1}
                className="justify-end"
                onClickPage={(page) => {
                    setLocalStore(prev => ({
                        ...prev,
                        filter: {
                            ...prev.filter,
                            page,
                        },
                    }));
                }}
            />
        </div>
    );
}

function ItemDetails() {
    const { localStore, setLocalStore } = useLocalStore();
    const colSpan = 3;

    // load items
    const { getSandboxes } = useSandbox();
    const items = getSandboxes(localStore.filter);

    useEffect(() => {
        if (items.data) {
            setLocalStore(prev => ({
                ...prev,
                items: items.data.sandboxes,
                count: items.data.count,
                isFetching: items.isLoading,
            }));
        }
    }, [items.data, items.isLoading]);

    if (items.isError) {
        return (
            <TableBody>
                <TableRow className="hover:bg-background">
                    <TableCell colSpan={colSpan}>
                        Failed to load data.
                    </TableCell>
                </TableRow>
            </TableBody>
        );
    }

    if (localStore.isFetching) {
        return (
            <TableBody>
                <TableRow className="hover:bg-background">
                    <TableCell colSpan={colSpan}>
                        <Skeleton className="bg-muted h-4 rounded" />
                    </TableCell>
                </TableRow>
            </TableBody>
        );
    }

    if (localStore.items.length === 0) {
        return (
            <TableBody>
                <TableRow className="hover:bg-background">
                    <TableCell colSpan={colSpan}>
                        No data found.
                    </TableCell>
                </TableRow>
            </TableBody>
        );
    }

    return (
        <TableBody>
            {
                localStore.items.map((item, key) => (
                    <TableRow key={key} className="hover:bg-background">
                        <TableCell>
                            {item.sandbox_name}
                        </TableCell>
                        <TableCell>
                            {new Date(item.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                            <ButtonActions item={item} />
                        </TableCell>
                    </TableRow>
                ))
            }
        </TableBody>
    );
}