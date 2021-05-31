const Sequelize = require('sequelize');
const { STRING, UUID, UUIDV4 } = Sequelize;
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/sq_db', {logging: false})
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


const Faculty = conn.define('faculty', {
    name: {
        type: STRING
    }
})

const Employee = conn.define('employee', {
    id: {
        type: UUID,
        primaryKey: true,
        defaultValue: UUIDV4
    },
    name: {
        type: STRING
    }
})

Faculty.belongsTo(Employee, {as: 'professor'});
Employee.hasMany(Faculty, {foreignKey: 'professorId'})

const syncAndSeed = async() => {
    await conn.sync({ force: true })
    const [Joe, Ricky, Science, English] = await Promise.all([
        Employee.create({ name: 'Joe' }),
        Employee.create({ name: 'Ricky' }),
        Faculty.create({ name: 'Science' }),
        Faculty.create({ name: 'English' }),
    ])

    English.professorId = Joe.id;
    await English.save();
}



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