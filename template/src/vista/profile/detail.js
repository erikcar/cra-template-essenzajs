import { useVista, useModel, Vista, ViewModel, core, UserVM, UserModel } from "@essenza/react";
import { Button } from "antd";
import { useEffect } from "react";
import { Profile } from "../../widget/profile/profile";

export function UserVista() {
    const vm = useVista(UserVVM);
    const [user, data] = useModel(UserModel);

    useEffect(() => {
        const item = vm.context.navdata;
        user.item(item.id);
    }, [user, vm]);

    return (
        <Vista>
            <div className="flex place-content-center h-full items-center pt-4">
                <div class="w-full max-w-sm p-6 bg-white shadow-md drop-shadow rounded-xl ">
                    <Profile user={data} rules={vm.rules} roles={user.roles}/>
                    <button className="btn-dark bg-sec w-full mt-4" onClick={() => vm.emit("SAVE")}>Salva</button>
                </div>
            </div>
        </Vista>
    )
}

export function UserVVM() {
    ViewModel.call(this);
    this.use(UserVM).as("user");
}

core.prototypeOf(ViewModel, UserVVM, {
    rules: null,
    intent: {
        SAVE: async function () {
            const form = this.user.form;
            const validation = await form.validate(true);
            if (validation.isValid) {
                console.log("USER FORM IS VALID", validation.data);
                validation.data.save();
            }
        },
    }
}); 