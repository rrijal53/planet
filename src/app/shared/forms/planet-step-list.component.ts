import {
  Component,
  Input,
  EventEmitter,
  Output,
  Directive,
  ContentChildren,
  ViewChild,
  TemplateRef,
  Injectable,
  OnDestroy,
  AfterContentChecked,
  ViewEncapsulation,
  HostBinding
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormArray } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class PlanetStepListService {

  stepMoveClick$ = new Subject<any>();
  stepAdded$ = new Subject<number>();

  constructor() {}

  moveStep(index, direction) {
    this.stepMoveClick$.next({ index, direction });
  }

  addStep(index: number) {
    this.stepAdded$.next(index);
  }

}

@Component({
  selector: 'planet-step-list-item',
  template: `
    <ng-template>
      <ng-content></ng-content>
      <button mat-icon-button type="button" *ngIf="!isFirst" (click)="moveStep($event,-1)"><mat-icon>arrow_upward</mat-icon></button>
      <button mat-icon-button type="button" *ngIf="!isLast" (click)="moveStep($event,1)"><mat-icon>arrow_downward</mat-icon></button>
      <button mat-icon-button type="button" (click)="moveStep($event,i)"><mat-icon>delete</mat-icon></button>
    </ng-template>
  `
})
export class PlanetStepListItemComponent {
  @ViewChild(TemplateRef) template: TemplateRef<any>;
  index: number;
  isFirst: boolean;
  isLast: boolean;

  constructor(private planetStepListService: PlanetStepListService) {}

  moveStep(event, direction = 0) {
    event.stopPropagation();
    this.planetStepListService.moveStep(this.index, direction);
  }

}

@Component({
  selector: 'planet-step-list',
  templateUrl: './planet-step-list.component.html',
  styleUrls: [ './planet-step-list.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class PlanetStepListComponent implements AfterContentChecked, OnDestroy {

  @Input() steps: any[] | FormArray;
  @Input() nameProp: string;
  @Input() defaultName = 'Step';
  @Output() stepClicked = new EventEmitter<number>();

  @ContentChildren(PlanetStepListItemComponent) stepListItems;

  listMode = true;
  openIndex = -1;
  private onDestroy$ = new Subject<void>();

  constructor(private planetStepListService: PlanetStepListService) {
    this.planetStepListService.stepMoveClick$.pipe(takeUntil(this.onDestroy$)).subscribe(this.moveStep.bind(this));
    this.planetStepListService.stepAdded$.pipe(takeUntil(this.onDestroy$)).subscribe(this.stepClick.bind(this));
  }

  ngAfterContentChecked() {
    this.stepListItems.forEach((item, index, array) => {
      item.index = index;
      item.isFirst = index === 0;
      item.isLast = index === (array.length - 1);
    });
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  stepClick(index: number) {
    this.listMode = false;
    this.openIndex = index;
    this.stepClicked.emit(index);
  }

  toList() {
    this.listMode = true;
  }

  moveStep({ index, direction }) {
    if (this.steps instanceof Array) {
      this.moveArrayStep(index, direction, this.steps);
    } else if (this.steps instanceof FormArray) {
      this.moveFormArrayStep(index, direction, this.steps);
    }
  }

  moveArrayStep(index, direction, steps: any[]) {
    const step = steps.splice(index, 1)[0];
    if (direction !== 0) {
      steps.splice(index + direction, 0, step);
    }
  }

  moveFormArrayStep(index, direction, steps: FormArray) {
    const step = steps.at(index);
    steps.removeAt(index);
    if (direction !== 0) {
      steps.insert(index + direction, step);
    }
  }

  changeStep(direction) {
    this.stepClick(this.openIndex + direction);
  }

}

@Directive({
  selector: '[planetStepListForm]'
})
export class PlanetStepListFormDirective {
  @HostBinding('class') class = 'planet-step-list-form';
}

@Directive({
  selector: '[planetStepListNumber]'
})
export class PlanetStepListNumberDirective {}

@Directive({
  selector: '[planetStepListActions]'
})
export class PlanetStepListActionsDirective {
  @HostBinding('class') class = 'planet-step-list-actions';
}
