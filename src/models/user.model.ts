
import mongoose, {
  Schema,
  type InferSchemaType,
  type Model,
} from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name must not exceed 100 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      unique: true,
    },

    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [18, "User must be at least 18 years old"],
      max: [120, "Please provide a valid age"],
      validate: {
        validator: Number.isInteger,
        message: "Age must be an integer",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export type User = InferSchemaType<typeof userSchema>;

const existingUserModel = mongoose.models.User as
  | Model<User>
  | undefined;

export const UserModel =
  existingUserModel ??
  mongoose.model<User>("User", userSchema);
