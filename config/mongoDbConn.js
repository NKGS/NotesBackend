const mongoose = require('mongoose')

const mongoDB = process.env.MONGO_DB_NAME
const mongoDBHost = process.env.MONGO_DB_HOST

mongoose.connect(`mongodb://${mongoDBHost}:27017/${mongoDB}`, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true}, (err) => {
    if(err) {
        console.log(`Mongo db connection error`)
  } 

  console.log(`Mongo db connected successfully`)
})

const db = mongoose.connection

db.on(`error`, console.error.bind(console, `MongoDB connection error.`))
