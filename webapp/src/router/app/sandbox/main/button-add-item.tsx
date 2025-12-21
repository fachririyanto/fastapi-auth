import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { FormAddItem } from "./form-add-item";

export function ButtonAddItem() {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button type="button" onClick={() => setIsOpen(true)}>
                    <Plus />
                    New Sandbox
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Sandbox</DialogTitle>
                    <DialogDescription>
                        Create new sandbox in platform.
                    </DialogDescription>
                </DialogHeader>
                <FormAddItem closeDialog={() => setIsOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}