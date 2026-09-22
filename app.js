import express from "express";

const app = express();

app.use(express.json());

const PORT = 3000;

const produtos = [
  { id: 1, nome: "Teclado", categoria: "periféricos" },
  { id: 2, nome: "Controle", categoria: "periféricos" },
  { id: 3, nome: "Mouse", categoria: "periféricos" },
  { id: 4, nome: "Processador AMD Ryzen 7 7500", categoria: "eletrônicos" },
];

const tarefas = [
  {id: 5, titulo: "Estudar PTAS", concluida: false },
  {id: 6, titulo: "Prova de portugues",  concluida: true},
  {id: 7, titulo: "Atividade de quimica",  concluida: false },
];

function verificarTarefaExiste(req, res, next) {
  const idBusca = parseInt(req.params.id);
  const tarefa = tarefas.find(t => t.id === idBusca);

  if (!tarefa) {
   
    return res.status(404).json({ erro: 'Tarefa não encontrada.' });
  }

  req.tarefa = tarefa; 
  
  
  next(); 
}

app.get('/tarefas/:id', verificarTarefaExiste, (req, res) => {

  res.json(req.tarefa);
});

const filtrarTarefas = (req, res, next) => {
  const { concluida } = req.query;

  if (concluida !== undefined) {
  
    const statusBuscado = concluida === 'true';
   
    req.filtrarTarefas = tarefas.filter(t => t.concluida === statusBuscado);
  } else {
   
    req.filtrarTarefas = tarefas;
  }

  next();
};

app.post('/tarefas', (req, res) => {
const { titulo} = req.body;

 if (!titulo) {
        return res.status(400).json({ erro: 'O título é obrigatório.' });
    }

    const novaTarefa = {
        id: tarefas.length + 1,
        titulo: titulo,
        concluida: false
    };

    tarefas.push(novaTarefa);

    return res.status(201).json(novaTarefa);
} )

app.get('/tarefas', filtrarTarefas, (req, res) => {
 
  res.json(req.filtrarTarefas);
});

app.post('/tarefas', [ verificarTarefaExiste], [filtrarTarefas], (req, res)=>{
   res.status(201).json({
      mensagem: 'Tarefa criada com sucesso',
      tarefa: req.body
})
}); 

app.get("/", (req, res) => {
  res.json("API de tarefas no ar");
});

app.get("/produtos", (req, res) => {
  res.json(produtos);
});

app.post("/produto", (req, res) => {
  const nome = req.body.nome;
  const categoria = req.body.categoria;

  if (!nome || typeof nome !== "string") {
    return res
      .status(400)
      .json({ erro: 'O campo "nome" é obrigatório e deve ser uma string' });
  }

  if (categoria === undefined || typeof categoria !== "string") {
    return res
      .status(400)
      .json({
        erro: 'O campo "categoria" é obrigatório e deve ser uma string',
      });
  }

  const novoProduto = {
    id: produtos.length + 1,
    nome,
    categoria,
  };

  produtos.push(novoProduto);

  res.status(201).json(novoProduto);
});

app.get("/produtos/:id", (req, res) => {
 
  const id = req.params.id;
  const produto = produtos.find((p) => p.id === parseInt(id));
  if (!produto) {
    return res.status(404).json({ error: "Produto não encontrado!" });
  }
  res.status(200).json(produto);
});

app.get("/produtos/busca", (req, res) => {
  const categoria = req.query.categoria;
  const ordenar = req.query.ordenar;

  let resultado = produtos;

  if (categoria) {
    resultado = resultado.filter((produto) => {
      produto.categoria === categoria;
    });
  }

  if (ordenar) {
    resultado = [...resultado].sort((a, b) => {
      a.preco - b.preco;
    });
  }

  res.json(resultado);
});

app.listen(PORT, () => {
  console.log(`Servidor funcionando http://localhost:${PORT}`);
});