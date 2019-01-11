module.exports = {

    departmentPage: (req, res) => {
        let query = "SELECT * FROM department GROUP BY departmentName"; //query database to get all the Customers
        // execute query
        db.query(query, (err, result) => {
            if (err) {
                res.redirect('/');
            }
            
            let customers;

            let customerQuery = "SELECT customerName, departmentID FROM Customer GROUP BY customerName"

            setTimeout(function(){
                db.query(customerQuery, (err, res) => {
                    if(err) {
                        console.log(err)
                    }
                    customers = res
                })
            }, 100);

            setTimeout(function(){
                res.render('./department/departmentPage.ejs', {
                    title: "Börjes Dashboard",
                    department: result,
                    customer: customers 
                })   

            }, 200);
        })
    },

    addDepartmentPage: (req, res) => {
        res.render('./department/addDepartment.ejs', {
            title: "Börjes Dashboard | Add a new Customer"
            ,message: ''
        });
    },

    addDepartment: (req, res) => {
        let message = '';
        let departmentID = req.body.departmentID;
        let departmentName = req.body.departmentName;
   

        let departmentIdQuery = "SELECT * FROM `department` WHERE departmentID = '" + departmentID + "'";

        db.query(departmentIdQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length > 0) {
                message = 'departmentID already exists';
                res.render('./department/addDepartment.ejs', {
                    message,
                    title: "Börjes Dashboard | Add a new Department"
                });
            } else {
                let insertDepartmentQuery = "INSERT INTO `department` (departmentID, departmentName) VALUES ('" +
                departmentID + "', '" + departmentName + "')";

                db.query(insertDepartmentQuery, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.redirect('/departmentPage');
                });
            }
        });
    },

    deleteDepartment: (req, res) => {
        let departmentID = req.params.departmentID;
        let deleteDepartmentQuery = 'DELETE FROM department WHERE departmentID = "' + departmentID + '"';

        db.query(deleteDepartmentQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/departmentPage');
        });
    }
};