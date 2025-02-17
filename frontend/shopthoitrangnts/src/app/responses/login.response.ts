export interface LoginResponse {
  message: string;
  token: string;
  role?: string; // Thêm trường role
}
