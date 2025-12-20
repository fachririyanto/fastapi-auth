import { useEffect } from "react";

import { useRole } from "@/lib/hooks/useRole";
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

import { ButtonActions } from "./button-actions";

export function Items() {
    return (
        <div className="overflow-hidden border rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted hover:bg-muted">
                        <TableHead>Role Name</TableHead>
                        <TableHead className="w-[180px]">Created At</TableHead>
                        <TableHead className="w-px">&nbsp;</TableHead>
                    </TableRow>
                </TableHeader>
                <ItemDetails />
            </Table>
        </div>
    );
}

function ItemDetails() {
    const { localStore, setLocalStore } = useLocalStore();
    const colSpan = 3;

    // load items
    const { getRoles } = useRole();
    const items = getRoles();

    useEffect(() => {
        if (items.data) {
            setLocalStore(prev => ({
                ...prev,
                items: items.data.roles,
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
                            {item.role_name}
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