import { Component } from '@angular/core';
import { PowerSyncService } from './powersync.service';
import { Connector } from './powersync-connector.service';
import { PowerSyncDatabase } from '@powersync/web';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(
    private readonly powerSync: PowerSyncService,
  ) {}

  async ngOnInit() {
    alert('Initializing PowerSync...');
    const connector = new Connector(this.powerSync.db as unknown as PowerSyncDatabase);
    this.powerSync.setupPowerSync(connector as any);
  }
}
