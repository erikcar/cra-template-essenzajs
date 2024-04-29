// npm run esedit -- scaffold -db -etype=sport -m

const vista = {
    name: "accettazioneVista",
    path: "src/vista",
    component: {
        //fields: "source, validate, skipCheckin",
        state: { invoice: "{ print: true, create: true, payment: 1 }" },
        //useValue: "sports, doctors",
        usemodel: {name: "folder", call: "detail"},
        root: {
            type: "vista",
            //name: null,
            vm: { intent: "CONFIRM" },
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
}

/**PATIENT */
const card = {
    name: "patientcard",
    path: "src/widget/person",
    component: {
        fields: "source, schema",
        //state: { agonistico: "source?.icertificate === 1", close: "source?.istate" },
        //useValue: "sports, doctors",
        root: {
            type: "widget",
            //name: null,
            vm: { intent: "TUTOR,PRIVACY" },
            children: [{
                type: "form",
                config: "vm.formatSchema(schema)",
                items: [
                    "Nome,name", "Cognome, surname", "Data di Nascita,dborn", "Luogo, bornplace", "Codice Fiscale, cf",
                    "Indirizzo,address", "Cap, cap", "Provincia,city", "Comune, locality", "Telefono, phone", "Cellulare, mobile", "Email, email", 
                    "Tipo Documento,address", "Numero, surname", "RIlasciato da,dborn", "Data Rilascio, bornplace",
                    "Minorenne,minor", { type: 'checkbox' },
                    "Privacy,privacy", { type: 'checkbox' }  
                ],
            }],
        }
    },
    body: {

    }
}

/**PROCEDURE CARD*/
const pcard = {
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
                    "Medico,doctorid", { type: 'select', attribute: { options: "{doctors}" }  },
                    "Note,note"
                ],
            }],
        }
    },
    body: {

    }
}

/**PROCEDURE VISTA*/
const procedure = {
    name: "procedure",
    path: "src/vista",
    component: {
        //fields: "source, validate, skipCheckin",
        //state: { invoice: "{ print: true, create: true, payment: 1 }" },
        //useValue: "sports, doctors",
        usemodel: {name: "procedure", call: "detail"},
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

const proc_detail = {
    etype: "procedure",
    children: [
        { name: "patient", etype: "patient", collection: false, link: '<--' },
        { name: "visits", etype: "visit", collection: true, link: '-->' }]
};