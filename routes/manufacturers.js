const express = require('express');
const pgp = require('pg-promise')();

const connection = {
    host: 'localhost',
    port: 5432,
    database: 'innovei',
    user: 'postgres',
    password: 'postgres',
    max: 30
};

const db = pgp(connection);

const router = express.Router();

router.get('/', async (req, res) => {

    try {
        const result = await db.any('SELECT * FROM manufacturers');
        console.log(result);
        res.json(result)
    } catch (e) {
        console.error(e);
    }
})

router.get('/:id', async (req, res) => {

    try {
        const result = await db.any('SELECT * FROM manufacturers WHERE manufacturer_id = $1', [req.params.id]);
        res.json(result)
    } catch (e) {
        res.status(418).json({ status: "Error 418 - Something Went Wrong", details: e })
    }
})

router.post('/', async (req, res) => {

    try {
        await db.any('INSERT INTO manufacturers (manufacturer_name) VALUES ($1)', [req.body.manufacturerName]);
        res.json({ status: "success" })
    } catch (e) {
        res.status(400).json({ status: "Error 400 - Bad Request", details: e })
    }
})

router.put('/:id', async (req, res) => {

    try {
        await db.any('UPDATE manufacturers SET manufacturer_name = $1 WHERE manufacturer_id = $2', [req.body.manufacturerName, req.params.id]);
        res.json({ status: "success" })
    } catch (e) {
        res.status(400).json({ status: "Error 400 - Bad Request", details: e })
    }
})

router.delete('/:id', async (req, res) => {

    try {
        await db.any('DELETE FROM manufacturers WHERE manufacturer_id = $1', [req.params.id]);
        res.json({ status: "success" })
    } catch (e) {
        res.status(400).json({ status: "Error 400 - Bad Request", details: e })
    }
})


module.exports = router;