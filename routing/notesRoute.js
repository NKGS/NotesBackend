const express = require('express')
const router = express.Router()

const middleware = require('../middleware')
const { notes, saveNotes, deleteNote } = require('../components/notes/notes')

router.get("/", middleware, notes)
router.post("/", middleware, saveNotes)
router.delete("/", middleware, deleteNote)
module.exports = router
