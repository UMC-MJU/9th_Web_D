import { diskStorage } from 'multer';
import { extname } from 'path';

export const storage = diskStorage({
  destination: './uploads/images', // 파일 저장 위치
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = extname(file.originalname);
    callback(null, `${uniqueSuffix}${extension}`);
  },
});
