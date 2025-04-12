import {
  Component,
  contentChild,
  effect,
  inject,
  input,
  TemplateRef,
} from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';

@Component({
  selector: 'app-modal',
  standalone: true,
  template: `<div></div> `,
})
export class ModalComponent {
  dialog = inject(Dialog);
  isOpen = input.required<boolean>();
  template = contentChild.required(TemplateRef);

  constructor() {
    effect(() => {
      const isOpen = this.isOpen();

      if (isOpen) {
        this.dialog.open(this.template(), {
          panelClass: 'dialog-container',
          hasBackdrop: false,
        });
      } else {
        this.dialog.closeAll();
      }
    });
  }
}
