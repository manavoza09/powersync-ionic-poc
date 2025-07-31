import { Component } from '@angular/core';
import { LEADS_TABLE_NAME, PowerSyncService } from '../powersync.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page {
  leads: any[] = [];

  constructor(
    private readonly powerSync: PowerSyncService,
  ) {}

  async ngOnInit() {
    await this.fetchLeads();
  }

  async *getLeads(): AsyncIterable<any> {
    for await (const result of this.powerSync.db.watch('SELECT * leads')) {
      yield result.rows?._array || [];
    }
  }

  async fetchLeads() {
    const iterator = this.getLeads();
    for await (const value of iterator) {
      this.leads = value;
    }
  }

  async addSampleLead() {
      try {
        console.log('Adding sample lead...');
        alert('Adding sample lead...');
        const sampleLead = {
        firstName: 'Alice',
        lastName: 'Smith',
        accountManagerId: 1,
        middleName: 'Marie',
        phoneNumber: 1234500001,
        emailAddress: 'alice.smith+1@example.com',
        dateOfBirth: '1988-01-12',
        gender: 'Female',
        civilStatus: 'Married',
        leadStatus: 'New',
        clientType: 'Individual',
        hasConsent: 'true',
      };

      const result = await this.powerSync.db.execute(
        `INSERT INTO
            ${LEADS_TABLE_NAME} (id, leadid, accountmanagerid, firstname, middlename, lastname, 
                  phonenumber, emailaddress, dateofbirth, gender, civilstatus, 
                  leadstatus, clienttype, datecreated, hasconsent, isdeleted, syncstatus)
            VALUES(uuid(), uuid(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime(), ?, 'false', 'pending')
            RETURNING *`,
        [
          sampleLead.accountManagerId,
          sampleLead.firstName,
          sampleLead.middleName,
          sampleLead.lastName,
          sampleLead.phoneNumber,
          sampleLead.emailAddress,
          sampleLead.dateOfBirth,
          sampleLead.gender,
          sampleLead.civilStatus,
          sampleLead.leadStatus,
          sampleLead.clientType,
          sampleLead.hasConsent,
        ]
      );

      console.log('Results:', result);
      alert('Sample lead added successfully! ')
    } catch (error) {
      console.error('Error adding sample lead:', error);
      window.alert('Error adding sample lead: ' + error.message);
    }
  }
}
