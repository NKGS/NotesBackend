const NotesModel = require("../../model/notes/notes");
const errorResponse = require("../../helper/errorResponse");
const { successFormat } = require("../../helper/formatResponse");

class Notes {
    async getAllNotes(data) {
        return new Promise((resolve, reject) => {
            try{
                const notesData = NotesModel.find({userId: data}, function(err, result) {
                    console.log('result - ',result)
                    if(err) 
                        reject(err)
                    else
                        resolve(result)  
                    
                })
                
            } catch(e) {
                console.log(`errror - ${error}`)
                reject(e)
            }
        })
    }

    async postNote(data) {
        try {
            const notesData = await NotesModel.findOne({userId: data.userId}, function (err, val) {
                if (err) {
                    console.log(err)
                    console.log('nikitaa')
                }
              })

              console.log('notesData - ',notesData)
              //!_.isEmpty(userData)
              if (!notesData) {
                  const Notes = new NotesModel(data)
                  await Notes.save(data)
                  console.log('Notes does not exist add new')
                  return
              } 
        } catch(e) {
            console.log(`errror - ${e}`)
        }
    }
}

const notes = async(req,res) => {
    try {
        const notesCls = new Notes();
        const notes = await notesCls.getAllNotes(req.user.id)
        console.log('notes - ',notes)
        
        res.status(200).send(successFormat(`success`, `Data fetched successfully`, notes, []))
    } catch(e) {
        console.log(`error - ${e}`)
        const code = (Object.prototype.hasOwnProperty.call(e, 'status') ? e.code : 500)
        const response = errorResponse(e)
        res.status(code).send(response)
    }
}

const saveNotes = async(req,res) => {
    try {
        const notesCls = new Notes();
        const notes = notesCls.postNote({
            userId: req.user.id,
            taskList: [
                {
                task: "One",
                taskEndDate: "22 Oct,2020",
                taskPriority: 1,
                }
            ]
        })
        console.log('notes - ',notes)
        res.status(200).send(successFormat(`success`, `Data saved successfully`, notes, []))
    } catch(e) {
        console.log(`error - ${e}`)
        const code = (Object.prototype.hasOwnProperty.call(e, 'status') ? e.code : 500)
        const response = errorResponse(e)
        res.status(code).send(response)
    }
}

module.exports = {notes, saveNotes}