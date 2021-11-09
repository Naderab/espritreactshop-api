import { Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectID } from 'mongodb';
import { DeleteResult, Repository } from 'typeorm';
import { cleaner } from '../../shared/file-cleaner.utils';
import { CreateProductDto, UpdateProductDto } from './dto';
import { ProductEntity } from './entities/product.entity';
import { findByField } from '../../shared/findByField.utils';

@Injectable({ scope: Scope.REQUEST })
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>
  ) {}

  async findAll(): Promise<ProductEntity[]> {
    return await this.productRepository.find();
  }

  async search(keyword): Promise<ProductEntity[]> {
    const reg = new RegExp(keyword, 'i');
    return await this.productRepository.find({
      where: {
        title: reg
      }
    });
  }

  async create(dto: CreateProductDto): Promise<ProductEntity> {
    const newProduct = Object.assign(new ProductEntity(), dto);
    return await this.productRepository.save(newProduct);
  }

  async update(toUpdate: ProductEntity, dto: UpdateProductDto): Promise<ProductEntity> {
    if (dto.image && toUpdate.image !== dto.image) {
      cleaner(toUpdate.image);
    }
    Object.assign(toUpdate, dto);
    return await this.productRepository.save(toUpdate);
  }

  async delete(_id: ObjectID): Promise<DeleteResult> {
    const toDelete = await findByField(this.productRepository, { _id }, true);
    if (toDelete?.image) {
      cleaner(toDelete.image);
    }
    return await this.productRepository.delete({ _id });
  }
}
