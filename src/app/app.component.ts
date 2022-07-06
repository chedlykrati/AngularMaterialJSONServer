import { Component, OnInit , ViewChild } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';
import {MatTableModule} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'AngularMaterialJSONServer';

  displayedColumns: string[] = ['productName', 'category', 'date' , 'freshness' , 'price', 'comment' , 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog , private api: ApiService ){}

  ngOnInit(): void {
    this.getAllProducts();
  }


  openDialog() {
    this.dialog.open(DialogComponent, {
      width: '60%'
      
    }).afterClosed().subscribe(val=>{  //refresh list automatically when add new product
      if(val === 'save'){
        this.getAllProducts();
      }
    });
  }

  getAllProducts(){
    return this.api.getProduct()
    .subscribe({
      next:(res)=>{
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      },
      error:()=>{
        alert('erroe while fetching product !!!')
      }
    })

  }

  editProduct(row: any){
    this.dialog.open(DialogComponent,{
      width: '60%',
      data: row

    }).afterClosed().subscribe(val=>{  //refresh list automatically when update new product
      if(val === 'update'){
        this.getAllProducts();
      }

    }

    );
  }

  deleteProduct(id: number){
    this.api.deleteProduct(id)
    .subscribe({
      next:(res)=>{
        alert('product deleted successfully !');
        this.getAllProducts(); //refresh after deleting product

      },
      error:()=>{
        alert('error while deleting product !');
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}



