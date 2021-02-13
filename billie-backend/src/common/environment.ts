export class Environment {
  static get isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development' || process.argv[2] === 'development';
  }
}
