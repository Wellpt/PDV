import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { UserService } from '../Services/user.service';
import{ UserController } from '../Controllers/user.controller'; 


@Module({
    imports: [PrismaModule],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService]
})
export class UserModule {}