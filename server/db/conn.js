const mongoose = require('mongoose');

const DB = process.env.DATABASE;

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false
}).then(() => {
    console.log("Connection Successful");
}).catch((err) => console.log("NO Connection", err));