import React, { useEffect } from 'react';
import { useWidget, UserVM, Widget, useForm, Form, FormItem } from "@essenza/react";

import { Button, Input } from 'antd';

export function Login({ user, rules }) {
    const vm = useWidget(UserVM);
    const form = useForm(user, { rules });

    console.log("LOGIN RENDER");

    useEffect(() => {
        let instance = form.target.getFieldInstance("email");
        instance.focus();
    }, []);

    return (
        <Widget>
            <Form form={form} layout='vertical' className="flex flex-col gap-3" >
                <FormItem label="Email" name="email">
                    <Input placeholder="Email"></Input>
                </FormItem>
                <FormItem label="Inserisci Password" name="password">
                    <Input.Password placeholder="password"></Input.Password>
                </FormItem>
                <button className="btn-dark bg-sec w-full mt-2" onClick={() => vm.emit("LOGIN")}>
                    Login
                </button>
                <Button className='float-right text-blue-900 mt-2' type="text" onClick={()=>vm.emit("GO_RECOVER")}>Password dimenticata?</Button>
            </Form>
        </Widget>
    )
}