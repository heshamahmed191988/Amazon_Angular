import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchForProudectComponent } from './search-for-proudect.component';

describe('SearchForProudectComponent', () => {
  let component: SearchForProudectComponent;
  let fixture: ComponentFixture<SearchForProudectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchForProudectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchForProudectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
