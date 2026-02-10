const multer = require("multer")
const { v4: uuidv4 } = require("uuid")


// Sawirka location la dhigaayo, Magaca Loo bixinaayo, iyo Multer

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images")
    },
    filename: (req, file, cb) => {
        const uniqueName = uuidv4() + "_" + file.originalname
        cb(null, uniqueName)
    },
})

const upload = multer({
    storage: storage
})

module.exports = {
    upload
}