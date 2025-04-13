import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, merge, Subject } from 'rxjs';
import { connect } from 'ngxtension/connect';
import {
  AddChecklistItem,
  ChecklistItem,
  EditChecklistItem,
  RemoveChecklistItem,
} from '../../shared/interfaces/checklist-item';
import { RemoveChecklist } from '../../shared/interfaces/checklist';
import { StorageService } from '../../shared/data-access/storage.service';

export interface ChecklistItemsState {
  checklistItems: ChecklistItem[];
  loaded: boolean;
  error: null;
}

@Injectable({
  providedIn: 'root',
})
export class ChecklistItemService {
  storageService = inject(StorageService);

  private checklistItemsLoaded$ = this.storageService.loadChecklistItems();

  // state
  private state = signal<ChecklistItemsState>({
    checklistItems: [],
    loaded: false,
    error: null,
  });
  loaded = computed(() => this.state().loaded);

  // selectors
  checklistItems = computed(() => this.state().checklistItems);

  // sources
  add$ = new Subject<AddChecklistItem>();
  toggle$ = new Subject<RemoveChecklistItem>();
  reset$ = new Subject<RemoveChecklist>();
  edit$ = new Subject<EditChecklistItem>();
  remove$ = new Subject<RemoveChecklistItem>();
  private error$ = new Subject<string>();

  checklistRemoved$ = new Subject<RemoveChecklist>();

  constructor() {
    const nextState$ = merge(
      this.checklistItemsLoaded$.pipe(
        map((checklistItems) => ({ checklistItems, loaded: true }))
      )
    );

    connect(this.state)
      .with(nextState$)
      .with(this.add$, (state, checklistItem) => ({
        ...state,
        checklistItems: [
          ...state.checklistItems,
          {
            ...checklistItem.item,
            id: Date.now().toString(),
            checklistId: checklistItem.checklistId,
            checked: false,
          },
        ],
      }))
      .with(this.toggle$, (state, checklistItemId) => ({
        ...state,
        checklistItems: state.checklistItems.map((item) =>
          item.id === checklistItemId
            ? { ...item, checked: !item.checked }
            : item
        ),
      }))
      .with(this.reset$, (state, checklistId) => ({
        ...state,
        checklistItems: state.checklistItems.map((item) =>
          item.checklistId === checklistId ? { ...item, checked: false } : item
        ),
      }))
      .with(this.edit$, (state, update) => ({
        ...state,
        checklistItems: state.checklistItems.map((item) =>
          item.id === update.id ? { ...item, title: update.data.title } : item
        ),
      }))
      .with(this.remove$, (state, id) => ({
        ...state,
        checklistItems: state.checklistItems.filter((item) => item.id !== id),
      }))
      .with(this.checklistRemoved$, (state, checklistId) => ({
        ...state,
        checklistItems: state.checklistItems.filter(
          (item) => item.checklistId !== checklistId
        ),
      }));

    effect(() => {
      if (this.loaded()) {
        this.storageService.saveChecklistItems(this.checklistItems());
      }
    });
  }
}
