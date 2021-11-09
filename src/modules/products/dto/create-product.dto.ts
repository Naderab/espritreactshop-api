import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length, IsNumberString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @Length(3, 80)
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly description: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  @IsOptional()
  @IsNumberString()
  readonly price: number;

  @ApiProperty()
  @IsOptional()
  @IsNumberString()
  readonly likes: number;
}
