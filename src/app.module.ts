import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './entities/User';
import { CoffeesModule } from './coffees/coffees.module';
import { Coffee } from './entities/Coffee';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'RootRoot4',
      database: 'broffee',
      entities: [User, Coffee],
      synchronize: true,
    }),
    UsersModule,
    CoffeesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
