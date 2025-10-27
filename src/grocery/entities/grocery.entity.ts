import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from 'mongoose';

export type GroceryDocument = Grocery & Document;

@Schema({ timestamps: true })
export class Grocery {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: String, enum: ['country', 'region', 'city', 'store'], required: true })
  type: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Grocery', default: null })
  parent: Grocery | null;
}

export const GrocerySchema = SchemaFactory.createForClass(Grocery);