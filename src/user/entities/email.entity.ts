export class Email {
  id?: number;
  date: Date;
  title: string;
  body: string;
  category: string;
}

export class ResponseGenerator<T> {
  status: string;
  statusCode: string;
  data: T;
  message: string;
  constructor(status: string, statusCode: string, data: T, message: string) {
    this.status = status;
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
  }
}
