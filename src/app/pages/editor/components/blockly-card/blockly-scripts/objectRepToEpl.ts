import { Schema, Pattern } from 'src/app/shared/models/eplObjectRepresentation';

export class ObjectRepToEpl {
  public static translateSchemaToEpl( schema: Schema ): string {
    let attributeString = '';
    for ( const attribute of schema.attributes ) {
      if (attribute.name === 'sources') {
        console.log('complex');
      }
      attributeString += `${attribute.name} ${attribute.type}`;
      attributeString += ((schema.attributes.indexOf(attribute) + 1) < schema.attributes.length) ? `, ` : ``;
    }
    return `@name('${schema.name}') @JsonSchema( dynamic=true ) create json schema ${schema.name} as (${attributeString});`;
  }

  public static translatePatternToEpl( pattern: Pattern ): string {
    return 'test';
  }
}
