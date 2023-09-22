const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const { CloudinaryStorage } = require("multer-storage-cloudinary");

const {
    CLOUD_NAME,
    API_KEY,
    API_SECRET,
} = process.env;

cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
});

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