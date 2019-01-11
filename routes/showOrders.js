function showOrderPage(req, res) {
    
    let departmentID = req.params.departmentID
    departmentID = departmentID.replace(':', '')
   
    let query = "SELECT * FROM Customer WHERE departmentID = '" + departmentID + "' ORDER BY customerOpenOrders DESC "
    db.query(query, (err,result) => {
        if(err) {
            console.log(err)
        }

        let sumOpenOrders = 0
        let sumRestOrders = 0
        let sumAbroadOrders = 0
        let sumOrderLines = 0

        result.forEach(customer => {
            sumOpenOrders += customer.customerOpenOrders
            sumRestOrders += customer.customerRestOrders
            sumAbroadOrders += customer.customerAbroadOrders
            sumOrderLines += customer.customerOpenOrderLines
        })

        res.render('showOrders.ejs', {
            title: "Börjes Dashboard | ",
            Customer: result,
            sumOpenOrders: sumOpenOrders,
            sumRestOrders: sumRestOrders,
            sumAbroadOrders: sumAbroadOrders,
            sumOrderLines: sumOrderLines
        })
    })
}

module.exports = {
    showOrderPage: showOrderPage
}