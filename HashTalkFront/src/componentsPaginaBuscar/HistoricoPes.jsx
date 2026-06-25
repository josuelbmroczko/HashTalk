import "./HistoricoPes.css";

function HistoricoPes({ historico = [] }) {
  return (
    <div className="historico">
      <h3>Buscas recentes</h3>
      {historico.length > 0 ? (
        <div className="historico-lista">
          {historico.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      ) : (
        <p>Nenhuma busca recente.</p>
      )}
    </div>
  );
}

export default HistoricoPes;
