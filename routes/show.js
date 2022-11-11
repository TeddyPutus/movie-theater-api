const { Router } = require("express");
const {body, param, validationResult} = require('express-validator');
const {User, Show} = require('../models/index.js');
const checkErrors = require('./middleware');
const showRouter = Router();

//get all shows
showRouter.get('/', async (req, res) => {
    try {
        const showList = await Show.findAll();
        res.json(showList);
    } catch (error) {
        res.status(404).send(error);
    }
})

//get one show
showRouter.get('/:show', 
    param('show').isNumeric(),
    checkErrors,
    async (req, res) => {
        try {
            const show = await Show.findOne({where: {id: req.params.show}});
            if(show){
                res.status(200).json(show);
            }else{
                res.sendStatus(400);
            }       
        } catch (error) {
            res.status(404).send(error);
        }
    }
)

//get all shows of a given genre
showRouter.get('/genre/:genre', 
    param('genre').isAlpha().isLength({max:25, min:3}),
    checkErrors,
    async (req, res) => {
        try {
            const showList = await Show.findAll({where: {genre: req.params.genre}});
            res.json(showList);
        } catch (error) {
            res.status(404).send(error);
        }
    }
)

//get one show and update the rating
showRouter.put('/:show/rating',
    body('rating').isNumeric().notEmpty(),
    param('show').isNumeric(),
    checkErrors,
    async (req, res) => {
        try {
            const show = await Show.findOne({where: {id: req.params.show}});
            if(show){
                if(req.body.rating) await show.update({rating : req.body.rating})
                res.status(200).json(show);
            }else{
                res.sendStatus(404);
            }        
        } catch (error) {
            res.status(404).send(error);
        }
    }
)

//get one show and update status
showRouter.put('/:show/update', 
    body('status').isLength({max:25, min:5}).notEmpty(),
    param('show').isNumeric(),
    checkErrors,
    async (req, res) => {
        try {
            const show = await Show.findOne({where: {id: req.params.show}});
            if(show){
                if(req.body.status) await show.update({status : req.body.status})
                res.status(200).json(show);
            }else{
                res.sendStatus(404);
            }        
        } catch (error) {
            res.status(404).send(error);
        }
    }
)

//delete one show
showRouter.delete('/:show', 
    param('show').isNumeric(),
    checkErrors,
    async (req, res) => {
    try {
        const show = await Show.destroy({where: {id: req.params.show}});
        res.status(200).json(show);
    } catch (error) {
        res.status(404).send(error);
    }
})

module.exports = showRouter;