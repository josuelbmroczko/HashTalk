const feedService = require('../service/feedService')
const geminiService = require('../service/geminiService');

const getAllPosts= (req,res)=>{
    const posts = feedService.getPost()
    res.json(posts)
}

const createPost= async (req,res)=>{
    const{username,content} = req.body
    const posts = feedService.getPost()

    const hashtags = await geminiService.generateHashTags(content)

    const novoPost={
        id:Date.now(),
        username,
        content,
        hashtags,
        timestamp:new Date().toISOString()
    }
    posts.push(novoPost)
    feedService.savePost(posts)
    res.status(201).json(novoPost)
}

module.exports={getAllPosts,createPost}