require("dotenv").config();

const pg = require("pg")
const client = new pg.Client(process.env.DATABASE_URL);
const express = require("express");
const app = express();

app.use(require("morgan")("dev"));
app.use(express.json()); 

app.get("/api/department", async (req, res, next) => {
    try {
        const SQL = `SELECT * FROM department`;
        const response = await client.query(SQL);
        res.send(response.rows)
    } catch (error){
        next(error)
    }     
});

app.get("/api/employee", async (req, res, next) => {
    try {
        const SQL = `SELECT * FROM department`;
        const response = await client.query(SQL);
            res.send(response.rows);
        } catch (error) {
            next(error);
        }
        });    


        app.post("/api/employee, async (req, res, next) => {
            try {
                const SQL = `
                INSERT INTO employee(name, department_ID, ranking)
                VALUES($1, $2, $3) RETURNING * 
                `;
                const response = await client.query(SQL, [
                    req.body.name, 
                    req.body.department_id, 
                    req.body.ranking
                ]);
                res.status(201).send(response.rows[0]);
            } catch (error) {
                next(error);
            }
            });

    app.put("/api/employee/:id", async(req, res, next) => {
        try {
            const SQL = `
           UPDATE employee
           SET names=$1, ranking=$2, department_id=$3, updated_at=now()
           WHERE id=$4
           RETURNING *
            `;
            const response = await client.query(SQL, [req.body.name, req.body.ranking, req.body,department_id, req.params.id])
                res.send(response.rows[0]);
        } catch (error) {
            next(error);
         }
        });

        app.delete("/api/employee/:id", async(req, res, next) => {
           try {
                const SQL = `DELETE FROM employee WHERE id = $1`;
                await client.query(SQL, [req.params.id]);
                res.sendStatus(204)
           } catch (error) {
            next(error);
         }
           });

const init = async () => {
    await client.connect();
    let SQL  = /* sql */ `
        DROP TABLE IF EXISTS Department;
        DROP TABLE IF EXISTS Employee;

        CREATE TABLE Department(
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL UNIQUE
        );

        CREATE TABLE Employee(
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT now(),
            updated_at TIMESTAMP DEFAULT now(),
            ranking INTEGER DEFAULT 3 NOT NULL,
            department_id INTEGER REFERENCES Department(id) NOT NULL

        );

    `;
    await client.query(SQL);
    console.log("tables created");

    SQL = /* sql */ `
        INSERT INTO department(name) VALUES("SQL");
        INSERT INTO department(name) VALUES("Expess");
        INSERT INTO department(name) VALUES("ID");

        INSERT INTO employee(name, ranking, department_id) VALUES('learn express', 5, 
        (SELECT id FROM department WHERE name='Express'));

        INSERT INTO employee(name, ranking, department_id) VALUES('add logging middleeware', 5, 
        (SELECT id FROM department WHERE name="Express"));

        INSERT INTO employee(name, ranking, department_id) VALUES('write SQL queries', 5, 
        (SELECT id FROM department WHERE name="SQL"));
    `;

    await client.query(SQL);
    console.log

    const port = process.env.PORT || 3000; 
    app.listen(port, () => console.log(`listening on port ${port}`));
};

init();
