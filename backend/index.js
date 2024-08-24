const express = require('express');
const app = express();
const port = 5000;
const mongoDB = require('./db');
mongoDB();

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

app.use(express.json());

// Route handlers
app.use('/api', require("./routes/createUser"));
app.use('/api', require("./routes/DisplayData"));
app.use('/api', require("./routes/Order_data"));

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
