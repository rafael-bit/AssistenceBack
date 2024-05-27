const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb+srv://rafael:Mh51oU6eQGNH29No@assistence.qxhhaei.mongodb.net/?retryWrites=true&w=majority&appName=assistence', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const AssistanceRequestSchema = new mongoose.Schema({
  name: String,
  setor: String,
  problem: String,
  completed: { type: Boolean, default: false },
  completedTime: Date
});

const AssistanceRequest = mongoose.model('AssistanceRequest', AssistanceRequestSchema);

app.post('/submit-request', async (req, res) => {
  console.log('Request Body:', req.body);
  const { name, setor, problem } = req.body;

  try {
    const newRequest = new AssistanceRequest({ name, setor, problem });
    await newRequest.save();
    res.status(200).json({ message: 'Solicitação enviada com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao enviar solicitação' });
  }
});

app.get('/requests', async (req, res) => {
  try {
    const requests = await AssistanceRequest.find();
    res.status(200).json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar solicitações' });
  }
});

app.patch('/requests/:id', async (req, res) => {
  const { id } = req.params;
  const { completed, completedTime } = req.body;

  try {
    const request = await AssistanceRequest.findByIdAndUpdate(
      id,
      { completed, completedTime },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    res.status(200).json({ message: 'Pedido atualizado com sucesso', request });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar o pedido' });
  }
});

app.put('/requests/:id', async (req, res) => {
  const { id } = req.params;
  const { name, setor, problem } = req.body;

  try {
    const request = await AssistanceRequest.findByIdAndUpdate(
      id,
      { name, setor, problem },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    res.status(200).json({ message: 'Pedido atualizado com sucesso', request });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar o pedido' });
  }
});

app.delete('/requests/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const request = await AssistanceRequest.findByIdAndDelete(id);

    if (!request) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    res.status(200).json({ message: 'Pedido deletado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao deletar o pedido' });
  }
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
