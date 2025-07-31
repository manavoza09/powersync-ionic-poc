import { Injectable } from '@angular/core';
import {
  AbstractPowerSyncDatabase,
  Column,
  ColumnType,
  Index,
  IndexedColumn,
  PowerSyncBackendConnector,
  PowerSyncDatabase,
  Schema,
  Table,
  WASQLiteOpenFactory,
  WASQLiteVFS
} from '@powersync/web';

export interface LeadRecord {
  leadid: string;
  accountmanagerid: number;
  firstname: string;
  middlename: string;
  lastname: string;
  emailaddress: string;
  phonenumber: number;
  dateofbirth: string;
  gender: string;
  civilstatus: string;
  leadstatus: string;
  clienttype: string;
  homebuildingname: string;
  homeblocknumber: string;
  homestreet: string;
  homesubdivision: string;
  homecountrycode: string;
  homeprovincecode: string;
  homecitycode: string;
  homezipcode: string;
  homestate: string;
  occupationcode: string;
  occupationgrpcode: string;
  monthlyincome: string;
  householdincome: string;
  workbuildingname: string;
  workblocknumber: string;
  workstreet: string;
  worksubdivision: string;
  workcountrycode: string;
  workprovincecode: string;
  workcitycode: string;
  workzipcode: string;
  workstate: string;
  savingspriority: string;
  datecreated: string;
  hasconsent: string;
  isdeleted: string;
  syncstatus: string;
}

export const LEADS_TABLE_NAME = 'leads';

export const AppSchema = new Schema([
  new Table({
    name: LEADS_TABLE_NAME,
    columns: [
      new Column({ name: 'leadid', type: ColumnType.TEXT }),
      new Column({ name: 'accountmanagerid', type: ColumnType.INTEGER }),
      new Column({ name: 'firstname', type: ColumnType.TEXT }),
      new Column({ name: 'middlename', type: ColumnType.TEXT }),
      new Column({ name: 'lastname', type: ColumnType.TEXT }),
      new Column({ name: 'emailaddress', type: ColumnType.TEXT }),
      new Column({ name: 'phonenumber', type: ColumnType.INTEGER }),
      new Column({ name: 'dateofbirth', type: ColumnType.TEXT }),
      new Column({ name: 'gender', type: ColumnType.TEXT }),
      new Column({ name: 'civilstatus', type: ColumnType.TEXT }),
      new Column({ name: 'leadstatus', type: ColumnType.TEXT }),
      new Column({ name: 'clienttype', type: ColumnType.TEXT }),
      new Column({ name: 'homebuildingname', type: ColumnType.TEXT }),
      new Column({ name: 'homeblocknumber', type: ColumnType.TEXT }),
      new Column({ name: 'homestreet', type: ColumnType.TEXT }),
      new Column({ name: 'homesubdivision', type: ColumnType.TEXT }),
      new Column({ name: 'homecountrycode', type: ColumnType.TEXT }),
      new Column({ name: 'homeprovincecode', type: ColumnType.TEXT }),
      new Column({ name: 'homecitycode', type: ColumnType.TEXT }),
      new Column({ name: 'homezipcode', type: ColumnType.TEXT }),
      new Column({ name: 'homestate', type: ColumnType.TEXT }),
      new Column({ name: 'occupationcode', type: ColumnType.TEXT }),
      new Column({ name: 'occupationgrpcode', type: ColumnType.TEXT }),
      new Column({ name: 'monthlyincome', type: ColumnType.TEXT }),
      new Column({ name: 'householdincome', type: ColumnType.TEXT }),
      new Column({ name: 'workbuildingname', type: ColumnType.TEXT }),
      new Column({ name: 'workblocknumber', type: ColumnType.TEXT }),
      new Column({ name: 'workstreet', type: ColumnType.TEXT }),
      new Column({ name: 'worksubdivision', type: ColumnType.TEXT }),
      new Column({ name: 'workcountrycode', type: ColumnType.TEXT }),
      new Column({ name: 'workprovincecode', type: ColumnType.TEXT }),
      new Column({ name: 'workcitycode', type: ColumnType.TEXT }),
      new Column({ name: 'workzipcode', type: ColumnType.TEXT }),
      new Column({ name: 'workstate', type: ColumnType.TEXT }),
      new Column({ name: 'savingspriority', type: ColumnType.TEXT }),
      new Column({ name: 'datecreated', type: ColumnType.TEXT }),
      new Column({ name: 'hasconsent', type: ColumnType.TEXT }),
      new Column({ name: 'isdeleted', type: ColumnType.TEXT }),
      new Column({ name: 'syncstatus', type: ColumnType.TEXT })
    ],
    indexes: [new Index({ name: 'leads', columns: [new IndexedColumn({ name: 'leadid' })] })]
  }),
]);

@Injectable({
  providedIn: 'root'
})
export class PowerSyncService {
  db: AbstractPowerSyncDatabase;

  constructor() {
    const factory = new WASQLiteOpenFactory({
      dbFilename: 'powersync-ionic.db',
      vfs: WASQLiteVFS.OPFSCoopSyncVFS,
      // Specify the path to the worker script
      worker: 'assets/@powersync/worker/WASQLiteDB.umd.js'
    });

    this.db = new PowerSyncDatabase({
      schema: AppSchema,
      database: factory,

      sync: {
        // Specify the path to the worker script
        worker: 'assets/@powersync/worker/SharedSyncImplementation.umd.js'
      }
    });
  }

  setupPowerSync = async (connector: PowerSyncBackendConnector) => {
    try {
      alert('Setting up PowerSync...');
      await this.db.init();
      await this.db.connect(connector);
      alert('PowerSync setup completed successfully!');
    } catch (e) {
      alert('Error setting up PowerSync: ' + e.message);
      console.log(e);
    }
  };
}
