const { conn, syncAndSeed, models:{ Faculty, Employee}} = require('./db')
const express = require('express');
const app = express();

app.get('/api/faculties', async(req,res,next)=> {
    try {
        res.send(await Faculty.findAll({
            include: [
                {
                    model: Employee,
                    as: 'professor'
                }
            ]
        }))
    }
    catch(ex){
        console.log(ex)
    }
})

app.get('/api/employees', async(req,res,next)=> {
    try {
        res.send(await Employee.findAll({
            include: [
                {
                    model: Employee,
                    as: 'supervisor'
                },
                Employee,
                Faculty
            ]
        }))
    }
    catch(ex){
        console.log(ex)
    }
})


const init = async() => {
    try{
        await conn.authenticate();
        syncAndSeed();
         const port = process.env.PORT || 3000;
         app.listen(port, ()=> {
             console.log(`listening on port ${port}`)
         })
    }
    catch(ex){
        console.log(ex)
    }
}

init()