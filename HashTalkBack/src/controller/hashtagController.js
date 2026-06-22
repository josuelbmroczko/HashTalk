const geminiService= require('../service/geminiService')

const createHashyags = async(req,res)=>{
    const{texto} = req.body
    try{
        console.log("texto recebido do front"+texto);
        const hashtag= await geminiService.generateHashTags(texto)
        res.json({hashtag})
    }catch(error){
        console.error("erro da api ",error)
        res.status(500).json({error:"erro ao gerar a hastags"})
        
    }
}

module.exports={createHashyags}