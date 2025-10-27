import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from 'mongoose';

export type GroceryDocument = mongoose.HydratedDocument<Grocery> & { _id: mongoose.Types.ObjectId };

@Schema({ timestamps: true })
export class Grocery {
  @Prop()
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: String, enum: ['country', 'region', 'city', 'store'], required: true })
  type: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Grocery', default: null })
  parent: Grocery | null;
}

export const GrocerySchema = SchemaFactory.createForClass(Grocery);

GrocerySchema.pre<GroceryDocument>('save', function (next) {
  if (this._id && !this.id) {
    this.id = this._id.toString();
  }
  next();
});