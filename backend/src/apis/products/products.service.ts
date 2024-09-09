import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.DEFAULT })
export class ProductsService {
  getHello(): string {
    return 'Hello World!';
  }
}
