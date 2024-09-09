import { Module } from '@nestjs/common';
import { UsersModule } from './apis/users/users.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './apis/users/entities/user.entity';
import { ProductsModule } from './apis/products/products.module';
import { Product } from './apis/products/entities/product.entity';
import { BookProduct } from './apis/bookproducts/entities/bookProduct.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ProductsModule,
    UsersModule, //
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
    }),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      entities: [User, Product, BookProduct],
      synchronize: true,
      logging: true,
    }),
  ],
})
export class AppModule {}
