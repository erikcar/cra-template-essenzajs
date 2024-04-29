import { useVista, useModel, Vista, ViewModel, core, UserVM, UserModel } from "@essenza/react";
import { Button, notification } from "antd";
import { useEffect } from "react";
import { Profile } from "../../widget/profile/profile";
import { Password } from "../../widget/profile/password";

export function ProfileVista() {
    const vm = useVista(ProfileVVM);
    const [user, data] = useModel(UserModel);

    useEffect(() => {
        user.profile();
    }, [user, vm]);

    return (
        <Vista>
            <div className="flex flex-col pt-3 max-w-md mx-auto gap-3">
                <Button onClick={() => window.location.replace(window.location.origin)} type="text" className="bg-gray-400" ><b>LOGOUT</b></Button>
                <div class="w-full max-w-md p-6 bg-white shadow-md rounded-lg ">
                    <Profile es-id="profile" user={data} rules={vm.rules} />
                    <button className="btn-dark bg-green-800 mt-3 w-full" onClick={() => vm.emit("SAVE")}>Salva</button>
                </div>
                <div class="w-full max-w-md p-6 bg-white drop-shadow shadow-md  rounded-xl ">
                    <Password user={data} rules={vm.rules} />
                </div>
            </div>
        </Vista>
    )
}

export function ProfileVVM() {
    ViewModel.call(this);
    this.bind(UserVM, "profile").as("profile");
    this.use(UserVM).listen("PASSWORD_CHANGE", ()=>{
        notification.success({message: "Password aggiornata con successo"})
    });
}

core.prototypeOf(ViewModel, ProfileVVM, {
    rules: null,
    intent: {
        SAVE: async function () {
            const form = this.profile.form;
            const validation = await form.validate(true);
            if (validation.isValid) {
                console.log("USER FORM IS VALID", validation.data);
                validation.data.save().then(()=>notification.success({message: "Profilo aggiornato con successo"}));
            }
        },
    }
}); 