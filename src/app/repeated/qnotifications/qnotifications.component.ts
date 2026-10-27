import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

@Component({
  selector: 'app-qnotifications',
  templateUrl: './qnotifications.component.html',
  styleUrls: ['./qnotifications.component.scss'],
})
export class QnotificationsComponent implements OnChanges {
  @Input() data: any;
  @Output() value = new EventEmitter<any>();

  readonly if2: string[] = ['Off', 'On'];
  readonly if3: string[] = ['Off', 'From profiles I follow', 'From everyone'];
  Value: string | null = null;

  ngOnChanges(): void {
    this.Value = this.data?.value ?? null;
  }

  check(event: Event, _divId: string, value: string): void {
    const input = event.target as HTMLInputElement | null;
    if (!input?.checked) return;

    this.Value = value;
    this.value.emit(value);
  }
}
