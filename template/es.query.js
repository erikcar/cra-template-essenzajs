exports.currentQueryProcedure = {
    etype: "procedure",
    where: "id={id}",
    children: [
        { name: "patient", etype: "patient", link: "<-" },
        { name: "visits", etype: "visit", collection: true, link: "->"}
    ]
}

exports.currentQuery = {
    etype: "procedure",
    where: "id={id}",
    join: [
        { etype: "patient", link: "<-" },
        { name: "visits", etype: "visit", collection: true, link: "->"}
    ]
}

exports.esquery = {
    parse(query){
        let etype = query.etype;
        let q =  "row_to_json(t.*)";
        if(query.collection) q = "json_agg(" + q + ")";
        q = "SELECT " + q + " FROM ( SELECT ";
        q += query.fields ? (etype + "." + query.fields.split(',').map(i => i.trim()).join(", " + etype + ".")) : (etype + ".*");

        if(query.children){
            for (let k = 0; k < query.children.length; k++) {
                const child = query.children[k];
                child.where = child.link === "<-" ? ( etype + ".id" + child.etype + "=" + child.etype + ".id") : ( etype + ".id=" + child.etype + ".id" + etype) ;
                q += ",\n(" + this.parse(child) + ") as " + child.name;
            }
        }
        q += "\n FROM " + etype ;
        if(query.where) q +=  " WHERE " + query.where;
        q += "\n)t"
        return q;
    },
} 

