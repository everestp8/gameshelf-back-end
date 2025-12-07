import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { GameModule } from './modules/game/game.module';
import { ReviewModule } from './modules/review/review.module';

@Module({
    imports: [
        UserModule,
        AuthModule,
        GameModule,
        ReviewModule,
        ConfigModule.forRoot({ isGlobal: true })
    ],
})
export class AppModule { }

