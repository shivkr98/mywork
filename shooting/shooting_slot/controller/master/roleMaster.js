const db = require('../../database/db')

module.exports = {
    add: async (req, res) => {
        var {
            Role_masterName,
            createdBy,
            modifiedBy

        } = req.body
        var createdOn = new Date()
        var modifiedOn = null

        isActive = 1
        var data = {
            Role_masterName,
            createdBy,
            createdOn,
            modifiedBy,
            modifiedOn,
            isActive
        }

        db.query("SELECT * FROM role_master WHERE Role_masterName = ?", [Role_masterName], async function (
            error,
            results
        ) {
            console.log(results.length);
            if (results.length > 0) {
                res.json({
                    message: "This role already exist",
                });
            } else {
                let sqlRegister = "INSERT INTO role_master SET ?";
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

        let sqlRegister = "SELECT  `Role_masterName` FROM `role_master` WHERE `role_master`.`isActive` = 1 ";
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

        var { Role_masterName, id } = req.body;
        var modifiedOn = new Date()

        var sql = "UPDATE `role_master` SET `Role_masterName` = ? , `modifiedOn` = ? WHERE `role_master`.`id` = ?";

        console.log(sql)

        let query = db.query(sql, [Role_masterName, modifiedOn, id], (err, results) => {

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

        var sql = "UPDATE `role_master` SET `isActive` = 0 , `modifiedOn` = ? WHERE `role_master`.`id` = ?";



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