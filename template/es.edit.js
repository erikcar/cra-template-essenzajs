const fs = require('fs');
const fsa = require('fs/promises');
//const ts = require("typescript");
const recast = require("recast");
const { esquery, currentQuery } = require('./es.query');

const vista = {
    name: "procedure",
    path: "src/vista",
    component: {
        //fields: "source, validate, skipCheckin",
        //state: { invoice: "{ print: true, create: true, payment: 1 }" },
        //useValue: "sports, doctors",
        usemodel: { name: "procedure", call: "detail" },
        root: {
            type: "vista",
            //name: null,
            vm: { intent: "CONFIRM,CANCEL" },
            /*children: [{
                type: "form",
                config: "rules: vm.rules",
                items: [
                    "Tipo,icertificate", { type: 'select', options: ['Agonistico', 'Non Agonistico'] },
                    "Medico,iddoctor", { type: 'select', attribute: { options: "{doctors}" } },
                    "Paziente,ipatient", { type: 'select', options: ['ATLETA MAGGIORENNE', 'ATLETA MAGGIORENNE ESENTE PATOLOGIA', 'ATLETA MINORENNE ESENTE', 'ATLETA OVER 40', 'ATLETA PORTATORE DI HANDICAP'] },
                    "Disciplina, jsport", { type: 'select', attribute: { options: "{sports}" } },
                    "Num,certid", "Validità, certwidth", "Doc. Num.,ndoc", "Rilasciato da, fromdoc", "Il, ddoc"
                ],
            }],*/
        }
    },
    body: {

    }
}

const widget = {
    name: "partlist",
    path: "src/widget/part",
    component: {
        fields: "source",
        root: {
            type: "widget",
            //name: null,
            vm: { intent: "DELETE" },
        }
    },
}

const card = {
    name: "procedurecard",
    path: "src/widget/procedure",
    component: {
        fields: "source, schema",
        //state: { agonistico: "source?.icertificate === 1", close: "source?.istate" },
        useValue: "doctors",
        root: {
            type: "widget",
            //name: null,
            vm: { intent: "SAVE,CANCEL" },
            children: [{
                type: "form",
                config: "vm.formatSchema(schema)",
                items: [
                    "Sospendi,pending", { type: 'checkbox' },
                    "Fino Al,expiry", { type: 'datebox' },
                    "Provenienza Incarico,kindid", { type: 'select', options: ['LEGALE', 'ASSICURAZIONE', 'CTU', 'ARBITRATO'] },
                    "Medico,doctorid", { type: 'select', attribute: { options: "{doctors}" } },
                    "Note,note"
                ],
            }],
        }
    },
    body: {

    }
}

//console.log(recast.types.builders);
function capitalize(string) {
    return string[0].toUpperCase() + string.slice(1)
}

function ESJXFile(schema) {
    this.content = {
        import: [{ path: "react", default: "React", content: "" }],
        global: null,
        column: null,
        component: schema.component,
        hook: "",
        body: null,
        jsx: null, //{ name: "", attribute: null, children: null },
        vm: null,
    }

    this.path = schema.path;
    this.name = schema.name;
}

ESJXFile.prototype = {
    addImport(content, path) {
        let item = this.content.import.find(v => v.path === path);
        if (item) {
            const values = content.split(',');
            const actual = "," + item.content.trim().replace(" ", "") + ",";
            for (let k = 0; k < values.length; k++) {
                if (actual.indexOf("," + values[k] + ",") === -1)
                    item.content += values[k] + ", ";
            }
        }
        else
            this.content.import.push({ path, content: content + ", " });
    },

    appendHook(hook) {
        this.content.hook += hook + "\n";
    },

    prependHook(hook) {
        this.content.hook = hook + "\n" + this.content.hook;
    },

    addIntent() {

    },

    writeLine() {

    },

    inject() {

    },

    parse() {

    },

    load() {
        if (this.path) {
            try {
                this.content = fs.readFileSync(this.path, 'utf8');
                console.log(this.content);
            } catch (err) {
                console.error(err);
            }
        }
    },

    parseJsx(element, indent = "") {
        let content = indent + "<" + element.name;
        if (element.attribute) {
            for (const key in element.attribute) {
                let value = element.attribute[key];
                if (value[0] !== '{') value = '"' + value + '"';
                content += " " + key + "=" + value;
            }
        }
        content += element.text ? (">" + element.text) : ">\n";
        element.children && element.children.forEach(el => content += this.parseJsx(el, indent + "\t"))
        if (!element.text) content += indent;
        content += "</" + element.name + ">\n";
        return content;
    },

    stringify() {
        const content = this.content;
        let str = "";
        Array.isArray(content.import) && content.import.forEach(i => str += `import ${i.default ? (i.default + (i.content ? ', ' : '')) : ''} ${i.content && "{ " + i.content + " }"} from "${i.path}";\n`);
        str += "\nexport function " + (content.component.name || capitalize(this.name)) + "(";
        content.component?.fields && (str += `{${content.component.fields}}`);
        str += "){\n" + content.hook + "\n";
        if (content.jsx) {
            str += "return("
            str += this.parseJsx(content.jsx);
            str += ")\n"
        }
        str += "}"
        if (content.vm) {
            const vm = content.vm;
            str += "\n\nfunction " + vm.name + "(){\n\tViewModel.call(this);\n}\n\n";
            str += "core.prototypeOf(ViewModel, " + vm.name + ", {\n";
            str += vm.proto || "";
            if (vm.intent) {
                str += "\tintent: {\n"
                vm.intent.split(',').forEach(i => {
                    str += "\t\t" + i + "({data}){\n\t\t\tconsole.log(data);\n\t\t},\n\n";
                });
                str += "\t}\n"
            }
            str += "});\n";
        }

        if (content.column) {
            str += "\n\n" + content.column;
        }

        if (content.body) {
            str += "\n\n" + content.body;
        }

        return str;
    },

    save() {
        if (this.content) {
            if (!fs.existsSync(this.path)) {
                // If it doesn't exist, create the directory
                fs.mkdirSync(this.path);
                console.log(`Directory '${this.path}' created.`);
            }
            fs.writeFileSync(this.path + "/" + this.name + ".js", this.stringify());
        }
    },
}

const engine = {
    injectFile(schema) {
        const file = new ESJXFile(schema);
        if (schema.component) {
            const body = schema.component;
            for (const key in body) {
                if (key === "root") {
                    this.parseComponent(body[key], file)
                }
                else if (Object.hasOwnProperty.call(engine, key)) {
                    engine[key](body[key], file);
                }
            }
        }
        file.save();
    },

    parseComponent(component, file, parent) {
        parent = engine[component.type](component, file, parent);
        if (component.children) {
            for (let k = 0; k < component.children.length; k++) {
                this.parseComponent(component.children[k], file, parent);
            }
        }
    },

    parseElement(data, parent) {
        const element = { name: data.name, attribute: data.attribute, children: [] };
        //data.children && data.children.forEach(child => this.parseElement(child, element));
        parent && parent.children.push(element);
        return element;
    },

    widget: function (data, file) {
        const vm = data.vm || {};
        !vm.name && (vm.name = capitalize(file.name));
        vm.name += "VM";
        file.addImport("useWidget, Widget", "@essenza/react");
        file.prependHook(`const vm = useWidget(${vm.name});`);
        this.viewModel(vm, file);
        data.name = "Widget";
        file.content.jsx = this.parseElement(data);

        return file.content.jsx;
    },

    vista: function (data, file) {
        const vm = data.vm || {};
        !vm.name && (vm.name = capitalize(file.name));
        vm.name += "VVM";
        file.addImport("useVista, Vista", "@essenza/react");
        file.prependHook(`const vm = useVista(${vm.name});`);
        this.viewModel(vm, file);
        data.name = "Vista";
        file.content.jsx = this.parseElement(data);

        return file.content.jsx;
    },

    table: function (data, file, parent) {
        file.addImport("Table, Tooltip", "antd");
        file.addImport("useMemo", "react");
        file.addImport("MdOutlineDeleteSweep", "react-icons/md");
        file.addImport("FaEdit", "react-icons/fa");
        file.appendHook('const columns = useMemo(()=>cols(vm),[vm])');
        const defaultAttribute = { rowKey: 'id', dataSource: "{data}", columns: "{columns}", pagination: "{{ defaultPageSize: 10, pageSize: 10 }}" };
        data.attribute = Object.assign(defaultAttribute, data.attribute);
        if (data.columns) {
            file.content.column = "function cols(vm) { return ["
            data.columns.forEach(col => {
                file.content.column += `\t{ title: "${capitalize(col.name)}", dataIndex: "${col.name}", key: "id", width: 180 },\n`;
            });
            file.content.column += '\t{ title: " ", key: "id", render: (text, record) => { return (<div className="flex gap-2 items-center"><Tooltip title="Modifica" placement="bottom"><FaEdit className="text-2xl cursor-pointer" onClick={(e) => { vm.emit("EDIT", record); }} /></Tooltip><Tooltip title="Elimina" placement="bottom"><MdOutlineDeleteSweep className="text-3xl cursor-pointer" onClick={(e) => { vm.emit("DELETE", record); }} /></Tooltip></div>); }, }\n]}';
        }
        data.name = "Table";
        return this.parseElement(data, parent);
    },

    usemodel: function (data, file, parent) {
        file.addImport("useModel", "@essenza/react");
        file.addImport("useEffect", "react");
        file.addImport(capitalize(data.name)+"Model", "../../data/" + data.name);
        file.appendHook(`const [${data.name}, ${data.label || 'data'}] = useModel(${capitalize(data.name)}Model);`);
        if (data.call) {
            file.appendHook(`useEffect(() => {\n\t${data.name + '.' + data.call}(vm.context.navdata);\n}, [${data.name}])`);
        }
    },

    form: function (data, file, parent) {
        file.addImport("useForm, Form, FormItem, FormVM", "@essenza/react");
        file.appendHook(`const form = useForm(source${data.config ? ",{" + data.config + "}" : ""});`);
        const defaultAttribute = { form: "{form}", layout: 'vertical', className: 'flex flex-col gap-3' }
        data.attribute = Object.assign(defaultAttribute, data.attribute);
        data.name = "Form";
        if (data.items) {
            if (!data.children) data.children = [];
            for (let k = 0; k < data.items.length; k++) {
                const item = data.items[k];
                if (typeof item === 'string') {
                    const el = item.split(',');
                    data.children.push({ type: 'formi', attribute: { label: el[0], name: el[1].trim() }, children: [{ type: "input" }] })
                }
                else {
                    data.children[data.children.length - 1].children = [item];
                }
            }
        }
        return this.parseElement(data, parent);
    },

    formi: function (data, file, parent) {
        data.name = "FormItem";
        return this.parseElement(data, parent);
    },

    input: function (data, file, parent) {
        file.addImport("Input", "antd");
        data.name = "Input";
        return this.parseElement(data, parent);
    },

    checkbox: function (data, file, parent) {
        file.addImport("Checkbox", "antd");
        data.name = "Checkbox";
        return this.parseElement(data, parent);
    },

    datebox: function (data, file, parent) {
        file.addImport("DatePicker", "antd");
        data.name = "DatePicker";
        return this.parseElement(data, parent);
    },

    select: function (data, file, parent) {
        file.addImport("Select", "antd");
        data.name = "Select";
        const element = this.parseElement(data, parent);
        if (data.options) {
            if (!data.children) data.children = [];
            for (let k = 0; k < data.options.length; k++) {
                element.children.push({ name: "Select.Option", attrbute: { value: "{" + (k + 1) + "}" }, text: data.options[k] });
            }
        }
        return element;
    },

    state: function (data, file) {
        file.addImport("useState", "react");
        for (const key in data) {
            const value = data[key];
            file.appendHook("const [" + key + ", set" + capitalize(key) + "] = useState(" + (value || "") + ");")
        }
    },

    useValue: function (data, file) {
        file.addImport("useValue", "@essenza/react");
        data.split(',').forEach(v => {
            const value = v.trim();
            file.appendHook("const " + value + ' = useValue("' + value + '");')
        })
    },

    viewModel: function (data, file) {
        file.addImport("core, ViewModel", "@essenza/react");
        file.content.vm = data; //{ main: null, intent: {}, proto: null}
    },

    model: function (data, file) {
        file.addImport("DataModel, core", "@essenza/react");
        file.appendHook(`DataModel.call(this);\n`);
        file.content.body = `core.prototypeOf(DataModel, ${capitalize(data.etype)}Model, {
            etype: "${data.etype}",
        });`
        file.content.component.name = capitalize(data.etype) + "Model";
    },

    addSchema: function (etype, schema) {
        const source = fs.readFileSync("src/config.js", 'utf8');
        const ast = recast.parse(source);
        const b = recast.types.builders;
        //console.log(recast.print(ast).code);
        recast.visit(
            ast,
            {
                visitCallExpression: function (path) {
                    //console.log("path", path.node);
                    if (path.node.callee.property.name === "configureType") {
                        //console.log("arg", path.node.arguments[0].loc);stringLiteral;literal("AAA");
                        const id = b.identifier(etype);
                        const value = b.objectExpression(schema.map(field => b.property('init', b.identifier(field.name), b.identifier(field.dtype))));
                        const prop = b.objectProperty(id, value);
                        path.node.arguments[0].properties.push(prop);
                        return false;
                    }
                    this.traverse(path);
                },
            }
        )
        fs.writeFileSync("src/config.js", recast.print(ast).code);
        //console.log(recast.print(ast).code);
    }
}

/*engine.injectFile({
    name: "certificativecard",
    path: "src/widget/folder",
    component: {
        fields: "source, validate, skipCheckin",
        state: { agonistico: "source?.icertificate === 1", close: "source?.istate" },
        useValue: "sports, doctors",
        root: {
            type: "widget",
            //name: null,
            vm: { intent: "PRESCRIPTION,EXTRA,CERTIFICATE" },
            children: [{
                type: "form",
                config: "rules: vm.rules",
                items: [
                    "Tipo,icertificate", { type: 'select', options: ['Agonistico', 'Non Agonistico'] },
                    "Medico,iddoctor", { type: 'select', attribute: { options: "{doctors}" } },
                    "Paziente,ipatient", { type: 'select', options: ['ATLETA MAGGIORENNE', 'ATLETA MAGGIORENNE ESENTE PATOLOGIA', 'ATLETA MINORENNE ESENTE', 'ATLETA OVER 40', 'ATLETA PORTATORE DI HANDICAP'] },
                    "Disciplina, jsport", { type: 'select', attribute: { options: "{sports}" } },
                    "Num,certid", "Validità, certwidth", "Doc. Num.,ndoc", "Rilasciato da, fromdoc", "Il, ddoc"
                ],
            }],
        }
    },
    body: {

    }
});*/
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
//const baseurl = "http://localhost:5294/";//
//const baseurl = "https://localhost:7294/";
const baseurl = "http://app.maltonieassociati.it/";
async function CallApi(api, data) {
    try {
        const params = new URLSearchParams();

        if (data) {
            for (let key in data) {
                params.append(key, data[key]);
            }
        }

        const config = {
            method: "post",
            headers: { "Content-type": "application/x-www-form-urlencoded" },
            body: params
        };

        console.log("CallApi: ", baseurl + 'essenza/' + api, config)
        const res = await fetch(baseurl + 'Essenza/' + api, config);
        console.log("CallApi Response: ", res)
        /*const headerDate = res.headers && res.headers.get('date') ? res.headers.get('date') : 'no response date';
        console.log('Status Code:', res.status);
        console.log('Date in Response header:', headerDate);*/
        const result = await res.json();
        console.log("CALL API " + api + ": ", result);
        return { data: result, ok: true };

    } catch (err) {
        console.log(err.message, err);
        return { error: err.message, ok: false }//can be console.error
    }
}

//npm run esedit d=sport -- -a --b (per passare parametri con - o -- prima indicare a npm --)
process.argv.forEach(function (val, index, array) {
    console.log(index + ': ' + val);
    if (val === "scaffold") {
        console.log("SCAFFOLD COMMAND");
    }
});

const qschema = null;

const command = {
    vista: function (props) {
        engine.injectFile(vista);
    },

    widget: function (props) {
        engine.injectFile(widget);
    },

    card: function (props) {
        engine.injectFile(card);
    },

    scaffold: async function (props) {
        console.log("SCAFFOLD PROPS: ", props)
        if (props.db) {
            const response = await CallApi("einfo", { etype: props.etype });
            if (response.ok) {

                //-s CREA ETYPE SCHEMA
                props.s && engine.addSchema(props.etype, response.data);

                //-c CREA CARD
                if (props.c) {
                    engine.injectFile({
                        name: props.etype + "card",
                        path: "src/widget/" + props.etype,
                        component: {
                            fields: "source",
                            root: {
                                type: "widget",
                                //name: null,
                                vm: { intent: "SUBMIT" },
                                children: [{
                                    type: "form",
                                    config: "rules: vm.rules",
                                    items: response.data.map(field => capitalize(field.name) + "," + field.name),
                                }],
                            }
                        },
                    })
                }

                //-t CREA TABELLA
                if (props.t) {
                    engine.injectFile({
                        name: props.etype + (props.table || "Table"),
                        path: "src/widget/" + props.etype,
                        component: {
                            fields: "source",
                            usemodel: {name: props.etype, call: "collection"},
                            root: {
                                type: "widget",
                                vm: { intent: "DETAIL" },
                                children: [{
                                    type: "table",
                                    columns: response.data.map(field => { return { name: field.name } }),
                                }],
                            }
                        },
                    })
                }

                //-m CREA MODELLO
                if (props.m) {
                    engine.injectFile({
                        name: props.etype,
                        path: "src/data/",
                        component: {
                            model: { etype: props.etype },
                        },
                    })
                }
            }
        }
    },

    query() {
        console.log(esquery.parse(currentQuery));
    }
}

function Execute() {
    const args = process.argv;
    let i = 2;
    let v;
    const commands = {};
    while (i < args.length) {
        v = args[i];
        if (v[0] !== '-') {
            let command = {};
            commands[v] = command;
            v = args[++i];
            while (i < args.length && v[0] === '-') {
                const kv = v.split('=');
                const key = kv[0].replace('-', '');
                command[key] = kv.length === 2 ? kv[1] : true;
                v = args[++i];
            }
        }
        i++;
    }
    console.log(commands);

    for (const key in commands) {
        if (Object.hasOwnProperty.call(command, key)) {
            command[key](commands[key]);
        }
    }
}

Execute();
//npm run esedit -- scaffold -db -etype=sport -m

async function readAsync(path) {
    try {
        const data = await fsa.readFile('/Users/joe/test.txt', { encoding: 'utf8' });
        console.log(data);
        return data;
    } catch (err) {
        console.log(err);
    }
}

const template = {
    widget(schema) {
        const file = new ESJXFile(schema);
        if (schema.body) {
            const body = schema.body;
            for (const key in body) {
                if (Object.hasOwnProperty.call(engine, key)) {
                    engine[key](body[key], file);
                }
            }
        }
        file.save();
    },

    widgetForm(data) {

    },

    widgetTable(data) {

    },
}





