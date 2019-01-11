const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();

const {getHomePage} = require('./routes/index');
const {addDepartment, departmentPage, addDepartmentPage, deleteDepartment} = require('./routes/department')
const {getOrders, countOpenOrders} = require('./routes/order')
const {addCustomerPage, addCustomer, deleteCustomer, editCustomer, editCustomerPage, customerPage} = require('./routes/customer');
const {showOrderPage} = require('./routes/showOrders') 
const port = 5000;

//serve static files from public directory

// create connection to database
// the mysql.createConnection function takes in a configuration object which contains host, user, password and the database name.
const db = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: 'centaninn1',
    database: 'dashboard'
});

// connect to database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.db = db;

// Get orders
getOrders()
countOpenOrders()





// configure middleware
app.set('port', process.env.port || port); // set express to use this port
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder
app.use('/public', express.static(__dirname + "/public"));
app.use(fileUpload()); // configure fileupload

// routes for the app

app.get('/', getHomePage);
app.get('/customerPage', customerPage )
app.get('/customer/add', addCustomerPage);
app.get('/customer/edit/:id', editCustomerPage );
app.get('/delete/:customerID', deleteCustomer);
app.get('/departmentPage', departmentPage)
app.get('/addDepartment', addDepartmentPage)
app.get('/deleteDepartment/:departmentID', deleteDepartment)
app.get('/showOrders/:departmentID', showOrderPage)

app.post('/customer/add', addCustomer);
app.post('/addDepartment', addDepartment)
app.post('/customer/edit/:id', editCustomer);


// set the app to listen on the port
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});

