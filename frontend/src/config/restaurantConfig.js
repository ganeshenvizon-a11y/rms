export const restaurantConfig = {
  countryCode: 'IN',
  countryName: 'India',

  currencyCode: 'INR',
  currencySymbol: '₹',
  currencyLocale: 'en-IN',

  menuPriceDecimals: 0,
  invoicePriceDecimals: 2,

  timezone: 'Asia/Kolkata',
  dateFormat: 'DD MMM YYYY',
  timeFormat: '12-hour',

  taxStructure: {
    taxName: 'GST',
    totalRate: 5,
    cgstRate: 2.5,
    sgstRate: 2.5,
    pricesIncludeTax: false,
  },

  billingPolicy: {
    serviceChargeEnabled: false,
    voluntaryTipEnabled: true,
    defaultTipPercentage: 0,
    tipOptions: [0, 5, 10],
    packagingChargeEnabled: true,
  },

  invoiceRules: {
    documentTitle: 'Tax Invoice',
    invoicePrefix: 'INV',
    gstin: '36ABCDE1234F1Z5',
    fssaiNumber: '12345678901234',
  },

  payrollDisplay: {
    defaultSalaryPeriod: 'month',
    currencyCode: 'INR',
  },
};
