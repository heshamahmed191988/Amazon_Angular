import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddressService } from '../../services/address.service';
import { Address } from '../../models/address';
import { AuthService } from '../../services/auth.service';
import { BehaviorSubject } from 'rxjs';
import { AddressSharedService } from '../../services/address-shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {
  addressForm!: FormGroup;
  @Output() addressSubmitted = new EventEmitter<boolean>();
  public isAddressSubmitted: boolean = false;
 
  constructor(private fb: FormBuilder, private addressService: AddressService,
    private _AuthService:AuthService,
    private addressshared:AddressSharedService
    ,private router:Router) {}

  ngOnInit(): void {
    this.setUserid();
    this.addressForm = this.fb.group({
      street: ['', [Validators.required, Validators.maxLength(100)]],
      city: ['', [Validators.required, Validators.maxLength(50)]],
      state: ['', [Validators.required, Validators.maxLength(50)]],
      zipCode: ['', Validators.required,],
      userID: ['', Validators.required],
    });
    

  }

  onSubmit() {
  if (this.addressForm.valid) {
    const address: Address = this.addressForm.value;
    this.addressService.createAddress(address).subscribe({
      next: (res) => {
        console.log('Address created successfully:', res);
        this.addressForm.reset();
        this.addressshared.setAddressSubmitted(true); // Use the shared service to set the submission flag
        this.navigateBack(); // Assuming '/cart' is your route to the cart component
      },
      error: (err) => console.error('Error creating address:', err)
    });
  }}
  setUserid() {
    this._AuthService.getCurrentUserId().subscribe(user => {
      this.addressForm.patchValue({
        userID: user.userId
      });
    });
  }
  navigateBack(): void {
    window.history.back();
  }
  
}

