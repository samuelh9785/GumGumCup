//Port du serveur
var portServer = process.env.PORT || 3000;

//Inititalisation d'express
const { json } = require("express");
const cors = require('cors');
var express = require("express");
var server = express();
var urlencodedMiddlware = express.urlencoded();

server.use(urlencodedMiddlware);
server.use(cors());
server.use(express.json());
server.set("port", portServer);

// Charger les variables d'environnement
require('dotenv').config();

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


server.post("/checkLicense", bodyParser, function (req, res) {
    var licenseCode = req.body.licenseCode;

    console.log("License : " + licenseCode);

    var request = "SELECT validationTime\
                   FROM code\
                   WHERE verificationCode = ?";

    pool.query(request, [licenseCode], function (err, results, fields) {
        if (err != null) {
            console.log(err);
            res.sendStatus(500);
            return;
        }

        if (results.length === 0) {
            console.log("License not found");
            res.sendStatus(404); // Aucun résultat trouvé pour ce code de licence
            return;
        }

        var validationTime = new Date(results[0].validationTime);
        var currentTime = new Date();

        if (validationTime > currentTime) {
            console.log("License valide");
            res.sendStatus(200); // Le temps de validation n'est pas expiré
        } else {
            console.log("License invalide");
            res.sendStatus(498); // Le temps de validation est expiré
        }
    });
});


server.listen(portServer, () => {
  console.log(`Serveur en écoute sur http://localhost:${portServer}`);
});