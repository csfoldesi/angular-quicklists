# AngularQuicklists


## Create app
`ng new angular-quicklists`

## Add Angular CDK
`ng add @angular/cdk`

## For better component generating
```json
"schematics": {
    "@schematics/angular": {
        "component": {
        "inlineTemplate": true,
        "inlineStyle": true,
        "skipTests": true,
        "flat": true
        }
    }        
},
```