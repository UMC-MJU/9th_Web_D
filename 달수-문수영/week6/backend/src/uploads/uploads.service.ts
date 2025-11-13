import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadsService {
  getImageUrl(filename: string): string {
    return `http://localhost:8000/uploads/${filename}`; // 프론트에서 접근할 URL
  }
}
