import { useEffect } from "react";
import { BadgeCheck } from "lucide-react";

import { useUser } from "@/lib/hooks/useUser";
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
import { Badge } from "@/components/ui/badge";

import { ButtonChangeStatus } from "./button-change-status";
import { ButtonActions } from "./button-actions";

export function Items() {
    return (
        <div className="overflow-hidden border rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted hover:bg-muted">
                        <TableHead>Full Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Verified At</TableHead>
                        <TableHead>Created At</TableHead>
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
    const colSpan = 7;

    // load items
    const { getUsers } = useUser();
    const items = getUsers();

    useEffect(() => {
        if (items.data) {
            setLocalStore(prev => ({
                ...prev,
                items: items.data.users,
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
                            {item.full_name}
                        </TableCell>
                        <TableCell>
                            <span className="inline-flex gap-2">
                                {item.email}
                                {
                                    item.is_verified ? (
                                        <Badge className="bg-blue-500">
                                            <BadgeCheck />
                                            Verified
                                        </Badge>
                                    ) : (
                                        <Badge variant="destructive">Not verified</Badge>
                                    )
                                }
                            </span>
                        </TableCell>
                        <TableCell>
                            {item.role_name}
                        </TableCell>
                        <TableCell>
                            <span className="inline-flex gap-2 items-center">
                                <ButtonChangeStatus item={item} />
                                {
                                    item.is_active ? (
                                        <Badge className="bg-green-600">Active</Badge>
                                    ) : (
                                        <Badge variant="destructive">Inactive</Badge>
                                    )
                                }
                            </span>
                        </TableCell>
                        <TableCell>
                            {
                                item.is_verified ? (
                                    new Date(item.verified_at).toLocaleDateString()
                                ) : (
                                    <>&mdash;</>
                                )
                            }
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