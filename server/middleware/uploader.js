const multer = require("multer");


const { CloudinaryStorage } = require("multer-storage-cloudinary");



const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "userphoto",
        format: async () => "png",
        public_id: (req, file) => file.filename,
    },
});

const upload = multer({ storage: storage });


module.exports = upload;