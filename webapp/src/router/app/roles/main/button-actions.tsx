import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { EllipsisVertical, Pencil, Trash } from "lucide-react";

import { useAuth } from "@/components/authenticator";
import type { Role } from "@/lib/types/role";

import { Button } from "@/components/ui/button";
import { isSuperAdminRole } from "@/lib/utils/role";
import { useLocalStore } from "./store";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { FormDeleteItem } from "./form-delete-item";

interface ButtonActionsProps {
    item: Role;
}

export function ButtonActions({ item }: ButtonActionsProps) {
    const { user } = useAuth();
    const { localStore } = useLocalStore();

    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [menu, setMenu] = useState<string>("");

    const handleClickMenu = (menuName: string) => {
        setMenu(menuName);
        setIsDialogOpen(true);
    };

    if (
        isSuperAdminRole(item.role_id)
        || user?.role === item.role_id
        || (!localStore.capability.canEditItem && !localStore.capability.canDeleteItem)
    ) {
        return <span className="block h-8"></span>;
    }

    return (
        <>
            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <DropdownMenuTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        className="w-8"
                        onClick={() => setIsMenuOpen(true)}
                        >
                        <EllipsisVertical />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[180px]">
                    {
                        localStore.capability.canEditItem && (
                            <Link to={`/app/roles/edit/${item.role_id}`}>
                                <DropdownMenuItem>
                                    <Pencil />
                                    Edit Role
                                </DropdownMenuItem>
                            </Link>
                        )
                    }
                    {
                        (localStore.capability.canEditItem || localStore.capability.canDeleteItem) && (
                            <DropdownMenuSeparator />
                        )
                    }
                    {
                        localStore.capability.canDeleteItem && (
                            <DropdownMenuItem className="hover:!bg-red-50" onClick={() => handleClickMenu("menu_delete_role")}>
                                <Trash className="text-red-700" />
                                <span className="text-red-700">Delete Role</span>
                            </DropdownMenuItem>
                        )
                    }
                </DropdownMenuContent>
            </DropdownMenu>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <MenuFormOutlet
                    item={item}
                    menuName={menu}
                    closeDialog={() => setIsDialogOpen(false)}
                />
            </Dialog>
        </>
    );
}

function MenuFormOutlet({
    item,
    menuName,
    closeDialog,
}: {
    item: Role;
    menuName: string;
    closeDialog?: () => void;
}) {
    switch (menuName) {
        case "menu_delete_role":
            return (
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete User</DialogTitle>
                        <DialogDescription>
                            Are you sure to delete the user?
                        </DialogDescription>
                    </DialogHeader>
                    <FormDeleteItem item={item} closeDialog={closeDialog} />
                </DialogContent>
            );
        default:
            return null;
    }
}