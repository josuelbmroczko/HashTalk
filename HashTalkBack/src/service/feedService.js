const fs = require ('fs')
const { get } = require('http')
const FEED_FILE='.feed.json'

const getPost = () => {
    try {
        const data = fs.readFileSync(FEED_FILE, 'utf-8');
        return JSON.parse(data || '[]');
    } catch (error) {
        return []; 
    }
}

const savePost =(post)=>{
    fs.writeFileSync(FEED_FILE,JSON.stringify(post,null,2))
}

module.exports={
    getPost,
    savePost
}