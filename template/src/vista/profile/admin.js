
import { useVista, useModel, ViewModel, Vista, core, UserVM, UserModel } from "@essenza/react";
import { useEffect } from "react";
import { Button, Popconfirm, Table } from "antd";

export function UserAdminVista() {
    const vm = useVista(UserAdminVVM);

    const [user, data] = useModel(UserModel);

    useEffect(() => {
        user.collection();
    }, [user])

    return (
        <Vista>
            <button className="btn-dark bg-sec my-2" onClick={() => vm.emit("USER_INVITE", user.newInstance())}>Nuovo Utente</button>
            {Array.isArray(data) ? <Table rowKey="id" columns={Columns(vm, user.roles)} dataSource={data}></Table> : <p>Nessun utente presente</p>}
        </Vista>
    )
}

export function UserAdminVVM() {
    ViewModel.call(this);
    this.use(UserVM).as("admin").listen("USER_DETAIL").listen("USER_DELETE");
}

core.prototypeOf(ViewModel, UserAdminVVM, {
    intent: { //swipe or override
        USER_INVITE: function ({ context, data }) {
            context.navigate("invite", data);
        },

        USER_DETAIL: function ({ context, data }) {
            context.navigate("user-detail", data);
        },

        USER_DELETE: function ({ data }) {
            data.delete();
        }
    }
});

function Columns(vm, roles) {
    return [
        {
            title: "Cognome",
            dataIndex: "surname",
            key: "id",
        },
        {
            title: "Nome",
            dataIndex: "name",
            key: "id",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "id",
        },
        {
            title: "Ruolo",
            dataIndex: "itype",
            key: "id",
            render: (text, record) => {
                return Array.isArray(roles) ? (<>{roles[record.irole]}</>) : "UTENTE"
            },
            width: "100%"
        },
        {
            key: "id",
            render: (text, record) => {
                return (<Popconfirm
                    title="Elimina Utente"
                    description="Confermi di voler eliminare l'utente?"
                    onConfirm={() => vm.emit("USER_DELETE", record)}
                    okText="Si"
                    cancelText="No"
                >
                    <button className="btn-dark bg-pri" >Elimina</button>
                </Popconfirm>)
            },
        },
        {
            key: "id",
            render: (text, record) => {
                return (<button className="btn-dark bg-sec" onClick={() => vm.emit("USER_DETAIL", record)} >Modifica</button>)
            },
        },
    ]
}