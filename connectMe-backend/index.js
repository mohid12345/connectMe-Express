const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');


const app = express();
const PORT = 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Allow requests from your frontend
app.use(cors({
    // origin: 'http://localhost:5501',
     origin: ['http://localhost:5501', 'http://localhost:3000', 'https://portfolio-mohid.netlify.app', 'https://www.mohidmohan.shop'],
    credentials: true
  }));

// In-memory storage for messages
const messagesFilePath = path.join(__dirname, 'messages.json')

//Reading messages
const readMessagesFromFile = () => {
    if(!fs.existsSync(messagesFilePath)){
        return []
    }
    const data = fs.readFileSync(messagesFilePath, 'utf-8')
    return JSON.parse(data || '[]');
}

//Writing messages
const writeMessagesToFile = (messages) => {
    fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2))
}


// Route to handle form submission
app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;

    const messages = readMessagesFromFile()
    messages.push({name,email, message, date:new Date()})
    writeMessagesToFile(messages)
    res.status(200).send('Message received successfully!');
});

// Route to view all messages
app.get('/messages', (req, res) => {
    const messages = readMessagesFromFile()
    res.json(messages);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});