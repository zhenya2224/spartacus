import {
  chain,
  noop,
  Rule,
  SchematicContext,
  Tree,
} from '@angular-devkit/schematics';
import {
  addLibraryFeature,
  addPackageJsonDependenciesForLibrary,
  CLI_CDC_FEATURE,
  CLI_USER_PROFILE_FEATURE,
  LibraryOptions as SpartacusCdcOptions,
  readPackageJson,
  shouldAddFeature,
  SPARTACUS_CDC,
  SPARTACUS_USER,
  validateSpartacusInstallation,
} from '@spartacus/schematics';
import { peerDependencies } from '../../package.json';
import {
  CDC_CONFIG,
  CDC_FEATURE_CONSTANT,
  CDC_FOLDER_NAME,
  CDC_MODULE,
  CDC_MODULE_NAME,
  CDC_ROOT_MODULE,
  SPARTACUS_CDC_ROOT,
} from '../constants';

export function addCdcFeature(options: SpartacusCdcOptions): Rule {
  return (tree: Tree, _context: SchematicContext): Rule => {
    const packageJson = readPackageJson(tree);
    validateSpartacusInstallation(packageJson);

    return chain([
      addPackageJsonDependenciesForLibrary(peerDependencies, options),

      shouldAddFeature(CLI_CDC_FEATURE, options.features)
        ? addCdc(options)
        : noop(),
    ]);
  };
}

function addCdc(options: SpartacusCdcOptions): Rule {
  return addLibraryFeature(options, {
    folderName: CDC_FOLDER_NAME,
    moduleName: CDC_MODULE_NAME,
    rootModule: {
      importPath: SPARTACUS_CDC_ROOT,
      name: CDC_ROOT_MODULE,
      content: `${CDC_ROOT_MODULE}`,
    },
    featureModule: {
      importPath: SPARTACUS_CDC,
      name: CDC_MODULE,
    },
    lazyLoadingChunk: {
      moduleSpecifier: SPARTACUS_CDC_ROOT,
      namedImports: [CDC_FEATURE_CONSTANT],
    },
    customConfig: {
      import: [
        {
          moduleSpecifier: SPARTACUS_CDC_ROOT,
          namedImports: [CDC_CONFIG],
        },
      ],
      content: `<${CDC_CONFIG}>{
          cdc: [
            {
              baseSite: 'electronics-spa',
              javascriptUrl: '<url-to-cdc-script>',
              sessionExpiration: 3600
            },
          ],
        }`,
    },
    dependencyManagement: {
      featureName: CLI_CDC_FEATURE,
      featureDependencies: {
        [SPARTACUS_USER]: [CLI_USER_PROFILE_FEATURE],
      },
    },
  });
}
