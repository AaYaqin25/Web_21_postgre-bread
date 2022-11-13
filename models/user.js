class Manipulation {

    static read(db, page, word, link, callback) {
        const sortBy = word.sortBy || 'id'
        const sortMode = word.sortMode || 'asc'
        const url = link == '/' ? '/?page=1&sortBy=id&sortMode=asc' : link 
        let param = [];
        let value = [];
        let counter = 1;
        const limit = 3
        const offset = (page - 1) * limit
        
        if (word.idch == 'on' && word.id != '') {
            param.push(`id = $${counter++} `)
            value.push(`${word.id}`)
        }

        if (word.stringch == 'on' && word.string != '') {
            param.push(`string LIKE '%' || $${counter++} || '%'`)
            value.push(`${word.string}`)
        }

        if (word.integerch == 'on' && word.integer != '') {
            param.push(`integer = $${counter++} `)
            value.push(`${word.integer}`)
        }

        if (word.floatch == 'on' && word.float != '') {
            param.push(`float = $${counter++} `)
            value.push(`${word.float}`)
        }

        if (word.datech == 'on' && word.startdate != '' && word.enddate != '') {
            param.push(`date BETWEEN $${counter++}  AND $${counter++} `)
            value.push(`${word.startdate}`)
            value.push(`${word.enddate}`)
        }

        if (word.booleanch == 'on' && word.boolean != '') {
            param.push(`boolean = $${counter++} `)
            value.push(`${word.boolean}`)
        }


        let syntax = "SELECT COUNT(*) AS total FROM manipulate"
        if (param.length > 0) {
            syntax += ` WHERE ${param.join(' AND ')}`
        }
        
        db.query(syntax, value, (err, data) => {
            if (err) return console.log("gagal", err);
            
            const jumlah = data.rows[0].total
            const jumlahPage = Math.ceil(jumlah / limit)

            syntax = "SELECT * FROM manipulate"
            if (param.length > 0) {
                syntax += ` WHERE ${param.join(' AND ')}`
            } 

            syntax += ` ORDER BY ${sortBy} ${sortMode} LIMIT $${counter++}  OFFSET $${counter++} `

            console.log(syntax);
            db.query(syntax, [...value, limit, offset], (err, data) => {
                if (err) return console.log("gagal", err);
                callback(
                    data.rows,
                    jumlahPage,
                    offset,
                    url
                )
            })
        })
        
        
    }

    static add(db, str, int, flt, dte, bon, callback) {
        db.query("INSERT INTO manipulate(string, integer, float, date, boolean) VALUES ($1, $2, $3, $4, $5)", [str, int, flt, dte, bon], (err, data) => {
            if (err) return console.log("gagal", err);
            callback(data.rows);
        })
    }

    static delete(db, del, callback) {
        db.query("DELETE FROM manipulate WHERE manipulate.id = $1", [del], (err, data) => {
            if (err) return console.log("gagal", err);
            callback(data.rows);
        })
    }

    static showUpdate(db, id, callback) {
        db.query("SELECT * FROM manipulate WHERE manipulate.id = $1", [id], (err, data) =>{
            if (err) return console.log("gagal", err);
            callback(data.rows[0]);
        })
    }

    static update(db, str, int, flt, dte, bon, id, callback) {
        db.query("UPDATE manipulate SET string = $1, integer = $2, float = $3, date = $4, boolean = $5 WHERE manipulate.id = $6", [str, int, flt, dte, bon, id], (err) => {
            if (err) return console.log("gagal", err);
            callback()
        })
    }
}

module.exports = Manipulation;