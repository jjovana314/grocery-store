import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Grocery } from '../../grocery/entities/grocery.entity';

export type UserDocument = User & Document;

export enum UserType {
  MANAGER = 'manager',
  EMPLOYEE = 'employee',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Grocery', required: true })
  grocery: Grocery;

  @Prop({ required: true, enum: UserType })
  type: UserType;
}

export const UserSchema = SchemaFactory.createForClass(User);
