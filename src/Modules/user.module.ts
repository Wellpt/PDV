import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { UserService } from '../Services/user.service';
import{ UserController } from '../Controllers/user.controller'; 
import { PrismaService } from 'prisma/prisma.service';


@Module({
    imports: [PrismaModule],
    providers: [UserService, PrismaService],
    controllers: [UserController],
    exports: [UserService]
})
export class UserModule {}