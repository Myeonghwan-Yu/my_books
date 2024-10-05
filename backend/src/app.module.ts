import { Module } from '@nestjs/common';
import { UsersModule } from './apis/users/users.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './apis/products/products.module';
import { ReviewsModule } from './apis/reivews/reviews.module';
import { ProductTagsModule } from './apis/productTags/productTags.module';
import { AuthModule } from './apis/auth/auth.module';
import { CartsModule } from './apis/carts/carts.module';
import { OrdersModule } from './apis/orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    CartsModule,
    OrdersModule,
    ProductsModule,
    ProductTagsModule,
    ReviewsModule,
    UsersModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
    }),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true,
    }),
  ],
})
export class AppModule {}
