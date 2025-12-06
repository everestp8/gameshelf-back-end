import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { GameModule } from './modules/game/game.module';

@Module({
    imports: [
        UserModule,
        AuthModule,
        GameModule,
        ConfigModule.forRoot({ isGlobal: true })
    ],
})
export class AppModule { }

