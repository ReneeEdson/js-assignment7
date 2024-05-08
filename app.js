
const express = require('express')
const app = express()

const port = process.env.PORT || 3000

app.use(express.json())
app.use('/api/todos', require('./api-routes'))
app.use(express.static('public'))

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})

const {MongoClient, ObjectId} = require('mongodb')
const {url} = process.env.MONGODB_URL || require('./secrets/mongodb.json')
const client = new MongoClient(url )

const getCollection = async (dbName, collectionName) => {
    await client.connect()
    return client.db(dbName).collection(collectionName)
};

module.exports = { getCollection }

const todos = [
	{ id: 1, item: 'Learn JavaScript', complete: false },
	{ id: 2, item: 'Learn Express', complete: false },
	{ id: 3, item: 'Build a To Do App', complete: false }
]

app.get('/', (_, response) => {
	response.sendFile('index.html', { root })
})



// GET /api/todos

app.get('/api/todos', (req, res) => {
    res.json(todos);
});

// POST /api/todos

app.post('/api/todos', (req, res) => {
    const { task } = req.body;
    if (task) {
        const newTodo = { id: nextId++, task: task, complete: false }
        todos.push(newTodo)
        res.json({ id: newTodo.id })
    } else {
        res.status(400).send('Task is required')
    }
});

// PUT /api/todos/:id

app.put('/api/todos/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const todo = todos.find(t => t.id === id)
    if (todo) {
        todo.complete = !todo.complete; 
        res.json(todo)
    } else {
        res.status(404).send('Task not found')
    }
});

const message = `Server running: http://localhost:${port}`
app.listen(port, () => console.log(message))