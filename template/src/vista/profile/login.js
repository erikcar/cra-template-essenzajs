import { useVista, Vista, ViewModel, core, useModel, UserModel, UserVM, RULES } from "@essenza/react";
import { Login } from "../../widget/profile/login";
import { Logo } from "../../layout/logo";
import LoginScreen from '../../assets/img/login.jpg';
import * as yup from 'yup';
import { Button } from "antd";
import { Recover } from "../../widget/profile/recover";

export function LoginVista() {
    const vm = useVista(LoginVVM);
    const [user] = useModel(UserModel);

    return (
        <Vista>
            <div className="flex flex-col place-content-center h-screen items-center">
                <Logo className="mb-6 max-w-xs" />
                <div className="w-full max-w-sm h-fit p-6 bg-white shadow-md rounded ">
                    <h1 className="my-4 text-right">
                        {vm.recover ? "Recupera password!" : ""}
                    </h1>
                    {
                        vm.recover
                            ? <Recover user={user.newInstance()} rules={vm.rules} es-id="recover" />
                            : <Login user={user.newInstance()} rules={vm.rules} />
                    }
                </div>
            </div>
        </Vista>
    )
}

export function LoginVVM() {
    ViewModel.call(this);
    this.recover = false;
    this.use(UserVM).as("log").listen("GO_RECOVER");
    this.use(UserVM, "recover").as("rec").listen("GO_LOGIN");
}

core.prototypeOf(ViewModel, LoginVVM, {
    get rules() {
        return yup.object({
            email: RULES.email(yup),
            password: RULES.password(yup),
        })
    },
    intent: {
        GO_RECOVER() {
            this.recover = true;
            this.update();
        },
        GO_LOGIN() {
            this.recover = false;
            this.update();
        }
    }
});