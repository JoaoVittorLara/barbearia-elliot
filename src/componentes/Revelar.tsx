import { m } from "motion/react";
import type { ReactNode } from "react";

/**
 * Envolve um bloco para ele entrar quando chega na tela: sobe 16px e aparece.
 *
 * `once: true` porque reveal que repete a cada scroll cansa depois da terceira
 * vez. `margin: "-12%"` dispara um pouco antes do elemento encostar na borda,
 * senao a animacao comeca tarde demais e o usuario ve o pulo.
 *
 * Movimento reduzido: o <MotionConfig reducedMotion="user"> la no App corta o
 * deslocamento e deixa so o fade. Nada fica preso invisivel.
 */

type Props = {
  children: ReactNode;
  /** Segundos. Use para escalonar blocos irmaos (0, 0.08, 0.16...). */
  atraso?: number;
  className?: string;
  /** Elemento HTML gerado. Util para nao quebrar semantica de lista ou grid. */
  como?: "div" | "li" | "article" | "section";
};

export function Revelar({
  children,
  atraso = 0,
  className,
  como = "div",
}: Props) {
  const Componente = m[como];

  return (
    <Componente
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{
        duration: 0.55,
        delay: atraso,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </Componente>
  );
}
