import { Controller, Post , Body, Param, BadRequestException, Get, UseGuards } from '@nestjs/common'
import { UserService } from '../Services/user.service'
import { CreateUserDto } from 'src/Dtos/create-user.dto';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from '@prisma/client';

@Controller ('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    //rota para criar usuario
    @Post('register')
    @ApiOperation({ summary: 'Cria novo usuario'})
    async register(@Body() createUserDto: CreateUserDto) {
        const { } = createUserDto
        return this.userService.createUser(createUserDto);
    }

    // rota para buscar todos os usuarios
    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Busca todos os Usuarios'})
    async findAll(): Promise <User [] > {
        return this.userService.getUsers()
    }

    // rota para buscar usuario pelo username
    @Get('username/:username')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Busca usuarios pelo username'})
    async getUserByUsername(@Param('username') username: string) {
        const user = await this.userService.findByUsername(username);
        if(!user) {
            throw new BadRequestException(`Usuário com username ${username} não encontrado.`); 
        }
        return user;
    }

    // rota para buscar usuario pelo email
    @Get('email/:email')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Busca usuario pelo email'})
    async getUserByEmail(@Param('email')email: string) {
        const user = await this.userService.findByEmail(email);
        if(!user) {
            throw new BadRequestException(`Usuário com E-mail ${email} não encontrado.`)
        }
        return user
    }

}