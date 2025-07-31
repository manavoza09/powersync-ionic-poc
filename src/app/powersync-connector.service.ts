import { UpdateType, PowerSyncDatabase, CrudEntry, PowerSyncBackendConnector } from '@powersync/web';

// You'll need to define these config values or import from your config
const BACKEND_URL = 'http://192.168.1.19:3000';
const POWERSYNC_URL = 'http://192.168.1.19:3001';

export class Connector implements PowerSyncBackendConnector{
  private db: PowerSyncDatabase;

  constructor(db: PowerSyncDatabase) {
    this.db = db;
  }

  async fetchCredentials() {
    try {
      const response = await fetch(`${BACKEND_URL}/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status !== 201 && response.status !== 200) {
        return null;
      }

      const data = await response.json();
      const token = data.token;

      console.log('Fetched token from backend:', token);

      return {
        endpoint: POWERSYNC_URL,
        token: token,
      };
    } catch (error) {
      console.error('Error fetching credentials:', error);
      return null;
    }
  }

  async uploadData(database: PowerSyncDatabase) {
    console.log('Starting upload data process...');

    try {
      const transaction = await database.getNextCrudTransaction();
      if (!transaction) {
        console.log('No transactions to upload');
        return;
      }

      console.log(`Processing ${transaction.crud.length} operations...`);

      for (const op of transaction.crud) {
        await this._processOperation(op);
      }

      // Complete the transaction
      await transaction.complete();
      console.log('Upload transaction completed successfully');

    } catch (error) {
      console.error('Error during upload:', error);
      // Let PowerSync handle the retry logic
      throw error;
    }
  }

  /**
   * Process individual operations (alternative to bulk upload)
   */
  private async _processOperation(op: CrudEntry): Promise<void> {
    console.log(`Processing operation: ${op.op} on table ${op.table}`);

    try {
      switch (op.op) {
        case UpdateType.PUT:
          await this._createRecord(op);
          break;
        case UpdateType.PATCH:
          await this._updateRecord(op);
          break;
        case UpdateType.DELETE:
          await this._deleteRecord(op);
          break;
      }
    } catch (error) {
      console.error(`Error processing operation ${op.op} on ${op.table}:`, error);
      throw error;
    }
  }

  private async _createRecord(op: CrudEntry): Promise<void> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/${op.table}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table: op.table,
          data: op.opData,
        }),
      });

      if (response.status !== 200 && response.status !== 201) {
        const errorText = await response.text();
        throw new Error(`Failed to create record: ${response.status} ${errorText}`);
      }

      console.log(`Created record in ${op.table}:`, op.opData);
    } catch (error) {
      console.error('HTTP Error creating record:', error);
      throw error;
    }
  }

  private async _updateRecord(op: CrudEntry): Promise<void> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/${op.table}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table: op.table,
          data: op.opData,
        }),
      });

      if (response.status !== 200) {
        const errorText = await response.text();
        throw new Error(`Failed to update record: ${response.status} ${errorText}`);
      }

      console.log(`Updated record in ${op.table}:`, op.opData);
    } catch (error) {
      console.error('HTTP Error updating record:', error);
      throw error;
    }
  }

  private async _deleteRecord(op: CrudEntry): Promise<void> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/${op.table}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table: op.table,
          data: op.opData,
        }),
      });

      if (response.status !== 200 && response.status !== 204) {
        const errorText = await response.text();
        throw new Error(`Failed to delete record: ${response.status} ${errorText}`);
      }

      console.log(`Deleted record from ${op.table}:`, op.opData);
    } catch (error) {
      console.error('HTTP Error deleting record:', error);
      throw error;
    }
  }

  /**
   * Helper method to get authentication token if needed
   */
  private async _getAuthToken(): Promise<string | null> {
    try {
      // Implement your authentication logic here
      // This could be from localStorage, sessionStorage, cookies, etc.
      return null;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }
}