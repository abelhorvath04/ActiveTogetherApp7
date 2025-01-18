import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { StoreService } from '../../shared/store.service';
import { BackendService } from '../../shared/backend.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-data',
  standalone: true,
  imports: [SharedModule, MatProgressSpinnerModule],
  templateUrl: './data.component.html',
  styleUrl: './data.component.css'
})
export class DataComponent {

  constructor(public storeService: StoreService, private backendService: BackendService) { }

  public page: number = 0;
  public loading: boolean[] = [];

  selectPage(i: any) {
    let currentPage = i;
    this.storeService.currentPage = i;
    this.backendService.getRegistrations(currentPage);
  }

  public returnAllPages() {
    var pagesCount = Math.ceil(this.storeService.registrationTotalCount / 2);
    let res = [];
    for (let i = 0; i < pagesCount; i++) {
      res.push(i + 1);
    }
    return res;
  }

  public convertId(id: string): number {
    return parseInt(id);
  }

  public deleteButton(id: string, i: number) {
    let idNumber = this.convertId(id);
    this.loading[i] = true;
    this.backendService.delete(idNumber).subscribe({
      next: () => {
        this.storeService.registrations.splice(i, 1);
        this.loading[i] = false;
      },
      error: (error) => {
        console.error(error);
        this.loading[i] = false;
      }
    });
  }

  public sortDate(order: 'asc' | 'desc') {
    this.storeService.registrations.sort((a,b) => {
      const dateFirst = new Date(a.date).getTime();
      const dateLast = new Date(b.date).getTime();
      return order === 'asc' ? dateFirst - dateLast : dateLast - dateFirst;
    })
  }
}
