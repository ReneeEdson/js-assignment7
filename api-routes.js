const express = require('express');
const router = express.Router();
const { getCollection } = require('./db');
const { ObjectId } = require('mongodb');

router.get('/', async (_, res) => {
    const collection = await getCollection('todo-api', 'todos');
    const todos = await collection.find().toArray();
    res.json(todos);
});

router.post('/', async (req, res) => {
    const { item, complete } = req.body;
    const collection = await getCollection('todo-api', 'todos');
    const result = await collection.insertOne({ item, complete });
    res.json(result.insertedId);
});

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const collection = await getCollection('todo-api', 'todos');
    const todo = await collection.findOne({ _id: new ObjectId(id) });
    const complete = !todo.complete;
    const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { complete } });
    res.json(result);
});

module.exports = router;
