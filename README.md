# Visual Pattern Manager

The **Visual Pattern Manager** is a Proof-of-concept work originating from research to integrate domain experts' knowledge into signature-based Security Analytics. 

The PoC uses [Google Blockly](https://developers.google.com/blockly/) with completely custom-built Blocks and Code Generators for the [Esper EPL](https://esper.espertech.com/release-8.5.0/reference-esper/html/preface.html). Thus, the PoC allows to build pattern and schemas to be used in a Esper Complex Event Processing environment. Additionally, existing patterns can be edited or deleted. A Debugger and a Live Event Chart allow for to analyse a pattern in-depth to identify possible misconfigurations. 

The Pattern Manager needs access to the [API Provider](https://github.com/Knowledge-based-Security-Analytics/backend-graphql). The respective connection strings `uri` and `websocketUri` within the `graphql.module.ts` file have to be adjusted accordingly for the project to run properyl.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
