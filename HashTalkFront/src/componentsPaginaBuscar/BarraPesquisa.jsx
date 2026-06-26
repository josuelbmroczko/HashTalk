import { useMemo, useState } from "react";
import hashtags from "../data/hashtags.json";
import HistoricoPes from "./HistoricoPes";
import UsarSugestao from "./UsarSugestao";
import "./BarraPesquisa.css";

function BarraPesquisa() {
  const [search, setSearch] = useState("");
  const [historico, setHistorico] = useState(() => JSON.parse(localStorage.getItem("historicoPes")) || []);

  const sugestoes = useMemo(
    () =>
      hashtags
        .filter((tag) => tag.nome.toLowerCase().startsWith(search.toLowerCase()))
        .slice(0, 5),
    [search],
  );

  const salvarBusca = (term) => {
    const termo = term.trim();
    if (!termo) return;

    const novoHistorico = [termo, ...historico.filter((item) => item !== termo)].slice(0, 5);
    setHistorico(novoHistorico);
    localStorage.setItem("historicoPes", JSON.stringify(novoHistorico));
  };

  const handleKeyDown = (event) => {
    if (event.key === "Tab" && sugestoes.length > 0) {
      event.preventDefault();
      setSearch(sugestoes[0].nome);
    }

    if (event.key === "Enter") {
      salvarBusca(search);
    }
  };

  return (
    <div className="search">
      <label htmlFor="explorar-search">Buscar hashtags</label>
      <input
        id="explorar-search"
        type="text"
        placeholder="Digite uma hashtag"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        onKeyDown={handleKeyDown}
      />
      <UsarSugestao sugestoes={sugestoes} onSelect={(nome) => setSearch(nome)} />
      <HistoricoPes historico={historico} />
    </div>
  );
}

export default BarraPesquisa;
