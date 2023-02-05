import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoryService } from 'src/app/services/category.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  rows: any[] = [];
  dataSource: any;
  displayedColumns: string[] = ['Id', 'Name', 'Actions'];
  category: any;
  name: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  categories: any[] = [];
  eyeId: any;
  role: any;


  //Forms
  public categoryForm: FormGroup = this.fb.group({
    name: [
      "",
      [Validators.required, Validators.minLength(3), Validators.maxLength(30)]
    ]
  })

  public editCategoryForm: FormGroup = this.fb.group({
    name: [
      "",
      [Validators.required, Validators.minLength(3), Validators.maxLength(30)]
    ]
  })

  constructor(
    private categoryService: CategoryService, 
    private fb: FormBuilder,
    private modalService: NgbModal
    ) {
      this.role = localStorage.getItem('role');
    }

  ngOnInit(): void {
    this.getCategories();
  }

  validField(field: any) {
    return this.categoryForm.controls[field].errors &&
      this.categoryForm.controls[field].touched;
  }

  editValidField(field: any) {
    return this.editCategoryForm.controls[field].errors &&
      this.editCategoryForm.controls[field].touched;
  }

  modalOpenForm(modalForm: any) {
    this.modalService.open(modalForm);
  }

  getCategories() {
    this.categoryService.getCategories().subscribe(
      (res: any) => {
        this.dataSource = res.data;
      }
    )
  }

  getOneCategory(id: any) {
    this.categoryService.getCategory(id).subscribe(
      (res: any) => {
        this.category = res.data;
        this.name = res.data.name;
        this.editCategoryForm.patchValue({
          name: res.data.name,
        })
      }
    )
  }

  createCategory() {
    try {
      const body = {
        name: this.categoryForm.value.name,
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
        this.categoryService.postCategory(body).subscribe(
          (res: any) => {
            Swal.fire({
              icon: 'success',
              text: "Producto Creado",
              showConfirmButton: false,
              showCancelButton: false,
              timer: 1000,
            });
            this.getCategories();
            this.categoryForm.reset();
            this.modalService.dismissAll();
          }
        )
      }
    })
    } catch (error) {
      console.log(error);
    }
  }

  updateCategory(id: number) {
    const newCategoryProduct = {
      name: this.editCategoryForm.value.name,
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
        this.categoryService.putCategory(id, newCategoryProduct).subscribe(
          (res: any) => {
            Swal.fire({
              icon: 'success',
              text: "Categoria Editada",
              showConfirmButton: false,
              showCancelButton: false,
              timer: 1000,
            });
            this.getCategories();
            this.editCategoryForm.reset();
            this.modalService.dismissAll();
          }
        )
      }
    })
  }

  deleteCategory(id: any) {
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
        this.categoryService.deleteCategory(id).subscribe(
          (res: any) => {
            Swal.fire({
              text: 'La categoria se eliminó con exito.',
              icon: 'success',
              timer: 1000,
              showConfirmButton: false,
            })
            this.getCategories();
          }
        )
      }
    })
  }
}
