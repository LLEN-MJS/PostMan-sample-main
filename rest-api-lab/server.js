const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 4000;

// This is the middleware for parsing JSON
app.use(bodyParser.json());

// This will load and save user data from/to JSON file
const loadUsers = () => JSON.parse(fs.readFileSync('./users.json', 'utf-8'));
const saveUsers = (users) => fs.writeFileSync('./users.json', JSON.stringify(users, null, 2));

// Get all users
app.get('/users', (req, res) => {
  const users = loadUsers();
  res.json(users);
});

// Get a single user by ID
app.get('/users/:id', (req, res) => {
  const users = loadUsers();
  const user = users.find(u => u.Id === parseInt(req.params.id));
  user ? res.json(user) : res.status(404).send('User not found');
});

// Add a new user
app.post('/users', (req, res) => {
  const users = loadUsers();
  const newUser = req.body;
  users.push(newUser);
  saveUsers(users);
  res.status(201).json(newUser);
});

// Update a user by ID
app.put('/users/:id', (req, res) => {
  const users = loadUsers();
  const index = users.findIndex(u => u.Id === parseInt(req.params.id));
  if (index !== -1) {
    users[index] = { ...users[index], ...req.body };
    saveUsers(users);
    res.json(users[index]);
  } else {
    res.status(404).send('User not found');
  }
});

// Delete a user by ID
app.delete('/users/:id', (req, res) => {
  let users = loadUsers();
  const newUsers = users.filter(u => u.Id !== parseInt(req.params.id));
  if (users.length === newUsers.length) {
    res.status(404).send('User not found');
  } else {
    saveUsers(newUsers);
    res.sendStatus(204);
  }
});

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the REST API!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
