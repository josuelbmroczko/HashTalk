import BarraPesquisa from "../../componentsPagina.Buscar/BarraPesquisa";
import HistoricoPes from "../../componentsPagina.Buscar/HistoricoPes";
import "./Pesquisa.css";

function Pesquisa(){
    return(
        <div className="pesquisa">
            <h1>Buscar</h1>

            <BarraPesquisa />

            <HistoricoPes />
        </div>
    );
}

export default Pesquisa;