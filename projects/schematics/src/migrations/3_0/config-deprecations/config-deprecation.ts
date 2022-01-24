import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { ConfigDeprecation } from '../../../shared/utils/file-utils';
import { migrateConfigDeprecation } from '../../mechanism/config-deprecations/config-deprecation';
import { LEGACY_FLAG_MIGRATION } from './data/legacy-flag.migration';

export const CONFIG_DEPRECATION_DATA: ConfigDeprecation[] = [
  LEGACY_FLAG_MIGRATION,
];

export function migrate(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return migrateConfigDeprecation(tree, context, CONFIG_DEPRECATION_DATA);
  };
}
