import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { Document } from 'mongoose'

export type TaskDocument = Task & Document

@Schema({ timestamps: true })
export class Task {
  @Prop({
    type: Boolean,
    default: false,
  })
  isArchived: boolean

  @Prop({
    type: String,
    unique: true,
  })
  taskNumber: string

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  user: mongoose.Types.ObjectId

  @Prop({ required: true })
  title: string

  @Prop()
  description: string

  @Prop({ type: String, required: false, default: null })
  date_ToDO?: string

  @Prop({ type: String, required: false, default: null })
  date_inProgress?: string

  @Prop({ type: String, required: false, default: null })
  date_Done?: string

  @Prop({
    type: String,
    enum: ['к выполнению', 'в работе', 'готово'],
    default: 'к выполнению',
  })
  status: 'к выполнению' | 'в работе' | 'готово'

  @Prop({
    type: String,
    enum: ['поставка', 'заказ', 'другое'],
    default: 'другое',
  })
  type: 'поставка' | 'заказ' | 'другое'

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  })
  associated_order: mongoose.Types.ObjectId


  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Arrival',
  })
  associated_arrival: mongoose.Types.ObjectId

  @Prop({
    type: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        change: { type: String, required: true },
        date: { type: Date, required: true, default: Date.now },
      },
    ],
    default: [],
  })
  logs: {
    user: mongoose.Types.ObjectId
    change: string
    date: Date
  }[]
}

export const TaskSchema = SchemaFactory.createForClass(Task)
