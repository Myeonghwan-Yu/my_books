import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Storage, Bucket } from '@google-cloud/storage';
import {
  IProductImagesServiceDelete,
  IProductImagesServiceUpload,
} from './interfaces/productImages-service.interface';
import { ProductsService } from '../products/products.service';
import { ProductImage } from './entities/productImage.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable()
export class ProductImagesService {
  private readonly storage: Storage;
  private readonly bucket: Bucket;

  constructor(
    @InjectRepository(ProductImage)
    private readonly productImagesRepository: Repository<ProductImage>,
    private readonly productsService: ProductsService, //
  ) {
    this.storage = new Storage({
      projectId: process.env.GCP_PROJECT_ID,
      keyFilename: process.env.GCP_KEY_FILENAME,
    });
    this.bucket = this.storage.bucket(process.env.GCP_BUCKET_NAME);
  }

  async upload({
    productId,
    productImages,
  }: IProductImagesServiceUpload): Promise<string[]> {
    if (productImages.length > 5) {
      throw new BadRequestException('최대 5개의 파일만 업로드할 수 있습니다.');
    }

    const product = await this.productsService.findOne({
      productId,
    });

    if (!product) {
      throw new NotFoundException('해당 상품을 찾을 수 없습니다.');
    }

    const results = await Promise.all(
      productImages.map(
        (el) =>
          new Promise<string>((resolve, reject) => {
            el.createReadStream()
              .pipe(this.bucket.file(el.filename).createWriteStream())
              .on('finish', () => resolve(`${this.bucket.name}/${el.filename}`))
              .on('error', () => reject('파일 업로드 실패'));
          }),
      ),
    );

    for (const imageUrl of results) {
      await this.productImagesRepository.save({
        imageUrl,
        product,
      });
    }

    return results;
  }

  async delete({
    productId,
    productImages,
  }: IProductImagesServiceDelete): Promise<boolean> {
    const product = await this.productsService.findOne({ productId });

    if (!product) {
      throw new NotFoundException('해당 상품을 찾을 수 없습니다.');
    }

    const imagesToDelete = await this.productImagesRepository.find({
      where: {
        product: { id: productId },
        imageUrl: In(productImages),
      },
    });

    if (imagesToDelete.length === 0) {
      throw new NotFoundException('삭제할 이미지가 존재하지 않습니다.');
    }

    await Promise.all(
      imagesToDelete.map(async (image) => {
        await this.bucket.file(image.imageUrl).delete();
      }),
    );

    await this.productImagesRepository.remove(imagesToDelete);

    return true;
  }
}
