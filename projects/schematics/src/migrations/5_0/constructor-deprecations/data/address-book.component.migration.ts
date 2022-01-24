import {
  ADDRESS_BOOK_COMPONENT,
  ADDRESS_BOOK_COMPONENT_SERVICE,
  GLOBAL_MESSAGE_SERVICE,
  SPARTACUS_CORE,
  TRANSLATION_SERVICE,
} from '../../../../shared/constants';
import { ConstructorDeprecation } from '../../../../shared/utils/file-utils';

export const ADDRESS_BOOK_COMPONENT_MIGRATION: ConstructorDeprecation = {
  // projects/storefrontlib/cms-components/myaccount/address-book/address-book.component.ts
  class: ADDRESS_BOOK_COMPONENT,
  importPath: SPARTACUS_CORE,
  deprecatedParams: [
    { className: ADDRESS_BOOK_COMPONENT_SERVICE, importPath: SPARTACUS_CORE },
    { className: TRANSLATION_SERVICE, importPath: SPARTACUS_CORE },
  ],
  addParams: [
    { className: GLOBAL_MESSAGE_SERVICE, importPath: SPARTACUS_CORE },
  ],
};
