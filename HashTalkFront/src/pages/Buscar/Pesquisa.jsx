import BarraPesquisa from "../../components/BarraPesquisa";
import HistoricoPes from "../../components/HistoricoPes";
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