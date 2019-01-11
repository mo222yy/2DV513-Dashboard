const fs = require('fs');
let department = ['bong'];
module.exports = {

    customerPage: (req, res) => {
        
        let query = "SELECT customerName, customerID, departmentName FROM Customer, department WHERE Customer.departmentID = department.departmentID GROUP BY customerName"
        
            db.query(query, (err, result) => {


                res.render('./customer/customerPage.ejs', {
                    title: 'Börjes customers',
                    customers: result
            })
          

      })

    },

    addCustomerPage: (req, res) => {
        let departmentQuery = "SELECT * FROM `department`"
       
        db.query(departmentQuery, (err, result) => {
            if (err) {
                res.redirect('/');
            }
            
            res.render('../views/customer/addCustomer.ejs', {
                title: "Börjes Dashboard",
                department: result,
                message: '' 
            });
        })
    },


    addCustomer: (req, res) => {
        if (!req.files) {
            return res.status(400).send("No files were uploaded.");
        }

        let message = '';
        let customerID = req.body.customerID;
        let customerName = req.body.customerName;
        let departmentID = req.body.department
        let uploadedFile = req.files.image;
        let image_name = uploadedFile.name;
        let fileExtension = uploadedFile.mimetype.split('/')[1];
        image_name = customerName + '.' + fileExtension;

        let customerIdQuery = "SELECT * FROM `Customer` WHERE customerID = '" + customerID + "'";
       
        db.query(customerIdQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length > 0) {
                message = 'CustomerID already exists';
                res.render('addCustomer.ejs', {
                    message,
                    title: "Börjes Dashboard | Add a new Customer"
                });
            } else {
                // check the filetype before uploading it
                if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
                    // upload the file to the /public/assets/img directory
                    uploadedFile.mv(`public/assets/img/${image_name}`, (err ) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        // send the customer's details to the database
                        let query = "INSERT INTO `Customer` (customerID, customerName, customerImage, departmentID) VALUES ('" +
                            customerID + "', '" + customerName + "', '" + image_name + "','" + departmentID + "')";
                        db.query(query, (err, result) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            res.redirect('/');
                        });
                    });
                } else {
                    message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
                    res.render('addCustomer.ejs', {
                        message,
                        title: "Börjes Dashboard | Add a new Customer"
                    });
                }
            }
        });
    },
    editCustomerPage: (req, res) => {
        let customerID = req.params.id;
        let query = "SELECT* FROM Customer WHERE customerID = '" + customerID + "' "
        
        db.query(query, (err, result) => {
       
            if (err) {
                return res.status(500).send(err);
            }
            res.render('./customer/editCustomer.ejs', {
                title: "Edit Customer",
                Customer: result[0],
                message: ''
            });
        });
 
    },
    editCustomer: (req, res) => {
        console.log(res)
        let previousCustomerID = req.params.id
        let newCustomerID = req.body.customerID; //new value
        let customerName = req.body.customerName;
        console.log(newCustomerID)
        

        
        let query = "UPDATE Customer SET customerID = '" + newCustomerID + "', customerName = '" + customerName + "' WHERE customerID = '" + previousCustomerID + "'";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        });
        
    },
    deleteCustomer: (req, res) => {
        let customerID = req.params.customerID
        let getImageQuery = 'SELECT customerImage from `Customer` WHERE customerID = "' + customerID + '"';
        let deleteUserQuery = 'DELETE FROM Customer WHERE customerID = "' + customerID + '"';

        db.query(getImageQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            let image = result[0].customerImage;

            fs.unlink(`public/assets/img/${image}`, (err) => {
                if (err) {
                    return res.status(500).send(err);
                }
                db.query(deleteUserQuery, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.redirect('/');
                });
            });
        });
    },

};