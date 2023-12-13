const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 8080;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cors());

const sacolaFilePath = path.join(__dirname, 'public', 'sacola.json');

// Rota para listar itens da sacola
app.get('/sacola', (req, res) => {
    fs.readFile(sacolaFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao ler os itens da sacola.' });
        }
        const sacolaItens = JSON.parse(data);
        res.json(sacolaItens);
    });
});

// Rota para adicionar um item à sacola
app.post('/sacola/adicionar', (req, res) => {
    const newItem = req.body;

    fs.readFile(sacolaFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao ler a sacola.' });
        }

        const sacola = JSON.parse(data);
        sacola.push(newItem);

        fs.writeFile(sacolaFilePath, JSON.stringify(sacola), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao escrever a sacola.' });
            }

            res.json(sacola);
        });
    });
});

// Rota para remover um item da sacola
app.delete('/sacola/remover/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);

    let sacolaItens = JSON.parse(fs.readFileSync(sacolaFilePath, 'utf8'));

    sacolaItens.splice(index, 1);

    fs.writeFileSync(sacolaFilePath, JSON.stringify(sacolaItens));

    res.json({ sacolaItens, quantidade: sacolaItens.length });
});

// Rota para limpar a sacola
app.post('/sacola/limpar', (req, res) => {
    const fs = require('fs');
    const path = 'public/sacola.json';

    fs.writeFileSync(path, '[]');

    res.status(200).send('Sacola limpa com sucesso.');
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});