import multer from 'multer'

// Multer configuration
const storage = multer.memoryStorage()

// Multer upload
const upload = multer({ storage : storage })

export default upload