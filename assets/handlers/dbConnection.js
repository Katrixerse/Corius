const mysql = require('mysql');
const con = mysql.createConnection({
    host: 'Your db hosts ip',
    port: 'Port its running on',
    database: 'database name',
    user: 'database user',
    password: 'database password'
});

con.connect(function (err) {
    if (err) {
        console.log(`Db failed to connect Ouput:${err.message}`);
        setTimeout(con.connect, 2000);
    }
});

con.on('error', (err) => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('DB disconnected attempting reconnection')
        con.connect((err) => {
            if (err) throw err;
            console.log('DB reconnected!')
        });
    } else {
        throw err;
    }
})
con.on('connect', () => {
    console.log(`Connected!`)
})

module.exports = {
    dbConnect: () => {
        return con
    }
}