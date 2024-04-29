import { useWidget, Widget, core, ViewModel } from "@essenza/react";
//import { HomeVM } from "./homevm";

export function Home() {
    const vm = useWidget(HomeVM);
    return (
        <Widget>
            <div>HOME</div>
            <button onClick={e=>vm.emit("GOTO")}>LOADING</button>
        </Widget>
    )
}

export function HomeVM(){
    ViewModel.call(this);
}

core.prototypeOf(ViewModel, HomeVM, {
    intent: { //swipe or override
        GOTO_ADMIN: ({ context }) => {
            context.navigate("/");
        },
    }
});