import { BadRequestException, Injectable } from '@nestjs/common';
import { Storage, Bucket } from '@google-cloud/storage';
import { IProductImagesServiceUpload } from './interfaces/productImages-service.interface';

@Injectable()
export class ProductImagesService {
  private readonly storage: Storage;
  private readonly bucket: Bucket;

  constructor() {
    this.storage = new Storage({
      projectId: process.env.GCP_PROJECT_ID,
      keyFilename: process.env.GCP_KEY_FILENAME,
    });
    this.bucket = this.storage.bucket(process.env.GCP_BUCKET_NAME); // 여기에 bucket을 저장
  }

  async upload({
    productImages,
  }: IProductImagesServiceUpload): Promise<string[]> {
    console.log(productImages);

    if (productImages.length > 5) {
      throw new BadRequestException('최대 5개의 파일만 업로드할 수 있습니다.');
    }

    const waitedFiles = await Promise.all(productImages);
    console.log(waitedFiles);

    const results = await Promise.all(
      waitedFiles.map(
        (el) =>
          new Promise<string>((resolve, reject) => {
            el.createReadStream()
              .pipe(this.bucket.file(el.filename).createWriteStream()) // bucket을 사용
              .on('finish', () => resolve(`${this.bucket.name}/${el.filename}`)) // bucket의 name 속성 사용
              .on('error', () => reject('실패'));
          }),
      ),
    );
    return results;
  }

  async delete(fileNames: string[]): Promise<void> {
    const deletePromises = fileNames.map(
      (fileName) => this.bucket.file(fileName).delete(), // bucket을 사용
    );

    try {
      await Promise.all(deletePromises);
      console.log('파일 삭제 성공:', fileNames);
    } catch (error) {
      console.error('파일 삭제 실패:', error);
      throw new BadRequestException('파일 삭제에 실패했습니다.');
    }
  }
}
