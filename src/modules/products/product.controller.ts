import {
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
  Controller,
  UseInterceptors,
  UploadedFile,
  Injectable,
  Query
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObjectID } from 'mongodb';

// HELPERS
import { isFieldUnique } from '../../shared/isFieldUnique.utils';
import { findByField } from '../../shared/findByField.utils';
import { validateImages } from '../../shared/filters.utils';
import { uploadFile } from '../../shared/file-upload.utils';
import { ValidateObjectIdPipe } from '../../shared/pipes';

// ENTITY RELATED
import { CreateProductDto, UpdateProductDto } from './dto';
import { ProductEntity } from './entities/product.entity';
import { ProductService } from './product.service';

@ApiBearerAuth()
@ApiTags('product')
@Controller()
@Injectable()
export class ProductController {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly productService: ProductService
  ) {}

  @Get('product/:id')
  @ApiBody({ description: 'id', required: true })
  async findById(@Param(new ValidateObjectIdPipe('Product')) params): Promise<ProductEntity> {
    return await findByField(this.productRepository, { _id: params.id }, true);
  }

  @Get('products')
  async findAll(): Promise<ProductEntity[]> {
    return await this.productService.findAll();
  }

  @Get('search')
  async search(@Query('keyword') keyword): Promise<ProductEntity[]> {
    return await this.productService.search(keyword);
  }

  @Put('product/:id')
  @ApiBody({ type: UpdateProductDto })
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param(new ValidateObjectIdPipe('Product')) params,
    @Body() productData: UpdateProductDto,
    @UploadedFile() image
  ) {
    // Check if entity exists  throws exception if not exists!
    const toUpdate = await findByField(this.productRepository, { _id: params.id }, true);
    // Check if entity's title is unique throws exception if not !
    await isFieldUnique(this.productRepository, { title: productData.title }, params.id);
    if (image) {
      validateImages(image);
      productData.image = await uploadFile(image);
    }
    const product = await this.productService.update(toUpdate, productData);
    return product;
  }

  @Post('product')
  @UseInterceptors(FileInterceptor('image'))
  @ApiBody({ type: CreateProductDto })
  async create(@Body() productData: CreateProductDto, @UploadedFile() image) {
    await isFieldUnique(this.productRepository, { title: productData.title });
    if (image) {
      validateImages(image);
      productData.image = await uploadFile(image);
    }
    return await this.productService.create(productData);
  }

  @Delete('product/:id')
  async delete(@Param(new ValidateObjectIdPipe('Product')) params): Promise<ProductEntity[]> {
    await this.productService.delete(new ObjectID(params.id));
    return await this.productService.findAll();
  }
}
