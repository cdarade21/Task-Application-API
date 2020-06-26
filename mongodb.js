
const {MongoClient, ObjectID }  = require('mongodb')

//const connectionURL = "mongodb://127.0.0.1:27017"
const connectionURL =  "mongodb+srv://cdarade21:Application@123@cluster0-imake.mongodb.net/test?retryWrites=true&w=majority"
const databasename = 'task-manager'

MongoClient.connect(connectionURL, {useUnifiedTopology:true}, (error, client)=>{
    if(error) {
        return console.log('can not connect to the mongoDB')
    }

    const db = client.db(databasename);

    console.log("Connected Successfully")

    db.collection('users').deleteOne({
        name : 'DJ'
    }).then((result)=>{
        console.log(result)
    }).catch((error)=>{
        console.log(error)
    })
})