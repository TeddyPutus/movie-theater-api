const { Router } = require("express");
const {User, Show} = require('../models/index.js');
const {body, param, validationResult} = require('express-validator');
const checkErrors = require('./middleware');
const userRouter = Router();

//get all users
userRouter.get('/', async (req, res) => {
    try {
        const userList = await User.findAll();
        res.json(userList);
    } catch (error) {
        res.status(404).send(error);
    }
})

//get one user
userRouter.get('/:user', async (req, res) => {
    try {
        const userList = await User.findOne({where: {id: req.params.user}});
        res.json(userList);
    } catch (error) {
        res.status(404).send(error);
    }
})

//get all shows watched by user
userRouter.get('/:user/shows', async (req, res) => {
    try {
        const user = await User.findOne({where: {id: req.params.user}});
        if(user){
            const showList = await user.getShows();
            res.json(showList);
        }else{
            res.sendStatus(404);
        }      
    } catch (error) {
        res.status(404).send(error);
    }
})

//add show to user
userRouter.put('/:user/shows/:show', async (req, res) => {
    try {
        const user = await User.findOne({where: {id: req.params.user}});
        if(user){
            const show = await Show.findOne({where: {id: req.params.show}});
            user.addShow(show);
            res.sendStatus(200);
        }else{
            res.sendStatus(404);
        }      
    } catch (error) {
        res.status(404).send(error);
    }
})

module.exports = userRouter;