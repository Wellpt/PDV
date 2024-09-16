import { ApiProperty } from "@nestjs/swagger";

export class CreateOrderDto {
    @ApiProperty({ example: 1, description: 'nome do produto' })
    productName: string;

    @ApiProperty({ example: 2, description: 'quantidade do produto' })
    quantity: number;
}