const fs = require('fs');
const parseString = require('xml2js-parser').parseString;


module.exports = {

    getOrders: () => {
        let fileToRead = './xmlFiles/Orders2.xml'
        let orders;
        
        fs.readFile(fileToRead, function (err,data) {
            if(err) {
                console.log('ERROR: ', err )
            } else {
                parseString(data, (err, result ) =>  {
                    if(err) {
                        //console.log(err)
                    }
                  
                    //orders = result.Orders[0].BorjesDashBoardOrder
                    orders = result.BorjesDashBoardInfo.Orders[0].BorjesDashBoardOrder

                    ,
                    //SHOW ORDERS
                    orders.forEach(order => {
                        let orderID = order.OrderId
                        let customerID = order.GoodsOwnerId
                        let orderPickability = order.OrderPickability
                        let orderStatusNumber = order.OrderStatusNumber
                        let deliveryDate = order.DeliveryDate
                        let countryCode = order.CountryCode
                        let orderNumberOfOrderLines = order.NumberOfOrderLines

                        let query = "INSERT INTO `orders` (orderID, customerID, orderPickability, orderStatusNumber, orderDeliveryDate, orderCountryCode, orderNumberOfOrderLines) VALUES ('" +
                        orderID + "', '" + customerID + "', '" + orderPickability + "', '" + orderStatusNumber + "',  '" + deliveryDate + "',  '" + countryCode + "', '" + orderNumberOfOrderLines + "')";

                        db.query(query, (err, result) => {
                            if (err) {
                                //console.log(err.code, err.message)
                            }
                        });
                    });                   
                 })
    
            }
        })
      },  

     /**
      * This is a multirelational query, I leave this since i'm unsure if the queries in the other countOpenOrders function counts as multirelational.
      * Technically i query those from two tables but using a variable from another query so that there's SELECT FROM one table in the queries.
      * I hope you see what I mean.
      * This commented function could replace it but I find it smoother the other way.
      */
     /*
      countOpenOrders: () => {
        let getCustomerQuery = "SELECT COUNT(*) FROM Customer, orders WHERE Customer.customerID = orders.customerID AND orders.orderStatusNumber = 200"
        db.query(getCustomerQuery, (err, result) => {
            console.log(result)
        })
    }
    */

      countOpenOrders: () => {
          let getCustomerQuery = "SELECT * FROM Customer"

          db.query(getCustomerQuery, (err, result) => {
            if (err) {
                //console.log(err)
            }
          result.forEach(customer => {
            let customerID = customer.customerID
            let openOrders = 0
            let rest = 0
            let abroad = 0
            let orderLines = 0 

            //Counts open orders for each customer check OPEN STATUS NUMBER
            let getOpenOrdersQuery ="SELECT * FROM orders AS openOrders WHERE customerID = '" + customerID + "'"
            db.query(getOpenOrdersQuery, (err, result2) => {
                if (err) {
                    console.log(err)
                }
                result2.forEach(order => {
                    //200 open, then check orderLines, else rest
                    if(order.orderStatusNumber === '200') {
                        openOrders++
                        orderLines += parseInt(order.orderNumberOfOrderLines)
                        
                        if(order.CountryCode !== 'SE') {
                            abroad++
                        }

                    } else if (order.orderStatusNumber === '400') {
                        rest++
                    }
                })

                let customerOrdersQuery = "UPDATE Customer SET customerOpenOrders = '" + openOrders + "', customerOpenOrderLines = '" + orderLines + "', customerAbroadOrders =  '" + abroad + "', customerRestOrders = '" + rest + "'  WHERE customerID = '" + customerID + "'";
                
                db.query(customerOrdersQuery, (err, result) => {
                    if (err) {
                    console.log(err)
                    }
                })
            }) 
            })//end of forEach
        })

    }

}
          


/*
{ GoodsOwnerId: [ '102' ],
    OrderId: [ '102547' ],
    GoodsOwnerOrderNumber: [ '4529' ],
    OrderPickability: [ '400' ],
    orderStatusNumber: [ '200' ],
    DeliveryDate: [ '2018-10-12T00:00:00' ],
    Created: [ '2018-02-23T19:23:13.487' ],
    CountryCode: [ 'SE' ],
    PickedNumberOfItems: [ '0.000' ],
    OrderedNumberOfItems: [ '7.000' ],
    NumberOfOrderLines: [ '5' ],
    Transporter: [ 'Schenker' ],
    NumberOfPickedOrderLines: [ '0' ],
    OrderLines: [ [Object] ] 
    */