export default {
  "dashboarDropDownMenuItems": [{
    "id": "1",
    "menu": "Discover",
    "content": [
      {
        "name": "Dashboard",
        "iconClass": "fa fa-lg fa-tachometer",
        "disabled": false,
        "route": "/element/dashboard"
      },  
      {
        "name": "Workspace",
        "iconClass": "fa fa-lg fa-th-large",
        "disabled": true
      },
      {
        "name": "Investigation Console",
        "iconClass": "fa fa-lg fa-eye",
        "disabled": true
      },
      {
        "name": "Transaction Monitoring",
        "iconClass": "fa fa-lg fa-money",
        "disabled": true
      },
      {
        "name": "Market Intelligence",
        "iconClass": "fa fa-lg fa-line-chart",
        "disabled": true
      },
      {
        "name": "Adverse Transactions",
        "iconClass": "fa fa-lg fa-shirtsinbulk",
        "disabled": true
      },
      {
        "name": "Fraud",
        "imgIcon": "assets/images/icon/fraud.svg",
        "iconClass": "fa fa-lg fa-lightbulb-o",
        "disabled": true
      },
      {
        "name": "Transaction Intelligence",
        "iconClass": "fa fa-lg fa-lightbulb-o",
        "disabled": true
      },
      {
        "name": "eDiscovery",
        "iconClass": "fa fa-lg fa-file-o",
        "disabled": true
      },
      {  
        "name": "Alert Management",
        "iconClass": "fa fa-lg fa-tachometer",
        "disabled": false,
        "route": "/element/alert-management"
      }

    ],
    "mainIconClass": "fa fa-lg fa-binoculars",
    "disabled": true
  },
  {
    "id": "2",
    "menu": "Enrich",
    "content": [
      {
        "name": "Advanced Search",
        "iconClass": "fa fa-lg fa-search",
        "disabled": true
      },
      {
        "name": "Onboarding",
        "iconClass": "fa fa-lg fa-slideshare",
        "disabled": true
      }
      
    ],
    "mainIconClass": "fa fa-lg fa-cubes",
    "disabled": true
  },
  {
    "id": "3",
    "menu": "Act",
    "content": [
      {
        "name": "Entity",
        "iconClass": "fa fa-lg fa-spinner",
        "disabled": true
      },
      {
        "name": "Cases",
        "iconClass": "fa fa-lg fa-suitcase",
        "disabled": true
      },
      {
        "name": "Link Analysis",
        "iconClass": "fa fa-lg fa-joomla",
        "disabled": true
      },
      {
        "name": "Underwriting",
        "iconClass": "fa fa-lg fa-check-square-o",
        "disabled": true
      },
      {
        "name": "Audit Trail",
        "iconClass": "fa fa-lg fa-stack-overflow",
        "disabled": true
      }
    ],
    "mainIconClass": "fa fa-lg fa-paper-plane",
    "disabled": true
  },
  {
    "id": "4",
    "menu": "Predict",
    "content": [
      {
        "name": "Lead Generation",
        "imgIcon": "assets/images/icon/leadGeneration.svg",
        "iconClass": "fa fa-lg fa-credit-card",
        "disabled": true
      }],
    "mainIconClass": "fa fa-lg fa-flask",
    "disabled": true
  },
  {
    "id": "5",
    "menu": "Manage",
    "content": [
      {
        "name": "Orchestration",
        "iconClass": "fa fa-lg fa-user",
        "disabled": true
      },
      {
        "name": "App Manager",
        "iconClass": "fa fa-lg fa-qrcode",
        "disabled": true
      },
      {
        "name": "Data Management",
        "iconClass": "fa fa-lg fa-life-ring",
        "disabled": true
      },
      {
        "name": "System Monitoring",
        "iconClass": "fa fa-lg fa-desktop",
        "disabled": true
      },
      {
        "name": "Big Data Science Platform",
        "iconClass": "fa fa-lg fa-flask",
        "disabled": true
      },
      {
        "name": "System Settings",
        "iconClass": "fa fa-lg fa-cog",
        "disabled": true
      },
      {
        "name": "Policy Enforcement",
        "iconClass": "fa fa-lg fa-leanpub",
        "disabled": true
      },
      {
        "name": "Questionnaire Builder",
        "iconClass": "fa fa-lg fa-newspaper-o",
        "disabled": true
      },
      {
        "name": "Data Curation",
        "iconClass": "fa fa-lg fa-th",
        "disabled": true
      },
      {
        "name": "Decision Scoring",
        "iconClass": "fa fa-lg fa-star",
        "disabled": true
      }, {
        "name": "Document Parsing",
        "iconClass": "fa fa-lg fa-file",
        "disabled": true
      }, {
        "name": "Source Management",
        "iconClass": "fa fa-lg fa-link",
        "disabled": false,
        "route": "/element/sourceManagement"
      },
      {
        "name": "Document Management",
        "iconClass": "fa fa-lg fa-joomla",
        "disabled": true
      }
    ],
    "mainIconClass": "fa fa-lg fa-server",
    "disabled": true
  }
  ],
  "DisableBydomains": {
    "AML": ["Fraud", "Underwriting"],
    "FINANCIAL CRIME": ["Transaction Intelligence", "Underwriting"],
    "Risk": ["Fraud", "Underwriting"],
    "CREDIT CARDS": ["Fraud", "Underwriting"],
    "SOCIAL LISTENING": ["Fraud", "Underwriting"],
    "MARKET INTELLIGENCE": ["Fraud", "Underwriting"],
    "INSURANCE": ["Fraud"]

  }
}