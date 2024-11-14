import { InputType, OmitType } from '@nestjs/graphql';
import { BookProduct } from '../entities/bookproduct.entity';

@InputType()
export class BookProductInput extends OmitType(
  BookProduct,
  ['id'],
  InputType,
) {}
