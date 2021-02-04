import { User as UserModel } from '../../src/models/User'

declare global {
  namespace Express {
    type User = UserModel
  }
}
