const express = require('express');
const app  =express();
const cors = require('cors');
const monk = require('monk');

const Filter = require('bad-words');
    filter = new Filter();

const rateLimit =  require('express-rate-limit');


const db = monk(process.env.MONGO_URI || 'localhost/meower');
const mews = db.get('mews');

app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.json({
        message:'meow'
    });
})

app.get('/mews',(req,res)=>{
    mews
        .find()
        .then(mews=>{
            res.json(mews)
        })
})

app.use(rateLimit({
    mindowMs: 30 * 1000,
    max:1
}))

function isValidMew(mew)  {
    return mew.name && mew.name.toString().trim() !== '' && 
           mew.content && mew.content.toString().trim() !== '' ;
}


app.post('/mews',(req,res)=>{

    if(isValidMew(req.body)){
        //insert into db;
        const mew  =  {
            name: filter.clean(req.body.name.toString()),
            content:filter.clean(req.body.content.toString()),
            created: new Date()
        }
        mews
            .insert(mew)
            .then(createdMew=>{
                res.json(createdMew);
            })
    }else{
        res.status(422);
        res.json({
            message:'Hey! Name and Content are required'
        })
    }


    console.log(req.body);
})

app.listen(5000,()=>{
    console.log('server started at 5000');
})