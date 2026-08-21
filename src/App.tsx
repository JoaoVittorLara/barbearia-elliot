import { domAnimation, LazyMotion, MotionConfig } from "motion/react";
import { Avaliacoes } from "./componentes/Avaliacoes";
import { BotaoWhatsApp } from "./componentes/BotaoWhatsApp";
import { Cabecalho } from "./componentes/Cabecalho";
import { ContatoLocal } from "./componentes/ContatoLocal";
import { Galeria } from "./componentes/Galeria";
import { Hero } from "./componentes/Hero";
import { Rodape } from "./componentes/Rodape";
import { Servicos } from "./componentes/Servicos";
import { agendamentoPrincipal } from "./dados/conteudo";
import { useCalCom } from "./hooks/useCalCom";
import { useLenis } from "./hooks/useLenis";

export default function App() {
  useLenis();
  useCalCom(agendamentoPrincipal.namespace, agendamentoPrincipal.link);

  return (
    // LazyMotion + `m` no lugar de `motion`: carrega so o pacote `domAnimation`
    // (animacao, entrada/saida, gestos de hover e tap) em vez do Motion
    // inteiro. Corta uns 17kb do bundle e, mais importante, o tempo de parse no
    // celular. O preco e nao ter animacao de layout, que o site nao usa.
    //
    // reducedMotion="user" faz TODO componente do Motion respeitar a
    // preferencia do sistema de uma vez: os deslocamentos somem e sobra o fade.
    // Fazer isso componente a componente seria esquecer em algum.
    <LazyMotion features={domAnimation} strict>
    <MotionConfig reducedMotion="user">
      <a href="#servicos" className="link-pular">
        Pular para o conteúdo
      </a>

      <Cabecalho />

      <main>
        <Hero />
        <Servicos />
        <Avaliacoes />
        <Galeria />
        <ContatoLocal />
      </main>

      <Rodape />
      <BotaoWhatsApp />
    </MotionConfig>
    </LazyMotion>
  );
}
