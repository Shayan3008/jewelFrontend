const sideBarContent = [
    {
        name:"Cash Book",
        url:null,
        child:[
            {
                name:"View Cashbook",
                url:"",
                child:null,
            },{
                name: "Add Opening Balance",
                url:"/addopeningbalance",
                child:null
            }
        ]
    }
    ,{
    name: "Setup",
    url: null,
    child: [{
        name: "Category",
        url: "/category",
        child: null
    },
    {
        name: "CashBook",
        url: "/cashbook",
        child: null
    },
    {
        name: "Currency Setup",
        url: "/currencysetup",
        child: null
    },
    {
        name: "Metal Type",
        url: "/metaltype",
        child: null
    },
    {
        name: "Inventory",
        url: "/viewinventory",
        child: null
    },
    {
        name: "Karigar",
        url: "/karigar",
        child: null,
    },
    {
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
    child: [
        {
            name: "Currency",
            url: "/currency",
            child: null
        },
        {
            name: "Invoice",
            url: "/invoice",
            child: null
        }
    ],

},
{
    name: "Ledger",
    url: null,
    child: [
        {
            name: "Journal Voucher",
            url: "/journalvoucher",
            child: null
        },
        {
            name: "Ledger Voucher",
            url: "/purchasevoucher",
            child: null
        },
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