import { DIALOG_TYPE, LayoutConfig } from '@spartacus/storefront';
import { ProductImageZoomDialogComponent } from './product-image-zoom-dialog/product-image-zoom-dialog.component';
import { ProductBarcodeDialogComponent } from './product-barcode-scanner/product-barcode-scanner.component';

export const defaultProductImageZoomLayoutConfig: LayoutConfig = {
  launch: {
    PRODUCT_IMAGE_ZOOM: {
      inline: true,
      component: ProductImageZoomDialogComponent,
      dialogType: DIALOG_TYPE.DIALOG,
    },
  },
};
export const defaultProductImageBarcodeLayoutConfig: LayoutConfig = {
  launch: {
    PRODUCT_SCAN_CODE: {
      inline: true,
      component: ProductBarcodeDialogComponent,
      dialogType: DIALOG_TYPE.DIALOG,
    },
  },
};
