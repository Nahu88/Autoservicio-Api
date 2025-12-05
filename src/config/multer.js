import multer from 'multer';

const allowedExtensions = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/webp'];

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (allowedExtensions.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no soportado. Solo se permiten imagenes (png, jpg, jpeg, gif)'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  }
})
