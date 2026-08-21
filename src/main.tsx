import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { esconderCarregando } from "./lib/carregando";
import "./index.css";

const raiz = document.getElementById("root");
if (!raiz) throw new Error('Elemento #root nao encontrado no index.html');

createRoot(raiz).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// O loader de abertura esta no index.html e so sai daqui. A funcao espera o
// primeiro quadro pintado, a foto da hero e o tempo minimo antes de remove-lo.
void esconderCarregando();
