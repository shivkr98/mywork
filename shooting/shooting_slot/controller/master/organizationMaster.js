const db = require('../../database/db')

module.exports = {
    addOrganization: async (req, res) => {
        var {
           organization,
            createdBy,
            modifiedBy

        } = req.body

        var createdOn = new Date()
        var modifiedOn = null

        isActive = 1
        var data = {
           organization,
            createdBy,
            createdOn,
            modifiedBy,
            modifiedOn,
            isActive
        }

        db.query("SELECT * FROM organization_master WHERE organization = ?", [organization], async function (
            error,
            results
        ) {
            console.log(results.length);
            if (results.length > 0) {
                res.json({
                    message: "organization  already exist",
                });
            } else {
                let sqlRegister = "INSERT INTO organization_master SET ?";
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


    showOrganization: async (req, res) => {

        let sqlRegister = "SELECT  `organization` FROM `organization_master` WHERE `organization_master`.`isActive` = 1 ";
        let query = db.query(sqlRegister, (err, results) => {
            if (err) throw err;
            console.log(results);
            res.json({
                message: "Success",
                results: results


            });
        });

    },

    updateOrganization: async (req, res) => {

        var { organization, id } = req.body;
        var modifiedOn = new Date()

        var sql = "UPDATE `organization_master` SET `oragnization` = ? , `modifiedOn` = ? WHERE `organization_master`.`id` = ?";


        console.log(sql)

        let query = db.query(sql, [organization, modifiedOn, id], (err, results) => {

            if (err) throw err;
            console.log(results);
            res.json({
                message: "Success updated",

            });
        }

        )
    },

    deleteOrganization: async (req, res) => {

        var { id } = req.body;
        var modifiedOn = new Date()

        var sql = "UPDATE `organization_master` SET `isActive` = 0 , `modifiedOn` = ? WHERE `organization_master`.`id` = ?";



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