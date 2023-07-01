var express = require('express');
var nodemailer = require('nodemailer');
const axios = require('axios');
var app = express();
var port = process.env.PORT || 8080;
var path = require('path');
var bcrypt = require('bcrypt');
var bodyParser = require('body-parser') //parse request parameters
var fs = require('fs');
app.use(express.static(__dirname));  //specifies the root directory from which to serve static assets [images, CSS files and JavaScript files]
app.use(bodyParser.urlencoded({ extended: true })); //parsing bodies from URL. extended: true specifies that req.body object will contain values of any type instead of just strings.
app.use(bodyParser.json()); //for parsing json objects
const mongoose = require('mongoose');
mongoose.set("strictQuery", false);
const uri = "mongodb+srv://forfinleproject:64hSSHCWGnr6CAe0@userandpass.lhfugmo.mongodb.net/?retryWrites=true&w=majority";
const User = require('./models/users');


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/signin.html'));
})

app.get('/signin', function (req, res) {
    res.sendFile(path.join(__dirname + '/signin.html'));
})

app.get('/signup', function (req, res) {
    res.sendFile(path.join(__dirname + '/signup.html'));
})
app.get('/contactus', function (req, res) {
    res.sendFile(path.join(__dirname + '/contactUs.html'));
})

app.get('/stocktable', function (req, res) {
    res.sendFile(path.join(__dirname + '/stocktable.html'));
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (username === 'Admin' && password === 'Admin') {
        res.json({ success: true, page: "/contactUs.html" });
    }
    else {
        var result;
        try {
            result = await User.find({ email: username });
            //const usersJSON = JSON.stringify(result);
            console.log("result:" + result);
            var storedHash = result[0].password;
            console.log("pass" + storedHash);

        }
        catch (error) {
            console.log(error.message);
        }
        if (result == "") {
            res.json({ success: false, page: "" });
        }
        else {
            if (bcrypt.compareSync(password, storedHash)) {
                res.json({ success: true, page: "/stocktable.html" });
            }
            else {
                res.json({ success: false, page: "" });
            }


        }

    }
});
app.get('/test_data_transfer', function (req, res) {
    res.send(test_data.toString());
})

var tranporter = nodemailer.createTransport({

    service: 'gmail',
    port: 465,

    auth: {

        user: 'forFinleProject@gmail.com',
        pass: 'tehmpbczvqwdhsxw'
    }

});

var sender = nodemailer.createTransport({

    service: 'gmail',
    port: 465,

    auth: {

        user: 'tzachibenyair@gmail.com',
        pass: 'kygvwehwhqavkmpd'
    }

});

app.post('/signup', async (req, res) => {

    const { username, password } = req.body;
    var result;
    try {
        result = await User.find({ email: username });
        console.log("result:" + result);

    }
    catch (error) {
        console.log(error.message);
    }
    if (result == "") {
        console.log("no username in DB");
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);
        const user = new User({
            email: username,
            password: hash
        });
        user.save().then(console.log);
        var mailOptions = {

            from: 'forFinleProject@gmail.com',
            to: username,
            subject: 'Signup to website ',
            text: 'thank you for signup here is your password' + password

        };
        tranporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
            else {
                res.json({ success: true, sendmail: true });
                console.log('Email sent: ' + info.response);
            }
        });

    }
    else {
        res.json({ success: true, sendmail: false });
    }


}


);

app.post('/contactus', function (req, res) {

    const { name, email, text, floatingTextarea } = req.body;
    var mailOptions = {

        from: email,
        to: 'forFinleProject@gmail.com',
        subject: text,
        text: floatingTextarea + ' ' + name

    };
    sender.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
        else {
            res.json({ success: true });
            console.log('Email sent: ' + info.response)
        }
    });

}


);


app.post('/stocktable', async (req, res) => {
    const stockSymbol = req.body.symbol;
    const apiKey = 'ETBPRWERSHGXQV2X';


    axios
        .get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${apiKey}`)
        .then(response => {
            const result = response.data['Global Quote'];

            if (result) {
                const symbol = result['01. symbol'];
                const open = result['02. open'];
                const currentPrice = result['05. price'];

                // Calculate the price change percentage
                const priceChange = parseFloat(currentPrice) - parseFloat(open);
                const priceChangePercentage = (priceChange / parseFloat(open)) * 100;

                // Create the modified stock information object
                const stockInfo = {
                    symbol: symbol,
                    open: open,
                    price: currentPrice,
                    priceChange: priceChange.toFixed(2),
                    priceChangePercentage: priceChangePercentage.toFixed(2)
                };

                // Send the stock information as a JSON response
                res.json(stockInfo);
            } else {
                console.log('No stock information found for the symbol:', stockSymbol);
                res.status(404).json({ error: 'Stock information not found' });
            }
        })
        .catch(error => {
            console.error('Failed to fetch stock information:', error.message);
            res.status(500).json({ error: 'Failed to fetch stock information' });
        });
});


app.post('/stockgraph', async (req, res) => {
    const symbol = req.body.symbol;
    const api = 'ETBPRWERSHGXQV2X';
    axios
        .get(
            "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=" +
            symbol +
            "&outputsize=full&apikey=" +
            api
        )
        .then(response => {
            var data = response.data;
            res.json(data);
        })
        .catch(error => {
            console.error(error.message);
        });



});


const start = async () => {

    await mongoose.connect(uri);

    app.listen(port);
    console.log('Server started! At http://localhost:' + port);

};

start();