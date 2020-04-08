import { Pattern, Schema, Statement } from 'src/app/models/statement';

export class BackendStatementModel {
  deploymentId?: string;
  deploymentDependencies?: string[];
  deploymentMode?: string;
  eplStatement?: string;
  name?: string;
  description?: string;
  modified?: string;
  blocklyXml?: string;
  eventType?: boolean;
  alertCount?: number;
  objectRepresentation?: string;
}

export function backendToFrontendDataModelConverter(statement: BackendStatementModel): Pattern | Schema {
  const frontendModel = statement.eventType ? new Schema() : new Pattern();
  frontendModel.name = statement.name;
  frontendModel.description = statement.description;
  frontendModel.lastModified = statement.modified;
  frontendModel.blocklyXml = statement.blocklyXml;
  frontendModel.alertCount = 0;
  frontendModel.deploymentProperties.id = statement.deploymentId;
  frontendModel.deploymentProperties.dependencies = statement.deploymentDependencies;
  frontendModel.deploymentProperties.mode = statement.deploymentMode === 'prod' ? 'prod' : 'dev';
  frontendModel.deploymentProperties.eplStatement = statement.eplStatement;

  const objectRepresentation: any = JSON.parse(statement.objectRepresentation.replace(/\\x22/g, '/\x22'));
  if (Statement.isSchema(frontendModel)) {
    frontendModel.attributes = objectRepresentation.attributes ? objectRepresentation.attributes : [];
  } else {
    frontendModel.outputAttributes = objectRepresentation.outputAttributes ? objectRepresentation.outputAttributes : [];
    frontendModel.events = objectRepresentation.events ? objectRepresentation.events : [];
    frontendModel.eventSequence = objectRepresentation.eventSequence ? objectRepresentation.eventSequence : [];
  }
  return frontendModel;
}

export function frontendToBackendModelConverter(statement: Pattern | Schema): BackendStatementModel {
  const tempObjectRepresentation: any = {};
  if (Statement.isSchema(statement)) {
    tempObjectRepresentation.attributes = statement.attributes;
  } else {
    tempObjectRepresentation.outputAttributes = statement.outputAttributes;
    tempObjectRepresentation.events = statement.events;
    tempObjectRepresentation.eventSequence = statement.eventSequence;
  }
  const backendModel = {
    eventType: statement.type === 'schema' ? true : false,
    deploymentId: statement.deploymentProperties.id,
    deploymentDependencies: statement.deploymentProperties.dependencies,
    deploymentMode: statement.deploymentProperties.mode,
    eplStatement: statement.deploymentProperties.eplStatement,
    name: statement.name,
    description: statement.description,
    modified: statement.lastModified,
    blocklyXml: statement.blocklyXml,
    objectRepresentation: JSON.stringify(tempObjectRepresentation).replace(/\x22/g, '\\\x22')
  };

  return backendModel;
}
