const express = require('express')
const router = express.Router()

const middleware = require('../middleware')
const { notes, saveNotes } = require('../components/notes/notes')

router.get("/", middleware, notes)
router.post("/", middleware, saveNotes)
module.exports = router
