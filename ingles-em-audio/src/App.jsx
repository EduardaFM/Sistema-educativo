import { useRef, useState } from "react";
import "./App.css";
import Vocabulario from "./Vocabulario";
import { CHAVE_PREFERENCIA_SOM, CHAVE_PROGRESSO, licoes, midia } from "./lessons";

function lerProgresso() {
  try {
    const salvo = localStorage.getItem(CHAVE_PROGRESSO);
    if (!salvo) return {};

    const registros = JSON.parse(salvo);
    if (!registros || typeof registros !== "object" || Array.isArray(registros)) {
      console.error("O progresso salvo tem um formato inválido.");
      return {};
    }

    return Object.fromEntries(
      licoes
        .filter((licao) => {
          const tentativa = registros[licao.id];
          return (
            tentativa &&
            Number.isInteger(tentativa.acertos) &&
            tentativa.acertos >= 0 &&
            tentativa.acertos <= licao.questoes.length &&
            tentativa.total === licao.questoes.length &&
            Array.isArray(tentativa.revisao)
          );
        })
        .map((licao) => [licao.id, registros[licao.id]]),
    );
  } catch (erro) {
    console.error("Não foi possível ler o progresso salvo.", erro);
    return {};
  }
}

function lerPreferenciaSom() {
  try {
    return localStorage.getItem(CHAVE_PREFERENCIA_SOM) === "true";
  } catch (erro) {
    console.error("Não foi possível ler a preferência de som.", erro);
    return false;
  }
}

function ControleAudio({ src, aoTocar, aoFalhar, rotulo }) {
  const [falhou, setFalhou] = useState(false);
  if (!src) return null;

  return (
    <div className="controle-audio">
      {rotulo && <span>{rotulo}</span>}
      <audio
        controls
        preload="none"
        src={src}
        onPlay={aoTocar}
        onError={() => {
          setFalhou(true);
          aoFalhar();
        }}
      >
        Seu navegador não oferece suporte a áudio.
      </audio>
      {falhou && <small role="status">Mídia indisponível; o conteúdo em texto continua disponível.</small>}
    </div>
  );
}

function Dialogo({ licao, aoTocarAudio, aoFalharAudio, aoFalharVideo }) {
  const [falhou, setFalhou] = useState(false);

  return (
    <>
      {licao.video && (
        <div className="player-video">
          <video
            controls
            preload="metadata"
            onPlay={aoTocarAudio}
            onError={() => {
              setFalhou(true);
              aoFalharVideo();
            }}
          >
            <source src={licao.video} type="video/mp4" />
            {licao.legendas && (
              <track kind="captions" src={licao.legendas} srcLang="en" label="English" default />
            )}
            Seu navegador não oferece suporte a vídeo.
          </video>
          {falhou && <p role="status">Vídeo indisponível; leia a transcrição abaixo.</p>}
        </div>
      )}
      <div className="dialogo" aria-label="Transcrição do diálogo">
        {licao.dialogo.map((linha, indice) => (
          <article className={`fala fala-${linha.falante === "Cliente" ? "cliente" : "atendente"}`} key={indice}>
            <strong>{linha.falante}</strong>
            <p lang="en">{linha.fala}</p>
            <ControleAudio
              src={linha.audio || ""}
              rotulo={`Ouvir ${linha.falante.toLowerCase()}`}
              aoTocar={aoTocarAudio}
              aoFalhar={aoFalharAudio}
            />
          </article>
        ))}
      </div>
    </>
  );
}

function Exercicio({ licao, aoConcluir, aoTocarAudio, aoFalharAudio }) {
  const [indice, setIndice] = useState(0);
  const [respostas, setRespostas] = useState([]);
  const [modoAudio, setModoAudio] = useState(false);
  const questao = licao.questoes[indice];
  const resposta = respostas[indice] || null;
  const possuiAudios = licao.id === "na-mesa" && licao.cartoes.every((cartao) => cartao.audio);

  function responder(opcaoId) {
    if (resposta) return;
    const novasRespostas = [...respostas];
    novasRespostas[indice] = opcaoId;
    setRespostas(novasRespostas);
  }

  function continuar() {
    if (indice === licao.questoes.length - 1) {
      aoConcluir(respostas);
      return;
    }
    setIndice(indice + 1);
  }

  const correta = resposta === questao.correta;
  const opcaoCorreta = questao.opcoes.find((opcao) => opcao.id === questao.correta);

  return (
    <section className="exercicio" aria-labelledby="titulo-exercicio">
      <div className="linha-progresso">
        <p className="contador">Questão {indice + 1} de {licao.questoes.length}</p>
        <progress value={indice + (resposta ? 1 : 0)} max={licao.questoes.length}>
          {indice + (resposta ? 1 : 0)} de {licao.questoes.length}
        </progress>
      </div>
      {possuiAudios && (
        <div className="alternar-modo">
          <button
            type="button"
            className={modoAudio ? "botao-secundario" : ""}
            aria-pressed={!modoAudio}
            onClick={() => setModoAudio(false)}
          >
            Imagem → palavra
          </button>
          <button
            type="button"
            className={modoAudio ? "" : "botao-secundario"}
            aria-pressed={modoAudio}
            onClick={() => setModoAudio(true)}
          >
            Som → imagem
          </button>
        </div>
      )}
      <h2 id="titulo-exercicio">{modoAudio ? "Ouça e escolha a imagem." : questao.prompt}</h2>
      {questao.alvo && !modoAudio && (
        <div className="alvo-imagem">
          <span role="img" aria-label={licao.cartoes.find((cartao) => cartao.id === questao.alvo).traducao}>
            {licao.cartoes.find((cartao) => cartao.id === questao.alvo).imagem}
          </span>
        </div>
      )}
      {questao.frase && (
        <div className="frase-questao">
          <p lang="en">{questao.frase}</p>
          <ControleAudio
            src={licao.cartoes[indice].audio}
            rotulo="Ouvir o pedido"
            aoTocar={aoTocarAudio}
            aoFalhar={aoFalharAudio}
          />
        </div>
      )}
      {modoAudio && questao.alvo && (
        <ControleAudio
          src={licao.cartoes[indice].audio}
          rotulo="Ouvir a palavra"
          aoTocar={aoTocarAudio}
          aoFalhar={aoFalharAudio}
        />
      )}

      <div className={`opcoes ${modoAudio ? "opcoes-imagem" : ""}`}>
        {questao.opcoes.map((opcao) => (
          <button
            className={`opcao ${resposta === opcao.id ? (correta ? "opcao-correta" : "opcao-incorreta") : ""}`}
            type="button"
            key={opcao.id}
            disabled={Boolean(resposta)}
            aria-pressed={resposta === opcao.id}
            aria-label={modoAudio ? `Imagem de ${opcao.descricao}` : opcao.rotulo}
            onClick={() => responder(opcao.id)}
          >
            {modoAudio ? (
              <span className="opcao-imagem" role="img" aria-label={opcao.descricao}>{opcao.imagem}</span>
            ) : (
              <>
                {opcao.imagem && <span className="opcao-emoji" role="img" aria-label={opcao.descricao}>{opcao.imagem}</span>}
                <span lang="en">{opcao.rotulo}</span>
              </>
            )}
          </button>
        ))}
      </div>

      {resposta && (
        <p className={`feedback ${correta ? "feedback-correto" : "feedback-incorreto"}`} role="status" aria-live="polite">
          {correta
            ? "Correto! Muito bem."
            : `Ainda não. A resposta correta é ${opcaoCorreta.rotulo}${opcaoCorreta.descricao ? ` (${opcaoCorreta.descricao})` : ""}.`}
        </p>
      )}
      {resposta && (
        <button type="button" onClick={continuar}>
          {indice === licao.questoes.length - 1 ? "Ver resultado" : "Continuar"}
        </button>
      )}
    </section>
  );
}

function Resultado({ tentativa, aoRefazer, aoVoltar }) {
  const erros = tentativa.revisao;

  return (
    <section className="resultado" aria-labelledby="titulo-resultado">
      <p className="nivel">Lição concluída</p>
      <h2 id="titulo-resultado">Seu resultado</h2>
      <p className="nota">{tentativa.acertos}/{tentativa.total} acertos</p>
      <p>
        {tentativa.acertos === tentativa.total
          ? "Excelente trabalho! Você acertou todas."
          : "Boa prática! Revise os itens abaixo e tente novamente."}
      </p>
      <div className="revisao">
        <h3>Para revisar</h3>
        {erros.length ? (
          <ul>{erros.map((item) => <li key={item}>{item}</li>)}</ul>
        ) : (
          <p>Nenhum conteúdo para revisar.</p>
        )}
      </div>
      <div className="navegacao">
        <button type="button" onClick={aoRefazer}>Refazer exercício</button>
        <button type="button" className="botao-secundario" onClick={aoVoltar}>Voltar às lições</button>
      </div>
    </section>
  );
}

export default function App() {
  const [licaoAberta, setLicaoAberta] = useState(null);
  const [etapa, setEtapa] = useState("estudo");
  const [tentativaAtual, setTentativaAtual] = useState(null);
  const [progresso, setProgresso] = useState(lerProgresso);
  const [somAtivado, setSomAtivado] = useState(lerPreferenciaSom);
  const [aviso, setAviso] = useState("");
  const audioAtivo = useRef(null);
  const audioVinheta = useRef(null);

  function mudarPreferenciaSom(ativada) {
    try {
      localStorage.setItem(CHAVE_PREFERENCIA_SOM, String(ativada));
      setAviso("");
    } catch (erro) {
      console.error("Não foi possível salvar a preferência de som.", erro);
      setAviso("Não foi possível salvar sua preferência de som neste navegador.");
    }
    setSomAtivado(ativada);
  }

  function voltarInicio() {
    setLicaoAberta(null);
    setEtapa("estudo");
    setTentativaAtual(null);
    setAviso("");
    if (audioAtivo.current) audioAtivo.current.pause();
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }

  function abrirLicao(licao) {
    setLicaoAberta(licao);
    setEtapa("estudo");
    setTentativaAtual(null);
    setAviso("");
  }

  function tocarAudio(evento) {
    const tocando = evento.currentTarget;
    if (audioAtivo.current && audioAtivo.current !== tocando) audioAtivo.current.pause();
    audioAtivo.current = tocando;
  }

  function falhaMidia() {
    setAviso("Não foi possível carregar a mídia. A versão em texto continua disponível.");
  }

  function iniciarExercicio() {
    setTentativaAtual(null);
    setEtapa("exercicio");
  }

  function concluirExercicio(respostas) {
    const acertos = respostas.reduce(
      (total, resposta, indice) => total + (resposta === licaoAberta.questoes[indice].correta ? 1 : 0),
      0,
    );
    const tentativa = {
      acertos,
      total: licaoAberta.questoes.length,
      revisao: licaoAberta.questoes
        .filter((questao, indice) => respostas[indice] !== questao.correta)
        .map((questao) => questao.revisao),
      concluidaEm: new Date().toISOString(),
    };
    const novoProgresso = { ...progresso, [licaoAberta.id]: tentativa };
    setProgresso(novoProgresso);
    setTentativaAtual(tentativa);
    setEtapa("resultado");

    try {
      localStorage.setItem(CHAVE_PROGRESSO, JSON.stringify(novoProgresso));
    } catch (erro) {
      console.error("Não foi possível salvar o resultado da lição.", erro);
      setAviso("O resultado foi calculado, mas não pôde ser salvo neste navegador.");
    }

    if (somAtivado && midia.vinhetaConclusao) {
      const vinheta = audioVinheta.current || new Audio(midia.vinhetaConclusao);
      audioVinheta.current = vinheta;
      if (audioAtivo.current) audioAtivo.current.pause();
      audioAtivo.current = vinheta;
      vinheta.currentTime = 0;
      vinheta.play().catch(falhaMidia);
    }
  }

  const concluidas = licoes.filter((licao) => progresso[licao.id]).length;

  if (licaoAberta && etapa === "resultado" && tentativaAtual) {
    return (
      <main className="pagina pagina-licao">
        <CabecalhoLicao licao={licaoAberta} aoVoltar={voltarInicio} />
        <Resultado
          tentativa={tentativaAtual}
          aoRefazer={iniciarExercicio}
          aoVoltar={voltarInicio}
        />
        <p className="aviso-midia" role="status">{aviso}</p>
      </main>
    );
  }

  if (licaoAberta) {
    return (
      <main className="pagina pagina-licao">
        <CabecalhoLicao licao={licaoAberta} aoVoltar={voltarInicio} />
        {etapa === "estudo" && (
          <>
            {licaoAberta.modo === "vocabulario" || licaoAberta.modo === "frases" ? (
              <Vocabulario
                cartoes={licaoAberta.cartoes}
                aoPraticar={iniciarExercicio}
                aoTocarAudio={tocarAudio}
              />
            ) : (
              <section className="estudo estudo-dialogo">
                <h2>Leia o diálogo</h2>
                <Dialogo
                  licao={licaoAberta}
                  aoTocarAudio={tocarAudio}
                  aoFalharAudio={falhaMidia}
                  aoFalharVideo={falhaMidia}
                />
                <button type="button" onClick={iniciarExercicio}>Praticar compreensão</button>
              </section>
            )}
            {licaoAberta.modo === "frases" && (
              <p className="dica">Dica: toque em “Ver tradução” para conferir o significado de cada frase.</p>
            )}
          </>
        )}
        {etapa === "exercicio" && (
          <Exercicio
            key={licaoAberta.id}
            licao={licaoAberta}
            aoConcluir={concluirExercicio}
            aoTocarAudio={tocarAudio}
            aoFalharAudio={falhaMidia}
          />
        )}
        <p className="aviso-midia" role="status">{aviso}</p>
      </main>
    );
  }

  return (
    <main className="pagina">
      <header className="cabecalho-inicial">
        <p className="etiqueta">Seu primeiro passo no inglês</p>
        <h1>Inglês do dia a dia</h1>
        <p>Do nome de um alimento à sua primeira conversa em um café.</p>
        <label className="preferencia-som">
          <input
            type="checkbox"
            checked={somAtivado}
            onChange={(evento) => mudarPreferenciaSom(evento.target.checked)}
          />
          Tocar vinheta ao concluir uma lição (quando disponível)
        </label>
      </header>

      <section aria-labelledby="titulo-licoes">
        <div className="cabecalho-secao">
          <div>
            <p className="etiqueta">Progresso geral</p>
            <h2 id="titulo-licoes">Suas lições</h2>
          </div>
          <p className="progresso-texto">{concluidas} de {licoes.length} lições concluídas</p>
        </div>
        <progress className="progresso-geral" value={concluidas} max={licoes.length}>
          {concluidas} de {licoes.length}
        </progress>

        <div className="grade">
          {licoes.map((licao) => (
            <article className="cartao" key={licao.id}>
              <p className="nivel">Básico <span>· Nível {licao.nivel}</span></p>
              <h3>{licao.titulo}</h3>
              <p>{licao.descricao}</p>
              <p className={`estado-licao ${progresso[licao.id] ? "concluida" : ""}`}>
                {progresso[licao.id]
                  ? `Concluída · ${progresso[licao.id].acertos}/${progresso[licao.id].total} acertos`
                  : "Ainda não iniciada"}
              </p>
              <button type="button" onClick={() => abrirLicao(licao)}>
                {progresso[licao.id] ? "Revisar lição" : "Entrar na lição"}
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function CabecalhoLicao({ licao, aoVoltar }) {
  return (
    <>
      <button type="button" className="voltar" onClick={aoVoltar}>← Voltar às lições</button>
      <header className="cabecalho-licao">
        <p className="nivel">Básico · Nível {licao.nivel}</p>
        <h1>{licao.titulo}</h1>
        <p>{licao.descricao}</p>
      </header>
    </>
  );
}