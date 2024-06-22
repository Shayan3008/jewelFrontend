const sideBarContent = [{
    name: "setup",
    url: null,
    child: [{
        name: "category",
        url: "/category",
        child: null
    }, {
        name: "Inventory",
        url: "/viewinventory",
        child: null
    }, {
        name: "Karigar",
        url: "/karigar",
        child: null,
    }, {
        name: "CashBook",
        url: "/cashbook",
        child: null
    }, {
        name: "Currency Setup",
        url: "/currencysetup",
        child: null
    }, {
        name: "Vendors",
        url: "/viewvendor",
        child: null
    }, {
        name: "Vendor Header",
        url: "/vendorheader",
        child: null
    }
    ]
}, {
    name: "Sale",
    url: null,
    child: [{
        name: "Invoice",
        url: "/invoice",
        child: null
    }, {
        name: "Currency",
        url: "/currency",
        child: null
    },],

},
{
    name: "Purchase",
    url: null,
    child: [{
        name: "Purchase Voucher",
        url: "/purchasevoucher",
        child: null
    }, {
        name: "Journal Voucher",
        url: "/journalvoucher",
        child: null
    }
    ]
},
{
    name: "Report",
    url: null,
    child: [{
        name: "Cashbook report",
        url: "/cashbookreport",
        child: null
    }, {
        name: "Trial Balance Report",
        url: "/trialbalancereport",
        child: null
    }]
}]


export { sideBarContent }