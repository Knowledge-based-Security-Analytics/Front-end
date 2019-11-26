export interface Statement {
    deploymentId?: string;
    deploymentDependencies?: string[];
    deploymentMode?: string;
    eplStatement?: string;
    name?: string;
    blocklyXml?: string;
    eventType?: boolean;
    alertCount?: number;
    eplParsed?: EPLParsed;
}

export interface EPLParsed {
  name?: string;
}
