const db = require('../../database/db')

module.exports = {
    add: async (req, res) => {
        var {
            State_masterName,
            countryName,
            createdBy,
            modifiedBy

        } = req.body
        var createdOn = new Date()
        var modifiedOn = null

        isActive = 1
        var data = {
            State_masterName,
            countryName,
            createdBy,
            createdOn,
            modifiedBy,
            modifiedOn,
            isActive
        }

        db.query("SELECT * FROM state_master WHERE State_masterName = ?", [State_masterName], async function (
            error,
            results
        ) {
            console.log(results.length);
            if (results.length > 0) {
                res.json({
                    message: "State already exist",
                });
            } else {
                let sqlRegister = "INSERT INTO state_master SET ?";
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

        let sqlRegister = "SELECT  `State_masterName` FROM `state_master` WHERE `state_master`.`isActive` = 1 ";
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

        var { State_masterName, id } = req.body;
        var modifiedOn = new Date()

        var sql = "UPDATE `state_master` SET `State_masterName` = ? , `modifiedOn` = ? WHERE `state_master`.`id` = ?";

        console.log(sql)

        let query = db.query(sql, [State_masterName, modifiedOn, id], (err, results) => {

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

        var sql = "UPDATE `state_master` SET `isActive` = 0 , `modifiedOn` = ? WHERE `state_master`.`id` = ?";



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