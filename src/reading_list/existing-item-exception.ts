export class ExistingItemException extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, ExistingItemException.prototype);
    // this.message = message;
    this.name = ExistingItemException.name;
  }

  // message: string;
}
