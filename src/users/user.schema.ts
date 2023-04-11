import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  first_name: string;

  @Prop({ required: true })
  last_name: string;

  @Prop()
  avatar: string;

  @Prop({ required: false })
  hash: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
