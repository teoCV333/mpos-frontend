import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Product } from '../interfaces/Product';

const apiUrl = environment.API_URI;

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getProducts() {
    return this.http.get(`${apiUrl}/api/product`);
  }

  getProduct(id: any) {
    return this.http.get(`${apiUrl}/api/product/${id}`);
  }

  getProductByName(name: any) {
    return this.http.get(`${apiUrl}/api/product/by-name/${name}`);
  }

  postProduct(body: any) {
    return this.http.post<Product>(`${apiUrl}/api/product`, body);
  }

  putProduct(id: any, body: any) {
    return this.http.put<Product>(`${apiUrl}/api/product/${id}`, body);
  }

  deleteProduct(id: any) {
    return this.http.delete(`${apiUrl}/api/product/${id}`);
  }
}
