class Manipulation {

    static read(db, page, word, link, callback) {

        let value = [];
        const url = link == '/' ? '/?page = 1' : link 
        const limit = 3
        const offset = (page - 1) * limit
        
        if (word.idch == 'on' && word.id != '') {
            value.push(`id = ${word.id}`)
        }

        if (word.stringch == 'on' && word.string != '') {
            value.push(`string LIKE '%${word.string}%'`)
        }

        if (word.integerch == 'on' && word.integer != '') {
            value.push(`integer = ${word.integer}`)
        }

        if (word.floatch == 'on' && word.float != '') {
            value.push(`float = ${word.float}`)
        }

        if (word.datech == 'on' && word.startdate != '' && word.enddate != '') {
            value.push(`date BETWEEN '${word.startdate}' AND '${word.enddate}'`)
        }

        if (word.booleanch == 'on' && word.boolean != '') {
            value.push(`boolean = '${word.boolean}'`)
        }


        let syntax = "SELECT COUNT(*) AS total FROM manipulate"
        if (value.length > 0) {
            syntax += ` WHERE ${value.join(' AND ')}`
        }
        
        db.query(syntax, (err, data) => {
            if (err) return console.log("gagal", err);
            
            const jumlah = data.rows[0].total
            const jumlahPage = Math.ceil(jumlah / limit)


            syntax = "SELECT * FROM manipulate"
            if (value.length > 0) {
                syntax += ` WHERE ${value.join(' AND ')}`
            } 
            syntax += ` LIMIT ${limit} OFFSET ${offset}`

            
            db.query(syntax, (err, data) => {
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