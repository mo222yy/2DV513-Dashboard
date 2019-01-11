    function getHomePage (req, res) {
        // query database to get all the Customers including department name
        let query = "SELECT* FROM Customer JOIN department ON Customer.departmentID=department.departmentID ORDER BY customerOpenOrders DESC"; 
        // execute query
        db.query(query, (err, result) => {
            if (err) {
                res.redirect('/');
            }

            let departments = []
            let sumOpenOrders = 0
            let sumRestOrders = 0
            let sumAbroadOrders = 0
            let sumOrderLines = 0

            let departmentQuery = "SELECT * FROM department"
            db.query(departmentQuery, (err, res) => {
                res.forEach(department => {
                   departments.push(department)
                })
            })

            let sumOrderQuery = "SELECT SUM(customerOpenOrders) AS openOrders, SUM(customerRestOrders) AS restOrders, SUM(customerAbroadOrders) AS abroadOrders, SUM(customerOpenOrderLines) AS openOrderLines FROM Customer";
            db.query(sumOrderQuery, (err, result) => {
                sumOpenOrders = result[0].openOrders
                sumRestOrders = result[0].restOrders
                sumAbroadOrders = result[0].restOrders
                sumOrderLines = result[0].openOrderLines
              
            })


            setTimeout(function(){
                res.render('index.ejs', {
                
                    title: "Börjes Dashboard",
                    Customer: result, 
                    department: departments,
                    sumOpenOrders: sumOpenOrders, 
                    sumRestOrders: sumRestOrders,
                    sumAbroadOrders: sumAbroadOrders,
                    sumOrderLines: sumOrderLines

                });
   
            }, 1000) 
        }); 
    }
 

module.exports = {
    getHomePage: getHomePage,
};

