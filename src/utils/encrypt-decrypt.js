import { hash, compare } from "bcrypt";

export class Crypto {
  static async encrypt(data) {
    return hash(data, 7);
  }

  static async decrypt(data, hashedData) {
    return compare(data, hashedData);
  }
}
