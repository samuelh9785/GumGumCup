//Port du serveur
var portServer = process.env.PORT || 3000;

//Inititalisation d'express
const { json } = require("express");
var express = require("express");
var server = express();
var urlencodedMiddlware = express.urlencoded();

server.use(urlencodedMiddlware);
server.set("port", portServer);

//Initialisation de body-parser
const bodyParser = require("body-parser").json();

//Initialisation de MySQL2
var mysql = require("mysql2");

var pool = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
	port: process.env.DATABASE_PORT,
    waitForConnections: true,
    connectionLimit: 20,
    queueLimit: 0
});


server.get("/checkLicense", bodyParser, function (req, res) {
    var licenseCode = req.body.licenseCode;

    var request = "SELECT validationTime\
                   FROM code\
                   WHERE verificationCode = ?";

    res.sendStatus(200);

    pool.query(request, [licenseCode], function (err, results, fields) {
        if (err != null) {
            console.log(err);
            res.sendStatus(404);
            return;
        }

        res.sendStatus(200);
    });
});

server.listen(portServer, () => {
  console.log(`Serveur en écoute sur http://localhost:${portServer}`);
});