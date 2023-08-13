import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from 'src/app/shared/services/products.service';
import { Product } from 'src/app/shared/type/product.interface';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit {

  allItems: Product[] = [];
  products: Product[] = [];
  items: Product[] = [];

  isMen: boolean = false;
  finished: boolean = false;


  brands: any[] = [];
  colors: any[] = [];

  brandFilters: any[] = [];
  colorFilters: any[] = [];

  constructor(private route: ActivatedRoute, private _productsService: ProductsService) {
    this.route.params.subscribe(params => {
      let category = params['category'];


      if (category === 'men') {
        this.isMen = true;
      } else {
        this.isMen = false;
      }

      this._productsService.getProductByCategory(category).subscribe(res => {
        this.allItems = res;

        this.products = res.slice(0, 8);
        this.items = this.products;

        this.getBrands(res);
        this.getColors(res);
      });

    });
  }

  getBrands(products: Product[]) {
    let uniqueBrands = []; // normal array
    let itemBrands = []; // object of array


    products.map((product: Product) => {
      if (product.tags) {
        product.tags.map((tag) => {
          let index = uniqueBrands.indexOf(tag);
          if (index === -1) {
            uniqueBrands.push(tag);
          }
        });
      }
    });

    for (let i = 0; i < uniqueBrands.length; i++) {
      itemBrands.push({ brand: uniqueBrands[i] });
    }

    this.brands = itemBrands;
  }

  getColors(products: Product[]) {
    let uniqueColors = []; // normal array
    let itemColors = []; // object of array


    products.map((product: Product) => {
      if (product.colors) {
        product.colors.map((color) => {
          let index = uniqueColors.indexOf(color);
          if (index === -1) {
            uniqueColors.push(color);
          }
        });
      }
    });

    for (let i = 0; i < uniqueColors.length; i++) {
      itemColors.push({ color: uniqueColors[i] });
    }

    this.colors = itemColors;
  }

  updateBrandFilter(brands: any) {
    this.brandFilters = brands;
  }

  updateColorFilter(colors: any) {
    this.colorFilters = colors;
  }

  updatePriceFilter(price: any) {
    let filterItems: any[] = [];

    this.products.filter((product: Product) => {
      if (product.price >= price[0] && product.price <= price[1]) {
        filterItems.push(product);
      }
    });

    this.items = filterItems;
  }

  ngOnInit(): void {
  }

  filterItems(): Product[] {
    let itemData = this.items.filter((item: Product) => {

      let Colors: boolean = this.colorFilters.reduce((prev, curr) => {
        if (item.colors) {
          if (item.colors.includes(curr.color)) {
            return true;
          } else {
            return false;
          }
        }
        return true;
      }, true);

      let Brands: boolean = this.brandFilters.reduce((prev, curr) => {
        if (item.tags) {
          if (item.tags.includes(curr)) {
            return true;
          } else {
            return false;
          }
        }
        return true;
      }, true);

      return Colors && Brands;
    });

    return itemData;
  }

}
