import { Entity, Column, ObjectIdColumn, Index, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Transform } from 'class-transformer';
import { ObjectID } from 'mongodb';

import { transformEntity } from '../../../shared/transformEntity.utlis';

@Entity('product')
export class ProductEntity {
  @Transform(transformEntity)
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  @Index({ unique: true })
  title: string;

  @Column()
  image: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
  likes: number;

  @Column()
  createdAt: Date;

  @Column()
  lastUpdateAt: Date;

  /**************** ACTIONS ****************/
  @BeforeInsert()
  @BeforeUpdate()
  private beforeActions() {
    this.lastUpdateAt = new Date();
  }

  @BeforeInsert()
  private beforeInsertActions() {
    this.createdAt = new Date();
  }
}
