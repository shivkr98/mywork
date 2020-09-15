const db = require('../../database/db')

module.exports = {
    add: async (req, res) => {
        var {
            City_masterName,
            stateName,
            createdBy,
            modifiedBy

        } = req.body

        var createdOn = new Date()
        var modifiedOn = null

        isActive = 1
        var data = {
            City_masterName,
            stateName,
            createdBy,
            createdOn,
            modifiedBy,
            modifiedOn,
            isActive
        }

        db.query("SELECT * FROM city_master WHERE City_masterName = ?", [City_masterName], async function (
            error,
            results
        ) {
            console.log(results.length);
            if (results.length > 0) {
                res.json({
                    message: "city name already exist",
                });
            } else {
                let sqlRegister = "INSERT INTO city_master SET ?";
                let query = db.query(sqlRegister, data, (err, results) => {
                    if (err) throw err;
                    console.log(results);
                    res.json({
                        message: "success",
                    });
                });
            }
        });

    },


    show: async (req, res) => {

        let sqlRegister = "SELECT  `City_masterName` FROM `city_master` WHERE `city_master`.`isActive` = 1 ";
        let query = db.query(sqlRegister, (err, results) => {
            if (err) throw err;
            console.log(results);
            res.json({
                message: "Success",
                results: results


            });
        });

    },

    update: async (req, res) => {

        var { City_masterName, id } = req.body;
        var modifiedOn = new Date()

        var sql = "UPDATE `city_master` SET `City_masterName` = ? , `modifiedOn` = ? WHERE `city_master`.`id` = ?";


        console.log(sql)

        let query = db.query(sql, [City_masterName, modifiedOn, id], (err, results) => {

            if (err) throw err;
            console.log(results);
            res.json({
                message: "Success updated",

            });
        }

        )
    },

    delete: async (req, res) => {

        var { id } = req.body;
        var modifiedOn = new Date()

        var sql = "UPDATE `city_master` SET `isActive` = 0 , `modifiedOn` = ? WHERE `city_master`.`id` = ?";



        console.log(sql)

        let query = db.query(sql, [modifiedOn, id], (err, results) => {

            if (err) throw err;
            console.log(results);
            res.json({
                message: "Successfully deleted ",



            });
        }

        )
    }


}