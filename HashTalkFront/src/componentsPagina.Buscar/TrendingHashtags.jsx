import "./TrendingHastags.css";

function TrendingHashtags({ nome, posts }){
    return(
        <div className="Hashtag-card">
            <h3>{nome}</h3>
            <p>{posts}</p>
        </div>
    );
}

export default TrendingHashtags;