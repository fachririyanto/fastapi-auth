import { useState } from "react";
import { EllipsisVertical, Pencil, Trash } from "lucide-react";

import { useAuth } from "@/components/authenticator";
import { isSuperAdmin } from "@/lib/utils/user";
import type { User } from "@/lib/types/user";

import { Button } from "@/components/ui/button";

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

import { FormChangeRole } from "./form-change-role";
import { FormDeleteItem } from "./form-delete-item";

interface ButtonActionsProps {
    item: User;
}

export function ButtonActions({ item }: ButtonActionsProps) {
    const { user } = useAuth();

    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [menu, setMenu] = useState<string>("");

    const handleClickMenu = (menuName: string) => {
        setMenu(menuName);
        setIsDialogOpen(true);
    };

    if (isSuperAdmin(item.user_id) || user?.user_id === item.user_id) {
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
                    <DropdownMenuItem onClick={() => handleClickMenu("menu_change_role")}>
                        <Pencil />
                        Change Role
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="hover:!bg-red-50" onClick={() => handleClickMenu("menu_delete_user")}>
                        <Trash className="text-red-700" />
                        <span className="text-red-700">Delete User</span>
                    </DropdownMenuItem>
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
    item: User;
    menuName: string;
    closeDialog?: () => void;
}) {
    switch (menuName) {
        case "menu_change_role":
            return (
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Change User Role</DialogTitle>
                        <DialogDescription>
                            Change the capability of user in the platform.
                        </DialogDescription>
                    </DialogHeader>
                    <FormChangeRole item={item} closeDialog={closeDialog} />
                </DialogContent>
            );
        case "menu_delete_user":
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