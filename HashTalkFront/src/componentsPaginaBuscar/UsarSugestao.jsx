import "./UsarSugestao.css";

function UsarSugestao({ sugestoes = [], onSelect }) {
  if (sugestoes.length === 0) {
    return null;
  }

  return (
    <div className="sugestoes">
      {sugestoes.map((item) => (
        <button type="button" key={item.id || item.nome} onClick={() => onSelect(item.nome)}>
          {item.nome}
        </button>
      ))}
    </div>
  );
}

export default UsarSugestao;
