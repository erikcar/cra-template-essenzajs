import { Link, bool, small, string, decimal, double, float, int, long, date, money, char } from "@essenza/react";

export function ConfigureApp(app){
    app.setBaseUrl("https://localhost:7294/");

    //app.configureService({ITask: app})
    app.role.configure(["ADMIN", "USER"]);

    app.configureType({
        users: {
            fields: { id: int, name: string, surname: string, email: string, password: string, role: int, 
                username: string, nusername: string, nemail: string, emailvalid: bool, phone: string, 
                phonevalid: bool, twofactor: bool, idplatform: int, businessname: string, locked: bool, 
                dlog: date, dlast: date, cf: string, vatnumber: string, street: string, num: string, 
                locality: string, code: string, city: string, url: string, complete: bool },
        }
    });
}