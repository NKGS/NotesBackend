const NotesModel = require("../../model/notes/notes");
const errorResponse = require("../../helper/errorResponse");
const { successFormat } = require("../../helper/formatResponse");

class Notes {
    async getAllNotes(data) {
        return new Promise((resolve, reject) => {
            try {
                const notesData = NotesModel.find({ userId: data }, function (err, result) {
                    console.log('result - ', result)
                    if (err)
                        reject(err)
                    else
                        resolve(result)

                })

            } catch (e) {
                console.log(`errror - ${error}`)
                reject(e)
            }
        })
    }

    async postNote(data) {
        try {
            const notesData = await NotesModel.findOne({ userId: data.userId }, function (err, val) {
                if (err) {
                    console.log(err)
                    console.log('nikitaa')
                }
            })

            if (!notesData) {
                console.log('Notes does not exist add new')
                const Notes = new NotesModel(data)
                await Notes.save(data)
                return
            } else {
                //const data = data.notes;
                let q = data.task._id ? { "userId": data.userId, "taskList._id": data.task._id } : { "userId": data.userId }
                
                if(data.task._id) //means update
                    await NotesModel.updateOne(q, { $set: { "taskList.$": data.task } }, { safe:true })
                else //means insert
                    await NotesModel.updateOne(q, { $push:  {"taskList": data.task } }, { upsert: true, safe: true })
                console.log('Notes updated ',)

                return
            }
        } catch (e) {
            console.log(`errror - ${e}`)
        }
    }

    async deleteNotes(data) {
        try {
            const notesData = await NotesModel.findOne({ userId: data.userId }, function (err, val) {
                if (err) {
                    console.log(err)
                    console.log('nikitaa')
                }
            })

            if (notesData) {
                if(data.type == "all") {
                    let q = { "userId": data.userId }
                    await NotesModel.updateOne(q, { $pop: { "userId": data.userId } }, { safe:true })
                    return 
                } else {
                    let q = { "userId": data.userId }
                    console.log(q)
                    await NotesModel.updateOne(q, { $pull: { "taskList": { _id: data.task._id } } }, { safe:true })
                    console.log("Deleted successfully")
                    return
                }
            }
            return "No such record exists!!"
        } catch(e) {
            console.log('error ',e)
        }
    }
}

const notes = async (req, res) => {
    try {
        const notesCls = new Notes();
        const notes = await notesCls.getAllNotes(req.user.id)
        console.log('notes - ', notes)
        res.status(200).send(successFormat(`success`, `Data fetched successfully`, notes, []))
    } catch (e) {
        console.log(`error - ${e}`)
        const code = (Object.prototype.hasOwnProperty.call(e, 'status') ? e.code : 500)
        const response = errorResponse(e)
        res.status(code).send(response)
    }
}

const saveNotes = async (req, res) => {
    try {
        const notesCls = new Notes();
        const data = req.body
        const notes = notesCls.postNote({
            userId: req.user.id,
            task: data
        })
        console.log('notes - ', notes)
        res.status(200).send(successFormat(`success`, `Data saved successfully`, notes, []))
    } catch (e) {
        console.log(`error - ${e}`)
        const code = (Object.prototype.hasOwnProperty.call(e, 'status') ? e.code : 500)
        const response = errorResponse(e)
        res.status(code).send(response)
    }
}

const deleteNote = async (req, res) => {
    try {
        const notesCls = new Notes();
        const data = req.body
        console.log('data - ', data)
        const notes = notesCls.deleteNotes({
            userId: req.user.id,
            task: data
        })
        console.log('notes - ', notes)
        res.status(200).send(successFormat(`success`, `Data deleted successfully`, notes, []))
    } catch(e) {
        console.log(`error - ${e}`)
        const code = (Object.prototype.hasOwnProperty.call(e, 'status') ? e.code : 500)
        const response = errorResponse(e)
        res.status(code).send(response)
    }
}

module.exports = { notes, saveNotes, deleteNote }