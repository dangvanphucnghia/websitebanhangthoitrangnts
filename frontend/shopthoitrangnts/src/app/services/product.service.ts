import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:8080/api/v1/products';
  private categoryUrl = 'http://localhost:8080/api/v1/categories';

  constructor(private http: HttpClient) {}

  getProducts(
    page: number,
    limit: number,
    keyword: string = '',
    categoryId: number = 0
  ): Observable<any> {
    return this.http
      .get(
        `${this.apiUrl}?page=${page}&limit=${limit}&keyword=${keyword}&category_id=${categoryId}`
      )
      .pipe(
        map((response: any) => ({
          products: response.products,
          totalPages: response.totalPages,
        }))
      );
  }

  getCategories(): Observable<any> {
    return this.http.get(`${this.categoryUrl}?page=0&limit=100`);
  }
}
