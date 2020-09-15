const db = require('../../database/db')

module.exports = {
    add: async (req, res) => {
        var {
            profileType_master,
            createdBy,
            modifiedBy

        } = req.body
        var createdOn = new Date()
        var modifiedOn = null

        isActive = 1
        var data = {
            profileType_master,
            createdBy,
            createdOn,
            modifiedBy,
            modifiedOn,
            isActive
        }

        db.query("SELECT * FROM profileType_master WHERE profileType_master = ?", [profileType_master], async function (
            error,
            results
        ) {
            console.log(results.length);
            if (results.length > 0) {
                res.json({
                    message: "Profile type already exist",
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

        let sqlRegister = "SELECT  `profileType_master` FROM `profileType_master` WHERE `profileType_master`.`isActive` = 1 ";
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

        var sql = "UPDATE `profileType_master` SET `profileType_master` = ? , `modifiedOn` = ? WHERE `profileType_master`.`id` = ?";

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

        var sql = "UPDATE `profileType_master` SET `isActive` = 0 , `modifiedOn` = ? WHERE `profileType_master`.`id` = ?";



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