import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Product } from 'src/app/interfaces/Product';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  
  rows: any[] = [];
  dataSource: any;
  displayedColumns: string[] = ['Id', 'Name', 'Cost', 'Actions'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  role: any;
  products: any[] = [];
  categories: any[] = [];
  product: any;
  eyeId: any;
  idCategory: any;
  //Forms
  public productForm: FormGroup = this.fb.group({
    name: [
      "",
      [Validators.required, Validators.minLength(3), Validators.maxLength(30)]
    ],
    cost: [
      "",
      [Validators.required, Validators.minLength(3), Validators.maxLength(30)]
    ],
    categoryId: [
      "",
      [Validators.required]
    ],
  })

  public editProductForm: FormGroup = this.fb.group({
    name: [
      "",
      [Validators.required, Validators.minLength(3), Validators.maxLength(30)]
    ],
    cost: [
      "",
      [Validators.required, Validators.minLength(3), Validators.maxLength(30)]
    ],
    categoryId: [
      "",
      [Validators.required]
    ],
  })

  constructor(
    private productService: ProductService,
    private router: Router,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private categoryService: CategoryService
    ) {
      this.role = localStorage.getItem('role');
    }
  ngOnInit(): void {
    this.getCategories();
    this.getProducts();
  }

  validField(field: any) {
    return this.productForm.controls[field].errors &&
      this.productForm.controls[field].touched;
  }

  editValidField(field: any) {
    return this.editProductForm.controls[field].errors &&
      this.editProductForm.controls[field].touched;
  }

  selectedChange(event: any) {
    this.idCategory = event.target.value;
  }

  modalOpenForm(modalForm: any) {
    this.modalService.open(modalForm);
  }

  getProducts() {
    this.productService.getProducts().subscribe(
      (res: any) => {
        console.log(res.data);
        this.dataSource = res.data;
      }
    )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
  getOneProduct(id: any) {
    this.productService.getProduct(id).subscribe(
      (res: any) => {
        this.product = res.data;
        console.log(this.product);
        this.editProductForm.patchValue({
          name: this.product.name,
          cost: this.product.cost,
          categoryId: this.product.category.id
        })
      }
    )
  }

  getCategories() {
    this.categoryService.getCategories().subscribe(
      (res: any) => {
        this.categories = res.data;
      }
    )
  }

  createProduct() {
    try {
      let body: any;
      body = {
        name: this.productForm.value.name,
        cost: this.productForm.value.cost,
        categoryId: this.idCategory,
      };
    
    Swal.fire({
      icon: 'warning',
      text: "Confirmar Acción.",
      showConfirmButton: true,
      confirmButtonText: 'Confirmar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar', 
    }).then((result) => {
      if(result.isConfirmed) {
        this.productService.postProduct(body).subscribe(
          (res: any) => {
            Swal.fire({
              icon: 'success',
              text: "Producto Creado",
              showConfirmButton: false,
              showCancelButton: false,
              timer: 1000,
            });
            this.getProducts();
            this.productForm.reset();
            this.modalService.dismissAll();
          }
        )
      }
    })
    } catch (error) {
      console.log(error);
    }
  }

  updateProduct(id: any) {
    const newProduct = {
      name: this.editProductForm.value.name,
      cost: this.editProductForm.value.cost,
      categoryId: this.product.category.id,
    };
    Swal.fire({
      icon: 'warning',
      text: "Esta seguro?.",
      showConfirmButton: true,
      confirmButtonText: 'Confirmar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if(result.isConfirmed) {
        this.productService.putProduct(id, newProduct).subscribe(
          (res: any) => {
            Swal.fire({
              icon: 'success',
              text: "Producto Editado",
              showConfirmButton: false,
              showCancelButton: false,
              timer: 1000,
            });
            this.getProducts();
            this.editProductForm.reset();
            this.modalService.dismissAll();
          }
        )
      }
    })
  }

  deleteProduct(id: any) {
    Swal.fire({
      text: 'Esta seguro de esto?',
      icon: 'warning',
      confirmButtonText: 'Si, eliminar',
      confirmButtonColor: "green",
      showCancelButton: true,
      cancelButtonColor: "red",
      cancelButtonText: 'Cancelar'
    }).then((result: any) => {
      if(result.isConfirmed) {
        this.productService.deleteProduct(id).subscribe(
          (res: any) => {
            Swal.fire({
              text: 'El producto se eliminó con exito.',
              icon: 'success',
              timer: 1000,
              showConfirmButton: false,
            })
            this.getProducts();
          }
        )
      }
    })
  }

}
