import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchForProudectComponentComponent } from './search-for-proudect-component.component';

describe('SearchForProudectComponentComponent', () => {
  let component: SearchForProudectComponentComponent;
  let fixture: ComponentFixture<SearchForProudectComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchForProudectComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchForProudectComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
