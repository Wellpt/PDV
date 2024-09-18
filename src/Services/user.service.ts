import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/Dtos/create-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  // Método para criar um novo usuário
  async createUser(createUserDto: CreateUserDto) {
    const { email, password, username } = createUserDto;

    // Verifica se o email ou username já existem no sistema
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw new Error('Usuário com esse email ou username já existe.');
    }

    // Gera o hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o novo usuário
    return this.prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });
  }
  async getUsers() : Promise<User[] > {
    return this.prisma.user.findMany()
  }

  // Método para buscar usuário pelo username
  async findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  // Método para buscar usuário pelo email
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}
