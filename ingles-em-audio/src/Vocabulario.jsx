import { useState } from "react";

function ControleAudio({ src, onPlay, onError, rotulo }) {
  const [erro, setErro] = useState(false);

  if (!src) return null;

  return (
    <div className="controle-audio">
      <span>{rotulo}</span>
      <audio
        controls
        preload="none"
        src={src}
        onPlay={onPlay}
        onError={() => {
          setErro(true);
          onError();
        }}
      >
        Seu navegador não oferece suporte a áudio.
      </audio>
      {erro && <small role="status">Áudio indisponível; continue com o texto.</small>}
    </div>
  );
}

export default function Vocabulario({ cartoes, aoPraticar, aoTocarAudio }) {
  const [indice, setIndice] = useState(0);
  const [mostrarTraducao, setMostrarTraducao] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const cartao = cartoes[indice];
  const primeiroCartao = indice === 0;
  const ultimoCartao = indice === cartoes.length - 1;

  function mudarCartao(novoIndice) {
    setIndice(novoIndice);
    setMostrarTraducao(false);
    setMensagem("");
  }

  function ouvirOutraVoz() {
    if (!("speechSynthesis" in window)) {
      setMensagem("A síntese de voz não está disponível neste navegador.");
      return;
    }

    window.speechSynthesis.cancel();
    const fala = new SpeechSynthesisUtterance(cartao.titulo);
    fala.lang = "en-US";
    fala.onstart = () => setMensagem("Reproduzindo outra voz…");
    fala.onend = () => setMensagem("");
    fala.onerror = () => setMensagem("Não foi possível reproduzir a voz sintetizada.");
    window.speechSynthesis.speak(fala);
  }

  return (
    <section className="estudo" aria-label="Cartões de estudo">
      <p className="contador">
        Cartão {indice + 1} de {cartoes.length}
      </p>

      <div className="area-imagem animar-cartao" key={indice}>
        <span role="img" aria-label={cartao.traducao} className="imagem-emoji">
          {cartao.imagem}
        </span>
      </div>

      <h2 lang="en" className="palavra">
        {cartao.titulo}
      </h2>

      <button
        type="button"
        aria-expanded={mostrarTraducao}
        aria-controls="traducao-palavra"
        onClick={() => setMostrarTraducao((visivel) => !visivel)}
      >
        {mostrarTraducao ? "Ocultar tradução" : "Ver tradução"}
      </button>

      <p id="traducao-palavra" className="traducao" aria-live="polite">
        {mostrarTraducao ? cartao.traducao : ""}
      </p>

      <ControleAudio
        src={cartao.audio}
        rotulo="Pronúncia"
        onPlay={aoTocarAudio}
        onError={() => setMensagem("Áudio indisponível; continue com o texto.")}
      />
      {cartao.sintese && (
        <button type="button" className="botao-secundario" onClick={ouvirOutraVoz}>
          Ouvir outra voz
        </button>
      )}
      <p className="mensagem-midia" role="status" aria-live="polite">{mensagem}</p>

      <div className="navegacao">
        <button
          type="button"
          disabled={primeiroCartao}
          onClick={() => mudarCartao(indice - 1)}
        >
          Anterior
        </button>

        {ultimoCartao ? (
          <button type="button" onClick={aoPraticar}>Praticar</button>
        ) : (
          <button type="button" onClick={() => mudarCartao(indice + 1)}>Próxima</button>
        )}
      </div>
    </section>
  );
}