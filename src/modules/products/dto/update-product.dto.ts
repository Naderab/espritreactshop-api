import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length, IsNumber, IsNumberString } from 'class-validator';
import { ObjectID } from 'mongodb';

export class UpdateProductDto {
  @ApiProperty()
  _id?: ObjectID;

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
