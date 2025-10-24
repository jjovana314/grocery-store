import { Prop, Schema } from "@nestjs/mongoose";
import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Node {
  @Prop({ required: true })
  name: string;

  @Prop({ type: String, enum: ['country', 'region', 'city', 'store'], required: true })
  type: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Node', default: null })
  parent: Node | null;
}
