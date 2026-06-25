//Quando a pesquisa do usuário for salva em seu histórico
import "./HistoricoPes.css";

const saveSearch = (term) => {
    let historico = JSON.parse(localStorage.getItem("historicoPes")) || [];

    if (!historico.includes(term)){
        historico.unshift(term);
    }
    localStorage.setItem(
        "historicoPes", 
        JSON.stringify(historico)
    );
}

//Quando o usuário apertar "Enter"

const IdentificadorSearch = (e) => {
    if (e.key === "Enter"){
        saveSearch(search);
    }
};


function HistoricoPes({historico}){
    return(
        <div className="historico">
            <h3>Recentes</h3>
            {historico.map((item, index) => (
                <p key={index}>{item}</p>
            ))}
        </div>
    );
}

export default HistoricoPes