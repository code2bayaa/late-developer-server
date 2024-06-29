const express = require('express');
// import server from 'http'
const cors  = require("cors")
const axios = require("axios")
let bodyParser = require('body-parser');
const nodemailer = require("nodemailer");
// let nspell = require('nspell')
const { fetchDiv } = require('./../main/bind.js')
const app = express(); //creates the express app
const router = express.Router()
app.use(cors({
    origin : ["https://late-developer.web.app","https://late-developer.firebaseapp.com","http://localhost:3000"]
}));

app.use( bodyParser.json({ limit : '3000mb' }) );       // to support JSON-encoded bodies

app.use( bodyParser.urlencoded({
    limit : '50mb',// to support URL-encoded bodies
    extended : true
}));


router.post("/add", async (req, res) => {

    try{

        let {user, location} = req.body

        const bindFetch = await fetchDiv()

        const query = {}
        const { config, error } = await bindFetch.SELECT({ query, type : "one", db : process.env.DATABASE, collection : process.env.COLLECTION, options : {} })
        
        if(error){
            res.status(500).json({status:false,response:error.message})
        }
        if(config){

            const date = new Date()

            const insert_rows = await bindFetch.INSERT({
          
                type : "one",
                db : process.env.DATABASE,
                collection : process.env.COLLECTION,
                data : {
                    user,
                    location,
                    count:1,
                    date,
                    time : date.toLocaleTimeString()
                },
                options : {}
              })

              if(insert_rows.hasOwnProperty("error") && insert_rows.error){
                res.status(500).json({status:false,response:insert_rows.error.message})
              }

              res.status(200).json({response:"success", status:true})

        }else{

            res.status(200).json({response:"already in our system", status:false})
        }

    }catch(error){

        res.status(500).json({status:false,response:error.message})
    }


})


router.post("/update", async (req, res) => {

    try{

        let {user} = req.body

        const bindFetch = await fetchDiv()

        const query = {}
        const { config, error } = await bindFetch.SELECT({ query, type : "one", db : process.env.DATABASE, collection : process.env.COLLECTION, options : {
            user
        } })
        
        if(error){
            res.status(500).json({status:false,response:error.message})
        }
        if(config){

            const update_rows = await bindFetch.UPDATE({
          
                type : "one",
                db : process.env.DATABASE,
                collection : process.env.COLLECTION,
                data : {
                    $inc:{count:1}
                },
                query : {
                    user
                },
                options : {}
              })

              if(update_rows.hasOwnProperty("error") && update_rows.error){
                res.status(500).json({status:false,response:update_rows.error.message})
              }

              res.status(200).json({response:"success", status:true})

        }else{

            res.status(200).json({response:"already in our system", status:false})
        }

    }catch(error){

        res.status(500).json({status:false,response:error.message})
    }

})

app.use("/users",router)

module.exports = { app }
