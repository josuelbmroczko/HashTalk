// A barra de pesquisa do App

import { useState } from 'react';
import hashtags from "../data/hashtags.json";
import UsarSugestao from './UsarSugestao';
import "./BarraPesquisa.css";

function barraPesquisa(){
    const [Search, setSearch]= useState("");
    const sugestoes = hashtags.filter((tag) => tag.nome.toLowerCase().startsWith(Search.toLowerCase()));
    const completarComTab = (e) => {
        if (e.key === "Tab" && sugestoes.length > 0 ){
            e.preventDefault();

            setSearch(sugestoes[0].nome);
        }
    }

    return(
        <div className="search">
        <input type="text" 
        placeholder='Buscar hashtags'
        value={Search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={completarComTab} />
        <UsarSugestao sugestoes={sugestoes} />  
        </div>
    );
}

export default BarraPesquisa;