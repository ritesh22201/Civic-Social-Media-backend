const express = require('express');
const postRouter = express.Router();
require('dotenv').config();
const PostModel = require('../Models/postModel');
const auth = require('../Middlewares/authMiddleware');

postRouter.get('/getPosts', async(req, res) => {
    try {
       const posts = await PostModel.find().populate('author', 'userName');
       res.status(200).send(posts);
    } catch (error) {
        res.status(400).send({msg : error.message});
    }
})


postRouter.post('/createPost', auth, async(req, res) => {
    try {
       const post = await PostModel.create({...req.body});
       res.status(200).send({msg : 'Post added successfully', post});
    } catch (error) {
        res.status(400).send({msg : error.message});
    }
})

postRouter.patch('/editPost/:id', auth, async(req, res) => {
    const {id} = req.params;
    const author = req.body.author;
    const user = await PostModel.findOne({_id : id});

    try {
        if(author === user.author.toString()){
            const post = await PostModel.findByIdAndUpdate({_id : id}, req.body, {new : true})
            res.status(200).send({ 'msg': 'Post updated', post });
        }
        else{
            res.status(400).send({ 'msg': 'You are not authorized to update' });
        }
    } catch (error) {
        res.status(400).send({msg : error.message});
    }
})


postRouter.delete('/deletePost/:id', auth, async(req, res) => {
    const {id} = req.params;
    const author = req.body.author;
    const user = await PostModel.findOne({_id : id});
    try {
        if(author === user.author.toString()){
            const post = await PostModel.findByIdAndDelete({_id : id});
            res.status(200).send({ 'msg': 'Post deleted' });
        }
        else{
            res.status(400).send({ 'msg': 'You are not authorized to delete' });
        }
    } catch (error) {
        res.status(400).send({msg : error.message});
    }
})

// For likes

postRouter.post('/:postId/like', auth, async(req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.body.author;

        const post = await PostModel.findById(postId);

        if(!post){
            return res.status(400).send({msg : 'Post not found!'});
        }

        if(post.likes.includes(userId)){
            return res.status(400).send({msg : 'You already liked this post'});
        }

        post.likes.push(userId);
        await post.save();

        res.status(200).send({msg : 'Post liked successfully'});

    } catch (error) {
        res.status(400).send({msg : error.message});
    }
})

module.exports = postRouter;