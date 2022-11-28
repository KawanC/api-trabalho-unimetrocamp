const express = require('express');
const pathProdutos = "src/produtos/produtos.json";
const encond = "utf-8";
// DATABASE
const fs = require('fs');
const dados_produtos = (path, tipo) => {
    try {
        const dados = fs.readFileSync(path, tipo);
        dadosObj = JSON.parse(dados);
        return dadosObj;
    } catch (error) {
        return error;
    }
}

const port = process.env.PORT || 3333;
// APP
const app = express();
app.use(express.json());

//ROTAS
app.get('/produtos', (req, res) => { // GET ALL
    try {
       
        return res.status(200).json(dados_produtos());
    } catch (error) {
        return res.status(500).json("Ocorreu um erro");
    }
});

app.get('/produtos/:produtos_id', (req, res) => { // GET BY ID
    try {
        const { produtos_id } = req.params;
        let produtosJson =  dados_produtos(pathProdutos, encond);
        const produto = produtosJson.find((produto) => produto.id == produtos_id);
        if (!produto) {
            return res.status(404).json("Produto Não Encontrado");
        } else {
            return res.status(200).json(produto);
        }
    } catch (error) {
        return res.status(500).json("Ocorreu um erro" + error);
    }
});

app.post('/produtos', (req, res) => { //CREATE
    try {
        const { id, nome, descricao, preco, img } = req.body
        const produto = { id, nome, descricao, preco, img };
        dados_produtos.push(produto);
        return res.status(201).json(produto);
    } catch (error) {
        return res.status(500).json("Ocorreu um erro");
    }
});

app.patch('/produtos/:produtos_id', (req, res) => { //UPDATE
    try {
        const { nome, descricao, preco, img } = req.body;
        const { produtos_id } = req.params;
        const produto = dados_produtos.find((produto) => produto.id == produtos_id);
        if (!produto) {
            return res.status(404).json("Produto Não Encontrado");
        } else {
            produto.id = produto.id;
            produto.nome = nome ? nome : produto.nome;
            produto.descricao = descricao ? descricao : produto.descricao;
            produto.preco = preco ? preco : produto.preco;
            produto.img = img ? img : img.img;
            return res.status(200).json(produto);
        }
    } catch (error) {
        return res.status(500).json("Ocorreu um erro " + error);
    }
});

app.delete('/produtos/:produtos_id', (req, res) => { //DELETE
    try {
        const { produtos_id } = req.params;
        const produto_filtrado = dados_produtos.filter(produto => produto.id != produtos_id);
        if (!produto_filtrado) {
            return res.status(404).json("Produto Não Encontrado");
        } else {
            dados_produtos = produto_filtrado;
            return res.status(200).json("produto " + produtos_id + " deletado com sucesso");
        }
    } catch (error) {
        return res.status(500).json("Ocorreu um erro");
    }
});


//SERVIDOR
app.listen(port, () => console.log("Rodando"));