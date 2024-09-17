import { Controller, Get, Post, Body, Param, Logger, Patch, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProductService } from 'src/Services/product.service';
import { Product } from '@prisma/client';
import { CreateProductDto } from 'src/Dtos/product.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('product')
@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Cria um novo produto' })

    async createProduct(@Body() data: CreateProductDto): Promise < {message: string, product: Product} > {
        Logger.log(data);
        const product = await this.productService.createProduct(data);
        return {
            message: `Produto criado com sucesso`,
            product,
        }
    }

    @Get()
    @UseGuards(JwtAuthGuard) // Prote
    @ApiOperation({ summary: 'Retorna todos os produtos'})
    async findAll(): Promise < Product[] > {
        return this.productService.getProducts();
    }

    @Get('name/:name')
    @UseGuards(JwtAuthGuard) // Prote
    @ApiOperation({ summary: 'Retorna um produto pelo ID (preciso mudar pra nome)'})
    async getProductByName(@Param('name') name: string): Promise < Product > {
        return this.productService.getProductByName(name);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard) // Prote
    @ApiOperation({ summary: 'Retorna um produto pelo ID (preciso mudar pra nome)'})
    async getProductById(@Param('id') id: string): Promise < Product > {
        const numericId = parseInt(id, 10); // Converte a string 'id' para número
        return this.productService.getProductById(numericId);
    }
    @Patch(':id/stock')
    @UseGuards(JwtAuthGuard) // Prote
    @ApiOperation({ summary: 'Atualiza o estoque de um produto'})
    async updateStock(
        @Param('id') id: string,
        @Body('stock') stock: number
    ): Promise < { message: string; product: Product } > {
        const numericId = parseInt(id, 10); // Converte a string 'id' para número
        const updateProduct = await this.productService.updateProductStock(numericId, stock);

        return {
            message: 'Estoque atualizado com sucesso',
            product: updateProduct
        }
    }
}
