import { Schema } from 'mongoose';

export const text = { type: String, required: true };
export const date = { type: Date, required: true };
export const locale = { type: String, enum: ['ar', 'en'], required: true };
export const reference = (ref, required = true) => ({ type: String, ref, required });
export const positiveInteger = {
  type: Number,
  required: true,
  min: 1,
  validate: Number.isInteger,
};

export function defineSchema(collection, fields, { generatedId = false } = {}) {
  const schema = new Schema(generatedId ? fields : { _id: text, ...fields }, {
    collection,
    strict: 'throw',
    strictQuery: 'throw',
    versionKey: false,
    timestamps: false,
    minimize: false,
    autoCreate: false,
    autoIndex: false,
    bufferCommands: false,
  });
  // Query updates do not run Mongoose validators unless explicitly enabled.
  for (const operation of ['updateOne', 'updateMany', 'findOneAndUpdate']) {
    schema.pre(operation, function () {
      this.setOptions({ runValidators: true });
    });
  }
  return schema;
}
