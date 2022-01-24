import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  provideConfig,
  I18nModule,
  provideDefaultConfig,
  CmsConfig,
} from '@spartacus/core';
import {
  CarouselModule,
  IconModule,
  KeyboardFocusModule,
  MediaModule,
  OutletModule,
} from '@spartacus/storefront';
import { defaultProductImageZoomLayoutConfig } from './default-product-image-zoom-layout.config';
import { defaultProductImageBarcodeLayoutConfig } from './default-product-image-zoom-layout.config';
import { ProductImageZoomDialogComponent } from './product-image-zoom-dialog/product-image-zoom-dialog.component';
import { ProductImageZoomProductImagesComponent } from './product-image-zoom-product-images/product-image-zoom-product-images.component';
import { ProductImageZoomThumbnailsComponent } from './product-image-zoom-thumbnails/product-image-zoom-thumbnails.component';
import { ProductImageZoomTriggerComponent } from './product-image-zoom-trigger/product-image-zoom-trigger.component';
import { ProductImageZoomViewComponent } from './product-image-zoom-view/product-image-zoom-view.component';
import { ProductBarcodeDialogComponent } from './product-barcode-scanner/product-barcode-scanner.component';
import {NgxBarcodeScannerModule} from "@eisberg-labs/ngx-barcode-scanner";


@NgModule({
  imports: [
    CarouselModule,
    CommonModule,
    I18nModule,
    IconModule,
    KeyboardFocusModule,
    MediaModule,
    OutletModule,
    RouterModule,
    NgxBarcodeScannerModule
  ],
  providers: [
    provideConfig(defaultProductImageZoomLayoutConfig),
    provideConfig(defaultProductImageBarcodeLayoutConfig),
    ProductBarcodeDialogComponent,
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        ProductImagesComponent: {
          component: ProductImageZoomProductImagesComponent,
        },
      },
    }),
  ],
  declarations: [
    ProductImageZoomDialogComponent,
    ProductImageZoomProductImagesComponent,
    ProductImageZoomThumbnailsComponent,
    ProductImageZoomTriggerComponent,
    ProductImageZoomViewComponent,
    ProductBarcodeDialogComponent
  ],
  exports: [
    ProductImageZoomDialogComponent,
    ProductImageZoomProductImagesComponent,
    ProductImageZoomThumbnailsComponent,
    ProductImageZoomTriggerComponent,
    ProductImageZoomViewComponent,
    ProductBarcodeDialogComponent
  ],
})
export class ProductImageZoomModule {}
