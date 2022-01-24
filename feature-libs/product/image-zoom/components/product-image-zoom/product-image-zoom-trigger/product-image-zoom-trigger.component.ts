import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewContainerRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  ICON_TYPE,
  LaunchDialogService,
  LAUNCH_CALLER,
} from '@spartacus/storefront';
import { combineLatest, Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { ProductImageZoomDialogComponent } from '../product-image-zoom-dialog/product-image-zoom-dialog.component';
 import { ProductBarcodeDialogComponent } from '../product-barcode-scanner/product-barcode-scanner.component';
import {NgxBarcodeScannerService} from "@eisberg-labs/ngx-barcode-scanner";
import {QuaggaJSConfigObject} from '@ericblade/quagga2';


@Component({
  selector: 'cx-product-image-zoom-trigger',
  templateUrl: 'product-image-zoom-trigger.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductImageZoomTriggerComponent implements OnDestroy {
  iconType = ICON_TYPE;
  protected subscriptions = new Subscription();
  value: string;
  //Expose the expand button so it can gain focus on closing the zoom window
  @ViewChild('expandButton') expandButton: ElementRef;
  @Input() config: QuaggaJSConfigObject;
  @Input() galleryIndex: number;
  // ee: EventEmitter<number> = new EventEmitter<number>();
  // // @Input() value: string;
  // @Output() valueChange = new EventEmitter();
  @Input() errorThreshold: number;
  @Output() exception = new EventEmitter();

  @Input() set expandImage(expand: boolean) {
    if (expand) {
      this.triggerZoom();
    }
  }

  @Output() dialogClose = new EventEmitter<void>();

  constructor(
    private service: NgxBarcodeScannerService,
    private appService: ProductBarcodeDialogComponent,
  protected launchDialogService: LaunchDialogService,
    protected vcr: ViewContainerRef
  ) {

  }

//   triggerScanbarcode: void {
//   console.log('scanning barcode');
// }
  onStartButtonPress() {
    // this.service.start(this.config, 0.1).subscribe((value) => {
    //   console.log(value)
    // })

  }
  // this.valueChange.emit(event)
  onValueChanges(detectedValue: string) {
    // this.valueChange.emit(event)
    console.log("Found this: " + detectedValue)
  }
  //
  // valueChange.emit(event)
  onStopButtonPress() {
    this.service.stop()
  }
  onError(err){
    console.log('error',err);
  }
  triggerScanbarcode(): void {
  console.log('scanning barcode',   LAUNCH_CALLER.PRODUCT_SCAN_CODE, this.vcr );

    const component = this.launchDialogService.launch(
      LAUNCH_CALLER.PRODUCT_SCAN_CODE,
      this.vcr
    );
    console.log(this.vcr);
    if (component) {
      this.subscriptions.add(
        combineLatest([component, this.launchDialogService.dialogClose])
          .pipe(
            tap(([comp]) => {
              console.log(comp)
              // if (this.galleryIndex) {
              //   (
              //     comp as ComponentRef<ProductBarcodeDialogComponent>
              //   ).instance.galleryIndex = this.galleryIndex;
              // }
            }),
            filter(([, close]) => Boolean(close)),
            tap(([comp]) => {
              this.launchDialogService.clear(LAUNCH_CALLER.PRODUCT_SCAN_CODE);
              comp?.destroy();
              this.dialogClose.emit();
              this.expandButton.nativeElement.focus();
            })
          )
          .subscribe()
      );
    }
}
  // PRODUCT_IMAGE_ZOOM: {
  //   inline: true,
  //   component: ProductBarcodeDialogComponent,
  //   dialogType: 'DIALOG',
  // },
  triggerZoom(): void {
    const component = this.launchDialogService.launch(
      LAUNCH_CALLER.PRODUCT_IMAGE_ZOOM,
      this.vcr
    );
    if (component) {
      this.subscriptions.add(
        combineLatest([component, this.launchDialogService.dialogClose])
          .pipe(
            tap(([comp]) => {
              if (this.galleryIndex) {
                (
                  comp as ComponentRef<ProductImageZoomDialogComponent>
                ).instance.galleryIndex = this.galleryIndex;
              }
            }),
            filter(([, close]) => Boolean(close)),
            tap(([comp]) => {
              this.launchDialogService.clear(LAUNCH_CALLER.PRODUCT_IMAGE_ZOOM);
              comp?.destroy();
              this.dialogClose.emit();
              this.expandButton.nativeElement.focus();
            })
          )
          .subscribe()
      );
    }
  }
  ngOnInit(): void {
    // this.setConfig();
     const threshold = isNaN(this.errorThreshold) ? 0.1 : this.errorThreshold;
    // this.service.start(this.config, threshold).subscribe((value) => {
    //    this.valueChange.emit(this.value);

    this.appService.valueChange.subscribe(value => {
    console.log(value)
    });
    console.log(threshold)
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
