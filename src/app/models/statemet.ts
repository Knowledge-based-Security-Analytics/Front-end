export interface Statement {
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
    eplParsed?: EPLParsed;
}

export interface EPLParsed {
  name?: string;
  type?: string;
  attributes?: {[key: string]: string};
}
