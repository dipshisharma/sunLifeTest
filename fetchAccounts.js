import { LightningElement, wire, api, track } from 'lwc';
import fetchDataHelper from '@salesforce/apex/FetchDataHelper.fetchDataHelper';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import PHONE_FIELD from '@salesforce/schema/Account.Phone';
import ID_FIELD from '@salesforce/schema/Account.Id';
import { refreshApex } from '@salesforce/apex';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const COLS = [
    { label: 'Account Name', fieldName: 'Name', editable : 'true', sortable: true },
    { label: 'Phone', fieldName: 'Phone', editable : 'true' },
    { label: 'Owner Id', fieldName: 'OwnerId', editable : 'true', sortable: true },
    { label: 'Website', fieldName: 'Website', type: 'Website', editable : 'true' },
    { label: 'Industry', fieldName: 'Industry', editable : 'true' },
    { label: 'Annual Revenue', fieldName: 'AnnualRevenue', editable : 'true' }
];
export default class getAccountData extends LightningElement {

    // error;
    // @api recordId;
    @track columns = COLS;
    @track draftValues = [];

    @wire(fetchDataHelper)
    accounts;

    handleSave(event) {
        const fields = {}; 
        fields[ID_FIELD.fieldApiName] = event.detail.draftValues[0].Id;
        fields[NAME_FIELD.fieldApiName] = event.detail.draftValues[0].Name;
        fields[PHONE_FIELD.fieldApiName] = event.detail.draftValues[0].Phone;

        console.log('Reached 1');
        const recordInput = {fields};

        console.log('Reached 2'+ JSON.stringify(fields));
        updateRecord(recordInput)
        .then(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Accounts updated',
                    variant: 'success'
                })
            );
            // Display fresh data in the datatable
            return refreshApex(this.accounts).then(() => {

                // Clear all draft values in the datatable
                this.draftValues = [];

            });
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error updating or reloading record',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });
    }
}