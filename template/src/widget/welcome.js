import { useWidget, Widget, core, ViewModel } from "@essenza/react";
import { Button } from "antd";

export function Welcome() {
    const vm = useWidget(WelcomeVM);
    return (
        <Widget>
            <div className="w-full">
                <div className="text-center">WELCOME</div>
                <Button className="mx-auto block" onClick={e => vm.emit("GO_HOME")}>GO HOME</Button>
            </div>
        </Widget>
    )
}

export function WelcomeVM() {
    ViewModel.call(this);
}

core.prototypeOf(ViewModel, WelcomeVM, {
    intent: { //swipe or override
        GO_HOME: ({ context }) => {
            context.navigate("home");
        },
    }
});