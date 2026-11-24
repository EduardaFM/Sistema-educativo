export const licoes = [
  {
    id: "na-mesa",
    nivel: 1,
    titulo: "Na mesa",
    descricao: "Aprenda os nomes de alimentos e bebidas em inglês.",
    modo: "vocabulario",
    cartoes: [
      { id: "apple", titulo: "apple", traducao: "maçã", imagem: "🍎", audio: "" },
      { id: "bread", titulo: "bread", traducao: "pão", imagem: "🍞", audio: "" },
      { id: "milk", titulo: "milk", traducao: "leite", imagem: "🥛", audio: "" },
    ],
    questoes: [
      {
        id: "identificar-apple",
        prompt: "Qual é a palavra em inglês para esta imagem?",
        alvo: "apple",
        revisao: "apple — maçã",
        opcoes: [
          { id: "apple", rotulo: "apple" },
          { id: "bread", rotulo: "bread" },
          { id: "milk", rotulo: "milk" },
        ],
        correta: "apple",
      },
      {
        id: "identificar-bread",
        prompt: "Qual é a palavra em inglês para esta imagem?",
        alvo: "bread",
        revisao: "bread — pão",
        opcoes: [
          { id: "apple", rotulo: "apple" },
          { id: "bread", rotulo: "bread" },
          { id: "milk", rotulo: "milk" },
        ],
        correta: "bread",
      },
      {
        id: "identificar-milk",
        prompt: "Qual é a palavra em inglês para esta imagem?",
        alvo: "milk",
        revisao: "milk — leite",
        opcoes: [
          { id: "apple", rotulo: "apple" },
          { id: "bread", rotulo: "bread" },
          { id: "milk", rotulo: "milk" },
        ],
        correta: "milk",
      },
    ],
  },
  {
    id: "fazendo-um-pedido",
    nivel: 2,
    titulo: "Fazendo um pedido",
    descricao: "Use frases curtas para pedir algo em inglês.",
    modo: "frases",
    idiomaOpcoes: "pt-BR",
    cartoes: [
      {
        id: "pedido-apple",
        titulo: "I’d like an apple, please.",
        traducao: "Eu gostaria de uma maçã, por favor.",
        imagem: "🍎",
        audio: "",
        sintese: true,
      },
      {
        id: "pedido-bread",
        titulo: "I’d like some bread, please.",
        traducao: "Eu gostaria de um pouco de pão, por favor.",
        imagem: "🍞",
        audio: "",
        sintese: true,
      },
      {
        id: "pedido-milk",
        titulo: "I’d like some milk, please.",
        traducao: "Eu gostaria de um pouco de leite, por favor.",
        imagem: "🥛",
        audio: "",
        sintese: true,
      },
    ],
    questoes: [
      {
        id: "pedido-apple",
        frase: "I’d like an apple, please.",
        prompt: "Qual item a pessoa pediu?",
        revisao: "I’d like an apple, please. — uma maçã",
        opcoes: [
          { id: "apple", rotulo: "Maçã", imagem: "🍎", descricao: "maçã" },
          { id: "bread", rotulo: "Pão", imagem: "🍞", descricao: "pão" },
          { id: "milk", rotulo: "Leite", imagem: "🥛", descricao: "leite" },
        ],
        correta: "apple",
      },
      {
        id: "pedido-bread",
        frase: "I’d like some bread, please.",
        prompt: "Qual item a pessoa pediu?",
        revisao: "I’d like some bread, please. — pão",
        opcoes: [
          { id: "apple", rotulo: "Maçã", imagem: "🍎", descricao: "maçã" },
          { id: "bread", rotulo: "Pão", imagem: "🍞", descricao: "pão" },
          { id: "milk", rotulo: "Leite", imagem: "🥛", descricao: "leite" },
        ],
        correta: "bread",
      },
      {
        id: "pedido-milk",
        frase: "I’d like some milk, please.",
        prompt: "Qual item a pessoa pediu?",
        revisao: "I’d like some milk, please. — leite",
        opcoes: [
          { id: "apple", rotulo: "Maçã", imagem: "🍎", descricao: "maçã" },
          { id: "bread", rotulo: "Pão", imagem: "🍞", descricao: "pão" },
          { id: "milk", rotulo: "Leite", imagem: "🥛", descricao: "leite" },
        ],
        correta: "milk",
      },
    ],
  },
  {
    id: "no-cafe",
    nivel: 3,
    titulo: "No café",
    descricao: "Acompanhe uma conversa entre cliente e atendente.",
    modo: "dialogo",
    video: "",
    legendas: "",
    dialogo: [
      { falante: "Atendente", fala: "Hello! What would you like to eat?", audio: "" },
      { falante: "Cliente", fala: "Some bread, please.", audio: "" },
      { falante: "Atendente", fala: "And what would you like to drink?", audio: "" },
      { falante: "Cliente", fala: "Some milk, please.", audio: "" },
    ],
    questoes: [
      {
        id: "comer",
        prompt: "O que o cliente pediu para comer?",
        revisao: "Some bread, please. — pão",
        opcoes: [
          { id: "apple", rotulo: "An apple", imagem: "🍎" },
          { id: "bread", rotulo: "Some bread", imagem: "🍞" },
          { id: "milk", rotulo: "Some milk", imagem: "🥛" },
        ],
        correta: "bread",
      },
      {
        id: "beber",
        prompt: "O que o cliente pediu para beber?",
        revisao: "Some milk, please. — leite",
        opcoes: [
          { id: "apple", rotulo: "An apple", imagem: "🍎" },
          { id: "bread", rotulo: "Some bread", imagem: "🍞" },
          { id: "milk", rotulo: "Some milk", imagem: "🥛" },
        ],
        correta: "milk",
      },
      {
        id: "educacao",
        prompt: "Qual expressão o cliente usou para fazer o pedido com educação?",
        revisao: "please — por favor",
        opcoes: [
          { id: "hello", rotulo: "Hello!" },
          { id: "and", rotulo: "And what would you like?" },
          { id: "please", rotulo: "Please." },
        ],
        correta: "please",
      },
    ],
  },
];

export const midia = {
  vinhetaConclusao: "",
};

export const CHAVE_PROGRESSO = "ingles-do-dia-a-dia:progresso";
export const CHAVE_PREFERENCIA_SOM = "ingles-do-dia-a-dia:vinheta-ativada";
