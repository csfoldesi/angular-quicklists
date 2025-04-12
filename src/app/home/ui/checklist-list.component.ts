import { Component, input } from '@angular/core';
import { Checklist } from '../../shared/interfaces/checklist';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-checklist-list',
  standalone: true,
  imports: [RouterModule],
  template: `
    <ul>
      @for (item of checklists(); track item.id){
      <li>
        <a routerLink="/checklist/{{ item.id }}">{{ item.title }}</a>
      </li>
      }@empty {
      <p>Click the add button to create your first checklist!</p>
      }
    </ul>
  `,
})
export class ChecklistListComponent {
  checklists = input.required<Checklist[]>();
}
