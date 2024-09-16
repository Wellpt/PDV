import { ApiProperty } from "@nestjs/swagger";

export class CreateProductDto {
    @ApiProperty({ example: 'Produto 1', description: 'Nome do produto' })
    name: string;

    @ApiProperty({ example: 100.00, description: 'Preço do produto' })
    price: number;

    @ApiProperty({ example: 'Descrição detalhada do produto'})
    description: string;

    @ApiProperty({ example: 10, description: 'Quantidade em estoque' })
    stock: number;
}