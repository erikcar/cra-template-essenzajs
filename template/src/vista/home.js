import { useVista, Vista } from "@essenza/react";

import { Home } from "../widget/home";

export function HomeVista() {
    const vm = useVista();

    return (
        <Vista>
            <Home />
        </Vista>
    )
}