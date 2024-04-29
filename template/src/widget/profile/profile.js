import { widget, UserVM, Widget, useForm, Form, FormItem } from "@essenza/react";
import { Input, Select } from 'antd';
const { Option } = Select;

export const Profile = widget( function Profile({ user, rules, roles, vm }) {
    //useWidget(UserVM);
    const form = useForm(user, { rules });
    return (
        <Widget>
            <Form form={form}  layout='vertical' className="flex flex-col gap-2" >
                <FormItem label="Nome" name="name">
                    <Input placeholder="Mario"></Input>
                </FormItem>
                <FormItem label="Cognome" name="surname">
                    <Input placeholder="Rossi"></Input>
                </FormItem>
                <FormItem label="Email" name="email">
                    <Input placeholder="email@email.it"></Input>
                </FormItem>
                <FormItem label="Telefono" name="phone">
                    <Input placeholder="contatto telefonico"></Input>
                </FormItem>
                <FormItem label="Azienda" name="businessname">
                    <Input placeholder="Nome Azienda"></Input>
                </FormItem>
                {
                    roles &&
                    <>
                        <FormItem label="Tipo" name="irole">
                            <Select placeholder="Tipo Utente" className="w100">
                                {roles.map((v, i) => <Option value={i}>{v}</Option>)}
                            </Select>
                        </FormItem>
                    </>
                }
            </Form>
        </Widget>
    )
}, UserVM)