const Sequelize = require('sequelize');
const { STRING, UUID, UUIDV4 } = Sequelize;
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/sq_db', {logging: false})


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

Employee.belongsTo(Employee, {as: 'supervisor'});
Employee.hasMany(Employee, {foreignKey: 'supervisorId'});

const syncAndSeed = async() => {
    await conn.sync({ force: true })
    const [Joe, Ricky, Bob, Science, English] = await Promise.all([
        Employee.create({ name: 'Joe' }),
        Employee.create({ name: 'Ricky' }),
        Employee.create({ name: 'Bob' }),
        Faculty.create({ name: 'Science' }),
        Faculty.create({ name: 'English' }),
    ])

    English.professorId = Joe.id;
    await English.save();
    Bob.supervisorId = Joe.id;
    await Bob.save();
    Ricky.supervisorId = Joe.id;
    await Ricky.save();
}

module.exports = {
    conn,
    syncAndSeed,
    models: {
        Faculty,
        Employee
    }
}