import { useState } from "react";
import { EllipsisVertical, Pencil, Trash } from "lucide-react";

import type { Sandbox } from "@/lib/types/sandbox";

import { Button } from "@/components/ui/button";
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

import { FormEditItem } from "./form-edit-item";
import { FormDeleteItem } from "./form-delete-item";

interface ButtonActionsProps {
    item: Sandbox;
}

export function ButtonActions({ item }: ButtonActionsProps) {
    const { localStore } = useLocalStore();

    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [menu, setMenu] = useState<string>("");

    const handleClickMenu = (menuName: string) => {
        setMenu(menuName);
        setIsDialogOpen(true);
    };

    if (!localStore.capability.canEditItem && !localStore.capability.canDeleteItem) {
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
                            <DropdownMenuItem onClick={() => handleClickMenu("menu_edit_sandbox")}>
                                <Pencil />
                                Edit
                            </DropdownMenuItem>
                        )
                    }
                    {
                        (localStore.capability.canEditItem || localStore.capability.canDeleteItem) && (
                            <DropdownMenuSeparator />
                        )
                    }
                    {
                        localStore.capability.canDeleteItem && (
                            <DropdownMenuItem className="hover:!bg-red-50" onClick={() => handleClickMenu("menu_delete_sandbox")}>
                                <Trash className="text-red-700" />
                                <span className="text-red-700">Delete Sandbox</span>
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
    item: Sandbox;
    menuName: string;
    closeDialog?: () => void;
}) {
    switch (menuName) {
        case "menu_edit_sandbox":
            return (
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Sandbox</DialogTitle>
                        <DialogDescription>
                            Update sandbox details in the platform.
                        </DialogDescription>
                    </DialogHeader>
                    <FormEditItem item={item} closeDialog={closeDialog} />
                </DialogContent>
            );
        case "menu_delete_sandbox":
            return (
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Sandbox</DialogTitle>
                        <DialogDescription>
                            Are you sure to delete the sandbox?
                        </DialogDescription>
                    </DialogHeader>
                    <FormDeleteItem item={item} closeDialog={closeDialog} />
                </DialogContent>
            );
        default:
            return null;
    }
}