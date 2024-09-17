import { Controller, Post , Body } from '@nestjs/common'
import { UserService } from '../Services/user.service'
import { CreateUserDto } from 'src/Dtos/create-user.dto';

@Controller ('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        const { email, password } = createUserDto
        return this.userService.createUser(createUserDto);
    }
}