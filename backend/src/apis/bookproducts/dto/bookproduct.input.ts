import { InputType, OmitType } from '@nestjs/graphql';
import { BookProduct } from '../entitites/bookproduct.entity';

@InputType()
export class BookProductInput extends OmitType(
  BookProduct,
  ['id'],
  InputType,
) {}
