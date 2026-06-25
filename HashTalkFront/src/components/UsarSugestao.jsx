import hashtags from '../data/hashtags.json';
import './UsarSugestao.css';

function UsarSugestao({sugestoes}){
    const sugestoes = hashtags.filter((tag) => tag.nome.toLowerCase().includes(Search.toLowerCase())) 
    
    if (sugestoes.lenght === 0) {
        return null;
    }

    return(
        <div className="sugestoes">
            {sugestoes.map((item) => (
                <div key={item.id}>
                    {item.nome}
                    </div>
            ))}
        </div>
    );
}

export default UsarSugestao;
