import { Schema, model } from 'mongoose';
import { ProtocolType } from '@domain/enums/protocol-type.enum';
import { EnemyType } from '@domain/enums/enemy-type.enum';

const CoordinatesSchema = new Schema({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
});

const EnemySchema = new Schema({
  type: { type: String, enum: Object.values(EnemyType), required: true },
  number: { type: Number, required: true },
});

const ScanPointSchema = new Schema({
  coordinates: { type: CoordinatesSchema, required: true },
  enemies: { type: [EnemySchema], required: true },
  allies: { type: Number, required: false },
});

const DecisionSchema = new Schema(
  {
    protocols: {
      type: [{ type: String, enum: Object.values(ProtocolType) }],
      required: true,
    },
    scan: {
      type: [ScanPointSchema],
      required: true,
    },
    target: {
      type: CoordinatesSchema,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const DecisionModel = model('Decision', DecisionSchema);
