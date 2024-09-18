import { ApiProperty } from "@nestjs/swagger";

export class CreateOrderDto {
    @ApiProperty({ example: 1, description: 'ID do produto' })
    productId: number;

    @ApiProperty({ example: 2, description: 'quantidade do produto' })
    quantity: number;
}