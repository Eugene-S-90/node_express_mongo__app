const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');



// load notes model
require('../models/Notes');
const Note = mongoose.model('notes');



// NOTES PAGE
router.get('/', (req, res) => {
    Note.find({user:req.user.id})
        .sort({ date: 'desc' })
        .then(notes => {
            res.render('notes/index', {
                notes: notes
            });
            console.log("received_notes", notes)
        })
})

// Add notes form
router.get('/add', ensureAuthenticated,(req, res) => {
    res.render('notes/add');
});

// EDIT notes form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Note.findOne({
        _id: req.params.id
    })
        .then(note => {
            if(note.user!=req.user.id){
                req.flash('error_msg','Not authorized')
                res.redirect('/notes');
            }
            else{
                res.render('notes/edit', {
                    note: note
                });
            }
        })
});

// DELETE NOTES
router.delete('/:id', ensureAuthenticated,(req, res) => {
    Note.remove({_id: req.params.id})
    .then ( () => {
        req.flash('success_msg','Note removed');
        res.redirect('/notes');
    })
})


// ADD proccec form
router.post('/', ensureAuthenticated, (req, res) => {
    console.log(req.body);
    const newUser = {
        title: req.body.title,
        details: req.body.details,
        user: req.user.id
    }
    new Note(newUser).save()
        .then(note => {
            req.flash('success_msg','Note added');
            res.redirect('/notes')
        })
})

// EDIT form proccec
router.put('/:id', ensureAuthenticated, (req, res) => {
    Note.findOne({
        _id:req.params.id
    })
    .then(note=>{
        // new values
        note.title = req.body.title;
        note.details = req.body.details;
        note.save()
        .then(note=>{
            req.flash('success_msg','Note was edited');
            res.redirect('/notes');
        })
    })
});



module.exports = router;