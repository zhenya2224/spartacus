import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import {
  migrateMissingPackage,
  MissingPackageMigration,
} from '../../mechanism/missing-packages/missing-packages';

const MISSING_PACKAGE_DATA: MissingPackageMigration[] = [
  {
    package: '@spartacus/checkout',
    comment: 'Checkout package missing',
  },
  {
    package: '@spartacus/asm',
    comment: 'ASM package missing',
  },
];

export function migrate(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    for (const migrationData of MISSING_PACKAGE_DATA) {
      migrateMissingPackage(tree, context, migrationData);
    }
  };
}
