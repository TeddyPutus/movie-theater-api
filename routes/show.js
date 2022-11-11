const { Router } = require("express");
const {body, param, validationResult} = require('express-validator');
const {User, Show} = require('../models/index.js');
const checkErrors = require('./middleware');
const showRouter = Router();

//get all shows
showRouter.get('/', async (req, res) => {
    try {
        const showList = await Show.findAll();
        res.json(showList); //200 - OK sent automatically
    } catch (error) {
        res.status(500).send(error); //Internal server error
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
                res.json(show); //200 - OK sent automatically
            }else{
                res.sendStatus(404); //Not found
            }       
        } catch (error) {
            res.status(500).send(error); //Internal server error
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
            res.json(showList); //200 - OK sent automatically
        } catch (error) {
            res.status(500).send(error);  //Internal server error
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
                res.json(show); //200 - OK sent automatically
            }else{
                res.sendStatus(404); //Not found
            }        
        } catch (error) {
            res.status(500).send(error); //Internal server error
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
                res.json(show); //200 - OK sent automatically
            }else{
                res.sendStatus(404); //Not found
            }        
        } catch (error) {
            res.status(500).send(error); //Internal server error
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
            if(show) res.json(show); //200 - OK sent automatically
            else res.status(404).json(show); //Return 0, and status 404 - not found
        } catch (error) {
            res.status(500).send(error); //Internal server error
        }
    }
)

/* ----------------------------------------------------------------------------------------------- */
/* -------------------------------------- Additional Routes -------------------------------------- */
/* ----------------------------------------------------------------------------------------------- */

//create show title, genre, rating, status
showRouter.post('/',
    body('title').isLength({max:25}).notEmpty(),
    body('status').isLength({max:25, min:5}).notEmpty(),
    body('genre').isAlpha().isLength({max:25, min:3}).notEmpty(),
    body('rating').isNumeric().notEmpty(),
    checkErrors,
    async (req, res) => {
        try {
            const show = Show.create({title: req.body.title, status: req.body.status, genre: req.body.genre, rating: req.body.rating});
            res.json(show); //200 - OK sent automatically
        } catch (error) {
            res.status(500).send(error); //Internal server error
        }
    }
)

module.exports = showRouter;