import { Document, model, Schema } from 'mongoose'
import bcrypt from 'bcrypt'
import { config } from 'dotenv'

config()

interface User extends Document {
  email: string
  password: string
  firstName: string
  lastName: string
  dateOfBirth: Date
  createdAt: Date
  lastLogin: Date

  isPasswordValid(candidatePassword: string): Promise<boolean>
}

const userSchema = new Schema<User>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
  },
})

userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next()
    }

    this.password = await bcrypt.hash(this.password, parseInt(process.env.SALT_ROUNDS || '10'))

    return next()
  } catch (error: any) {
    return next(error)
  }
})

userSchema.methods.isPasswordValid = async function (candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.password)
}

const UserModel = model<User>('User', userSchema)

export default UserModel
