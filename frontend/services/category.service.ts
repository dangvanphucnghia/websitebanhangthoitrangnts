import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../responses/category.reponse';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private baseUrl = 'http://localhost:8080/api/v1/categories';

  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}?page=0&limit=100`);
  }

  createCategory(category: any): Observable<any> {
    return this.http.post(this.baseUrl, category);
  }

  updateCategory(id: number, category: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, category);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
