import { useState, useCallback } from "react";
import { LoaderCircle } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";

export function FormLogin() {
    return (
        <form>
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                    />
                </Field>
                <Field>
                    <div className="flex items-center">
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <a
                            href="#"
                            className="ml-auto text-sm underline-offset-4 hover:underline"
                            >
                            Forgot your password?
                        </a>
                    </div>
                    <Input id="password" type="password" required />
                </Field>
                <Field>
                    <Button type="submit">
                        Login
                    </Button>
                    <FieldDescription className="text-center">
                        Don&apos;t have an account? <a href="#">Sign up</a>
                    </FieldDescription>
                </Field>
            </FieldGroup>
        </form>
    );
}