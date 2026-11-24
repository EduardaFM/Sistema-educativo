# Inglês do dia a dia

Protótipo acadêmico de software educacional para o ensino de inglês básico com recursos multimídia. As lições funcionam com texto e emojis; os caminhos de áudio e vídeo são opcionais e podem ser preenchidos quando os arquivos da equipe estiverem prontos.

## Objetivo e recursos

O projeto oferece lições interativas organizadas por níveis do inglês básico, começando pelo vocabulário e avançando para pedidos e compreensão de diálogos. A proposta é tornar o aprendizado mais interativo por meio de:

- Cartões de vocabulário e exercícios para associar palavras, imagens e sons.
- Áudio de pronúncia para palavras e frases em inglês.
- Música e voz sintetizadas como recursos opcionais de apoio.
- Animação e vídeo como recursos complementares às lições.
- Acompanhamento do progresso, das lições concluídas e dos resultados dos exercícios.

As mídias serão produzidas pela equipe e adicionadas posteriormente: áudio e música no BandLab e vídeo no CapCut. O site não depende desses arquivos para funcionar.

## Tecnologias e ferramentas

- Desenvolvimento: React e Vite.
- Música e áudio: BandLab.
- Edição de vídeo: CapCut.

## Executar

Na pasta `ingles-em-audio`, instale as dependências e inicie o servidor local:

```sh
npm install
npm run dev
```

Para validar a versão de produção:

```sh
npm run build
npm run preview
```

## Conteúdo e mídias

Cadastre textos, alternativas, gabaritos e caminhos de mídia em `src/lessons.js`. Os campos de mídia começam vazios; nesse estado, os controles correspondentes não aparecem.

- Pronúncia de vocabulário: preencha `audio` no cartão. Por exemplo, para `apple.wav`, coloque o arquivo em `public/audio/apple.wav` e configure `audio: "/audio/apple.wav"` no cartão `apple`.
- Frases: preencha `audio` no cartão da frase em inglês. O player de gravação aparece junto ao conteúdo e pode ser usado novamente. A opção “Ouvir outra voz” usa a síntese de fala do navegador.
- Falas do diálogo: preencha `audio` na fala correspondente.
- Vídeo e legendas: preencha `video` e, se houver arquivo WebVTT, `legendas` na lição `no-cafe`. Por exemplo, coloque `no-cafe.mp4` em `public/videos/no-cafe.mp4` e configure `video: "/videos/no-cafe.mp4"`.
- Vinheta: preencha `midia.vinhetaConclusao` no mesmo arquivo, por exemplo `"/audio/vinheta.mp3"`. O áudio de conclusão respeita a opção “Tocar vinheta ao concluir uma lição” na página inicial e interrompe outro áudio antes de tocar.

O progresso e a preferência da vinheta são guardados no `localStorage` do navegador. Para apagar o progresso durante testes, remova a chave `ingles-do-dia-a-dia:progresso` nas ferramentas de desenvolvimento do navegador.
