public with sharing class FetchDataHelper {
    
    @AuraEnabled(cacheable=true)
    public static List<Account> fetchDataHelper() {
        return [SELECT Id, Name, OwnerId, Phone, Website, AnnualRevenue, Industry FROM Account where Industry = 'Financial Services' ];
    }
}
