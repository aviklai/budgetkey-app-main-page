import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

export interface Category {
    id: number;
    categoryName: string;
    subCategoryNames: Array<string>;
}

@Component({
  selector: 'budget-panel',
  styles: [`
    budgetpanel-container {
        background-color: #cfc;
        display: block;
    }
    
    .container-fluid {
        padding: 10px;
        max-width: 1024px;
    }
  `],
  template: `     
        <div class="container-fluid">
            <div class="row">  
                <template ngFor let-category let-i="index" [ngForOf]="categories" [ngForTrackBy]="trackById">                                    
                    <div class="col-sm-4">
                        <category [category]="category"></category>  
                    </div>                  
                </template>
            </div>
        </div>    
  `,
})

export class BudgetPanel implements OnInit {
  categories: Array<Category>;
  constructor(private http: Http) { }
  ngOnInit() {
      this.http.get('http://next.obudget.org/search/get/document/budget-functional-aggregates')
      .map(res => res.json())
      .subscribe(responeCategories => {
        this.categories = [];
        var tempCategories = {};
        responeCategories.value.forEach((aggregate: any) => {            
            if (tempCategories[aggregate.func_cls_title_1]){
                tempCategories[aggregate.func_cls_title_1].push(aggregate.func_cls_title_2);
            }else{
                tempCategories[aggregate.func_cls_title_1] = [];
            }
        });
        Object.keys(tempCategories).forEach((key, index) =>{
            this.categories.push({ id: index + 1, categoryName: key, subCategoryNames: tempCategories[key] });
        });
      })      
  }
  trackById(index: number, category: Category) {
    return category.categoryName;
  }
}
