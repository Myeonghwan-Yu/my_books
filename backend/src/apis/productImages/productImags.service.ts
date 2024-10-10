import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { IProductImagesServiceUpload } from './interfaces/productImages-service.interface';

@Injectable()
export class productImagesService {
  async upload({ files }: IProductImagesServiceUpload): Promise<string[]> {
    console.log(files);

    const waitedFiles = await Promise.all(files);
    console.log(waitedFiles);

    const bucket = 'beodeulsori';
    const storage = new Storage({
      projectId: 'backend-431315',
      keyFilename: 'gcp-file-storage.json',
    }).bucket(bucket);

    const results = await Promise.all(
      waitedFiles.map(
        (el) =>
          new Promise<string>((resolve, reject) => {
            el.createReadStream()
              .pipe(storage.file(el.filename).createWriteStream())
              .on('finish', () => resolve(`${bucket}/${el.filename}`))
              .on('error', () => reject('실패'));
          }),
      ),
    );

    return results;
  }
}
