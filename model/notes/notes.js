const mongoose = require('mongoose')

const notes = new mongoose.Schema({
    userId: String,
    taskList: [
        {
        task: String,
        taskEndDate: Date,
        taskPriority: Number,
        }
    ]
})

notes.index({'$**': 'text'})

module.exports = mongoose.model('notes', notes)