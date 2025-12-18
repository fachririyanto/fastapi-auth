import { RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { router } from "@/router";
import { Authenticator, useAuth } from "@/components/authenticator";

const queryClient = new QueryClient();

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Authenticator>
                <AppOutlet />
            </Authenticator>
        </QueryClientProvider>
    );
}

function AppOutlet() {
    const { token } = useAuth();

    const auth = {
        token,
    };

    return <RouterProvider router={router} context={{ auth }} />;
}