export interface Statement {
    deploymentId?: string;
    deploymentDependencies?: string[];
    deploymentMode?: string;
    eplStatement?: string;
    name?: string;
    blocklyXml?: string;
    eventType?: boolean;
}

export class StatementDef {
    deploymentId?: boolean;
    deploymentDependencies?: boolean;
    deploymentMode?: boolean;
    eplStatement?: boolean;
    name?: boolean;
    blocklyXml?: boolean;
    eventType?: boolean;
}
