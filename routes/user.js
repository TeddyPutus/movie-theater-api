const { Router } = require("express");
const {User, Show} = require('../models/index.js');
const {body, param, validationResult} = require('express-validator');
const checkErrors = require('./middleware');
const userRouter = Router();

//get all users
userRouter.get('/', async (req, res) => {
    try {
        const userList = await User.findAll();
        res.json(userList); //200 - OK sent automatically
    } catch (error) {
        res.status(500).send(error); //internal server error
    }
})

//get one user
userRouter.get('/:user',
    param('user').isNumeric(),
    checkErrors,
    async (req, res) => {
        try {
            const userList = await User.findOne({where: {id: req.params.user}});
            res.json(userList); //200 - OK sent automatically
        } catch (error) {
            res.status(500).send(error); //internal server error
        }
    }
)

//get all shows watched by user
userRouter.get('/:user/shows',
    param('user').isNumeric(),
    checkErrors, 
    async (req, res) => {
        try {
            const user = await User.findOne({where: {id: req.params.user}});
            if(user){
                const showList = await user.getShows();
                res.json(showList); //200 - OK sent automatically
            }else{
                res.sendStatus(404); //Not found
            }      
        } catch (error) {
            res.status(500).send(error); //internal server error
        }
    }
)

//add show to user
userRouter.put('/:user/shows/:show',
    param('user').isNumeric(),
    param('show').isNumeric(),
    checkErrors, 
    async (req, res) => {
        try {
            const user = await User.findOne({where: {id: req.params.user}});
            if(user){
                const show = await Show.findOne({where: {id: req.params.show}});
                user.addShow(show);
                res.sendStatus(200); //OK
            }else{
                res.sendStatus(404); // Not found
            }      
        } catch (error) {
            res.status(500).send(error); //Internal server error
        }
    }
)

/* ----------------------------------------------------------------------------------------------- */
/* -------------------------------------- Additional Routes -------------------------------------- */
/* ----------------------------------------------------------------------------------------------- */

//create user route username is email, password is at least 6 characters
userRouter.post('/',
    body('username').isEmail().notEmpty(),
    body('password').isLength({min: 6}).notEmpty(),
    checkErrors,
    async (req, res) => {
        try {
            const user = User.create({username: req.body.username, password: req.body.password});
            res.json(user); //200 - OK sent automatically
        } catch (error) {
            res.status(500).send(error); //Internal server error
        }
    }
)

module.exports = userRouter;