import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReviewUserDTO } from '../../models/review-user-dto';
import { ReviewService } from '../../services/review.service';
import { AuthService } from '../../services/auth.service';
import { ProductStateService } from '../../services/product-state.service';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [FormsModule, CommonModule,ReactiveFormsModule],
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit, OnChanges, OnDestroy {
  reviews: ReviewUserDTO[] = [];
  reviewForm: FormGroup;
  @Input() productId: number = 0;
  private destroy$ = new Subject<void>();
  

  constructor(
    private reviewService: ReviewService,
    private fb: FormBuilder,
    private authService: AuthService,
    private productStateService: ProductStateService
  ) {
    this.reviewForm = this.fb.group({
      productId: [''], // Initially empty, will be set from input or state service
      userId: [''], // Initially empty, will be dynamically set
      rating: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productId']) {
      this.loadReviews(); // Only call loadReviews if productId changes
    }
    this.productStateService.currentProductId$
    .pipe(
      takeUntil(this.destroy$),
      // Optional: Filter out invalid IDs if necessary
      filter(id => id > 0)
    )
    .subscribe(id => {
      if (id !== this.productId) {
        this.productId = id;
        this.reviewForm.get('productId')?.setValue(this.productId);
        this.loadReviews(); // Reload reviews
      }
    });
  this.setUserId();
  }

  ngOnInit(): void {
    this.productStateService.currentProductId$
      .pipe(
        takeUntil(this.destroy$),
        // Optional: Filter out invalid IDs if necessary
        filter(id => id > 0)
      )
      .subscribe(id => {
        if (id !== this.productId) {
          this.productId = id;
          this.reviewForm.get('productId')?.setValue(this.productId);
          this.loadReviews(); // Reload reviews
        }
      });
    this.setUserId();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setProductId(): void {
    if (this.productId) {
      this.reviewForm.get('productId')?.setValue(this.productId);
      this.loadReviews();
    } else {
      this.productStateService.currentProductId$
        .pipe(takeUntil(this.destroy$))
        .subscribe(id => {
          if (id !== this.productId) {
            this.productId = id;
            this.reviewForm.get('productId')?.setValue(this.productId);
            this.loadReviews(); // Reload reviews whenever the productId changes
          }
        });
    }
  }

  setUserId(): void {
    this.authService.getCurrentUserId().subscribe(userObject => {
      const userId = userObject.userId;
      if (userId) {
        this.reviewForm.get('userId')?.setValue(userId);
      } else {
        console.error('User ID not found in the object:', userObject);
      }
    });
  }

  loadReviews(): void {
   
    if (this.productId) {
      this.reviewService.getReviewsByProductId(this.productId).subscribe({
        next: (reviews) => {
          this.reviews = reviews;
        },
        error: (err) => console.error('Error loading reviews:', err)
      });
    } else {
      console.warn('Product ID is not set. Unable to load reviews.');
    }
  }

  submitReview(): void {
    if (this.reviewForm.valid) {
      this.reviewService.postReview(this.reviewForm.value).subscribe({
        next: () => {
          this.loadReviews(); // Refresh the reviews list
          this.reviewForm.reset({
            productId: this.productId, // Preserve productId after reset
            userId: this.reviewForm.get('userId')?.value // Preserve userId after reset
          });
        },
        error: (err) => console.error('Error submitting review:', err)
      });
    }
  }
   getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
}

}