import { useVista, useModel, Vista, ViewModel, core, UserVM, UserModel, RULES } from "@essenza/react";
import * as yup from 'yup';
import { useEffect } from "react";
import { Button } from "antd";
import { Invitein } from "../../widget/profile/invitein";

export function InviteVista() {
    const vm = useVista(InviteVVM);
    const [user, data] = useModel(UserModel);

    useEffect(() => {
        const item = vm.context.navdata;
        user.setSource(item);
    }, [user, vm]);

    return (
        <Vista>
            <div className="flex justify-center content-center pt-4">
                <div class="w-full max-w-sm p-6 shadow-md rounded-md bg-white">
                    <Invitein user={data} rules={vm.rules} roles={user.roles} enableInvite={true} />
                    <button className="btn-dark bg-sec w-full mt-4" onClick={() => vm.emit("CONFIRM")}>Conferma</button>
                </div>
            </div>
        </Vista>
    )
}

export function InviteVVM() {
    ViewModel.call(this);
    this.use(UserVM).as("user");
}

core.prototypeOf(ViewModel, InviteVVM, {
    get rules() {
        return yup.object({
            email: RULES.email(yup),
            password: RULES.password(yup),
            cpassword: RULES.confirm(yup),
        })
    },

    intent: {
        CONFIRM: async function ({ context }) {
            const form = this.user.form;
            const validation = await form.validate(true);
            if (validation.isValid) {
                const model = this.$users;
                console.log("FORM IS VALID", this.user.invite);
                const result = this.user.invited ? model.invite(validation.data) : model.create(validation.data);
                result.then(r => this.context.navigate("settings"));
            }
        },
    }
}); 