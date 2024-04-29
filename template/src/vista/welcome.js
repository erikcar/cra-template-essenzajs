import { useVista, Vista, core, ViewModel, RULES } from "@essenza/react";
import Logo from "../assets/img/logo.png";
import { FirstAccess } from "../widget/profile/firstaccess";
import * as yup from 'yup';

export function WelcomeVista() {
    const vm = useVista(WelcomeVVM);

    let content;

    if (vm.firstaccess)
        content = <FirstAccess user={vm.firstaccess.user} rules={vm.farules} token={vm.firstaccess.token} id={vm.firstaccess.id} />
    else
        content = <div className="loader mx-auto d-block"></div>;

    return (
        <Vista>
            <div className="flex items-center justify-center w-full h-screen" >
                <div className="w-full max-w-md">
                    <img src={Logo} alt="Logo" className="mb-8 max-w-xs mx-auto block" />
                    {content}
                </div>
            </div>

            {/* <Button>Login</Button> */}
        </Vista>
    )
}

export function WelcomeVVM() {
    ViewModel.call(this);
    this.firstaccess = false;
    this.context.listen("URL_REQUEST", token => {
        if (token.data.request === "FAREQ") {
            this.firstaccess = token.data.params;
            this.firstaccess.user = this.context.newInstance("users", { email: token.data.params.email, id: token.data.params.id, token: token.data.params.token });
            this.update();
        }
    })
}

core.prototypeOf(ViewModel, WelcomeVVM, {
    get farules() {
        return yup.object({
            //email: RULES.email(yup),
            password: RULES.password(yup),
            cpassword: RULES.confirm(yup),
        })
    },

    intent: { //swipe or override
        GO_HOME: ({ context }) => {
            context.navigate("home");
        },
    }
});