const express = require('express');
const pathProdutos = "src/produtos/produtos.json";
const encond = "utf-8";
// DATABASE
const fs = require('fs');

//METODOS GENERICOS
const dados_produtos = (path, tipo) => {
    try {
        const dados = fs.readFileSync(path, tipo);
        dadosObj = JSON.parse(dados);
        return dadosObj;
    } catch (error) {
        return error;
    }
}

const convertJsonToString = (data) => {
    return JSON.stringify(data, null, 2);
}

const port = process.env.PORT || 3333;
// APP
const app = express();
app.use(express.json());

//ROTAS
app.get('/produtos', (req, res) => { // GET ALL
    try {
        return res.status(200).json(dados_produtos(pathProdutos, encond));
    } catch (error) {
        return res.status(500).json("Ocorreu um erro");
    }
});

app.get('/produtos/:produtos_id', (req, res) => { // GET BY ID
    try {
        const { produtos_id } = req.params;
        let produtosJson = dados_produtos(pathProdutos, encond);
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
        let array_produtos = dados_produtos(pathProdutos, encond); //Pegando dados 
        const { nome, descricao, preco, img } = req.body;
        const idProduto = () => {
            let maiorID = 0;
            array_produtos.forEach(element => {
                if (typeof element.id == 'number') {
                    maiorID = maiorID > element.id ? maiorID : element.id;
                }
            });
            maiorID++;
            return maiorID;
        }
        let id = idProduto();
        const produto = { id, nome, descricao, preco, img };
        array_produtos.push(produto);
        fs.writeFileSync(pathProdutos, convertJsonToString(array_produtos), encond);
        return res.status(201).json(produto);
    } catch (error) {
        return res.status(500).json("Ocorreu um erro " + error);
    }
});

app.patch('/produtos/:produtos_id', (req, res) => { //UPDATE
    try {
        const { nome, descricao, preco, img } = req.body;
        const { produtos_id } = req.params;
        let array_produtos = dados_produtos(pathProdutos, encond); //Pegando dados 
        const produto = array_produtos.find((produto) => produto.id == produtos_id);
        const produtos_filtrados = array_produtos.filter((produto) => produto.id != produtos_id);
        if (!produto) {
            return res.status(404).json("Produto Não Encontrado");
        } else {
            produto.id = produto.id;
            produto.nome = nome ? nome : produto.nome;
            produto.descricao = descricao ? descricao : produto.descricao;
            produto.preco = preco ? preco : produto.preco;
            produto.img = img ? img : img.img;
            produtos_filtrados.push(produto);
            fs.writeFileSync(pathProdutos, convertJsonToString(produtos_filtrados), encond);
            return res.status(200).json(produto);
        }
    } catch (error) {
        return res.status(500).json("Ocorreu um erro " + error);
    }
});

app.delete('/produtos/:produtos_id', (req, res) => { //DELETE
    try {
        const { produtos_id } = req.params;
        let array_produtos = dados_produtos(pathProdutos, encond); //Pegando dados 
        const existe = array_produtos.find(produto => produto.id == produtos_id);
        if (existe) {
            const produto_filtrado = array_produtos.filter(produto => produto.id != produtos_id);
            fs.writeFileSync(pathProdutos, convertJsonToString(produto_filtrado), encond);
            return res.status(200).json("produto " + produtos_id + " deletado com sucesso");
        } else {
            return res.status(404).json("Produto Não Encontrado");
        }
    } catch (error) {
        return res.status(500).json("Ocorreu um erro");
    }
});

//SERVIDOR
app.listen(port, () => console.log("Rodando"));