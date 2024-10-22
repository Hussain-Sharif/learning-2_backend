import multer from "multer"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // Don't need much error handling here
      cb(null, './public/temp')   // it's a relative path with respect to "root" not relative path with this file
    },
    filename: function (req, file, cb) {
      // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.originalname)  // we record same name where user uploaded  we can use other as well {Read Doc}
    }
  })
  
  const upload = multer({ storage, })