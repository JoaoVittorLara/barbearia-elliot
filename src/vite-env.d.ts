/// <reference types="vite/client" />

interface Window {
  /**
   * Instante em que o loader de abertura apareceu, gravado pelo <script>
   * inline do index.html. Serve para o src/lib/carregando.ts saber quanto
   * tempo ele ja ficou na tela.
   */
  __carregandoDesde?: number;
}
