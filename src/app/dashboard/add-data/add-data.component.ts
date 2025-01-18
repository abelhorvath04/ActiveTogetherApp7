import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { Validators, FormBuilder } from '@angular/forms';
import { StoreService } from '../../shared/store.service';
import { BackendService } from '../../shared/backend.service';
import {MatInputModule} from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { provideAnimations } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-add-data',
  standalone: true,
  imports: [
    SharedModule, 
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './add-data.component.html',
  styleUrls: ['./add-data.component.css']
})
export class AddDataComponent implements OnInit {
  constructor(
    private formbuilder: FormBuilder, 
    public storeService: StoreService, 
    private backendService: BackendService,
    private datePipe: DatePipe
  ) {}

  public registrationForm: any;
  public isSubmitted = false;

  ngOnInit(): void {
    this.registrationForm = this.formbuilder.group({
      name: ['', Validators.required],
      birthdate: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      courseId: ['', Validators.required],
      newsletter: [false]
    })

    if (this.registrationForm.get('birthdate')?.value) {
      const formattedDate = this.datePipe.transform(this.registrationForm.get('birthdate')?.value, 'dd-MM-yyyy');
      this.registrationForm.get('birthdate')?.setValue(formattedDate);
    }
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      const birthdate = this.registrationForm.get('birthdate')?.value;
      const formattedDate = this.datePipe.transform(birthdate, 'yyyy-MM-dd');
      this.registrationForm.get('birthdate')?.setValue(formattedDate);
  
      this.backendService.addRegistration(this.registrationForm.value, this.storeService.currentPage);
      this.isSubmitted = true;
      this.registrationForm.reset();
    }
  }
}
