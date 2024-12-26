import { ApiProperty } from "@nestjs/swagger";

export class CreateOrderDto {
    @ApiProperty({ 
        example: [
            { productId: 1, quantity: 10 },
            { productId: 2, quantity: 5 }
        ],
        description: 'Array de produtos no pedido'
    })
    products: { productId: number; quantity: number }[];

    @ApiProperty({ example: 'CONCLUIDO', description: 'Status do pedido' })
    status: string;
}