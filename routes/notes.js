const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');



// load notes model
require('../models/Notes');
const Note = mongoose.model('notes');



// NOTES PAGE
router.get('/', (req, res) => {
    Note.find({})
        .sort({ date: 'desc' })
        .then(notes => {
            res.render('notes/index', {
                notes: notes
            });
            console.log("received_notes", notes)
        })
})

// Add notes form
router.get('/add', (req, res) => {
    res.render('notes/add');
});

// EDIT notes form
router.get('/edit/:id', (req, res) => {
    Note.findOne({
        _id: req.params.id
    })
        .then(note => {
            res.render('notes/edit', {
                note: note
            });
        })
});

// DELETE NOTES
router.delete('/:id',(req, res) => {
    Note.remove({_id: req.params.id})
    .then ( () => {
        req.flash('success_msg','Note removed');
        res.redirect('/notes');
    })
})


// ADD proccec form
router.post('/', (req, res) => {
    console.log(req.body);
    const newUser = {
        title: req.body.title,
        details: req.body.details,
    }
    new Note(newUser).save()
        .then(note => {
            req.flash('success_msg','Note added');
            res.redirect('/notes')
        })
})

// EDIT form proccec
router.put('/:id', (req, res) => {
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