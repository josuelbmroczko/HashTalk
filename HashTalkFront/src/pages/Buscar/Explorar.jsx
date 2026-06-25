import hashtags from '../data/hashtags.json';
import TrendingHashtags from '../components/TrendingHashtags';
import './Explorar.css';

function Explorar(){
    return (
  
        <div>
            <main className='conteudo'>

            <h1>Explorar</h1>
            <input type="text" 
            placeholder='Buscar hashtags'
            value={search}
            onChange={(e) => setSearch(e.target.value)}/>

            <TrendingHashtags 
            key={tag.id}
            nome={tag.nome}
            posts={tag.posts}/>
        </main>
        </div>
    );
}

export default Explorar;