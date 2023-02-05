import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Category } from '../interfaces/Category';

const apiUrl = environment.API_URI;


@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  getCategories() {
    return this.http.get(`${apiUrl}/api/category`);
  }

  getCategory(id: any) {
    return this.http.get(`${apiUrl}/api/category/${id}`);
  }

  getCategoryByName(name: any) {
    return this.http.get(`${apiUrl}/api/category/by-name/${name}`);
  }

  postCategory(body: any) {
    return this.http.post<Category>(`${apiUrl}/api/category`, body);
  }

  putCategory(id: any, body: any) {
    return this.http.put<Category>(`${apiUrl}/api/category/${id}`, body);
  }

  deleteCategory(id: any) {
    console.log(id);
    return this.http.delete(`${apiUrl}/api/category/${id}`);
  }
}
