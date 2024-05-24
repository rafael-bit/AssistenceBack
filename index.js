const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let assistanceRequests = [];

app.post('/submit-request', (req, res) => {
    const { name, setor, problem } = req.body;

    assistanceRequests.push({ name, setor, problem });

    res.status(200).json({ message: 'Solicitação enviada com sucesso!' });
});

app.get('/requests', (req, res) => {
    res.status(200).json(assistanceRequests);
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

