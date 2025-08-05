const mongoose = require("mongoose")

require('dotenv').config();
async function connect() {
    // connect tới database blog
    try {
        await mongoose.connect('mongodb+srv://nbinh0301:KzkKIJxsdH5HX4xU@kidnkiss.wjngsw2.mongodb.net/?retryWrites=true&w=majority&appName=kidnkiss',{
            dbName : "web",
            useNewUrlParser: true,
            useUnifiedTopology: true,
            
        });
        console.log("Connect project Successfully")
    } catch (error) {
        console.log("Connect project Failure!")
    }

    // connect tới database collection
    
}

module.exports = { connect };