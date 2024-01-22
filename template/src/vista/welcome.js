import { useVista, Vista } from "@essenza/react";

import { Welcome } from "../widget/welcome";

export function WelcomeVista() {
    const vm = useVista();

    return (
        <Vista>
            <Welcome />
        </Vista>
    )
}