export interface FieldError {
  field: string;
  error: string;
}

export interface ResponseError {
  status: number;
  message: string;
  errors: FieldError[];
}
