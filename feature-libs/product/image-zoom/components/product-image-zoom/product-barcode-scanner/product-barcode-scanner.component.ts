import {
  ChangeDetectionStrategy,
  Component,
  ElementRef, EventEmitter,
  HostListener,
  Input, Output,
} from '@angular/core';
import {
  RoutingService
} from '@spartacus/core';
import {
  FocusConfig,
  ICON_TYPE,
  LaunchDialogService,
} from '@spartacus/storefront';
import {NgxBarcodeScannerService} from "@eisberg-labs/ngx-barcode-scanner";
// import {QuaggaJSConfigObject} from '@ericblade/quagga2';
import { Subject} from 'rxjs';
import Quagga, {QuaggaJSConfigObject, QuaggaJSResultObject} from '@ericblade/quagga2';

@Component({
  selector: 'cx-product-image-zoom-dialog',
  templateUrl: 'product-barcode-scanner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ProductBarcodeDialogComponent {
  iconType = ICON_TYPE;
  private scanResult ?: Subject<string>;
  focusConfig: FocusConfig = {
    trap: true,
    block: true,
    autofocus: 'button',
    focusOnEscape: true,
  };
  private meanBy(arr: any[], property: string): number | undefined {
    if (!arr) {
      return undefined;
    }
    return arr.reduce((acc, item) => (property in item) ? acc + item[property] : acc, 0) / arr.length;
  }
  @Input() config: QuaggaJSConfigObject;
  // @Input() galleryIndex: number;
  // @Input() value: string;
  ee: EventEmitter<number> = new EventEmitter<number>();
  @Input() value: string;
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  @Input() errorThreshold: number;
  @Output() exception = new EventEmitter();
  // @Input() galleryIndex: number;

  @HostListener('click', ['$event'])
  handleClick(event: UIEvent): void {
    // Close on click outside the dialog window
    if ((event.target as any).tagName === this.el.nativeElement.tagName) {
      this.close('Cross click');
    }
  }

  constructor(
    protected launchDialogService: LaunchDialogService,
    protected routingService: RoutingService,
    private service: NgxBarcodeScannerService,
    // private scanResult ?: Subject<string>,
    protected el: ElementRef
  ) {
    console.log(this.routingService)
    console.log(window.location.origin)
    console.log(this.routingService.getParams())
console.log(this.routingService.getPageContext())
    // console.log(this.routingService.getFullUrl())
    console.log(this.routingService.getRouterState())

    // setInterval(_ => {
    //   this.ee.emit(this.counter++);
    // }, 1000);
    // this.valueChange.emit(this.value)
    // this.valueChange.emit(this.value)
    this.valueChange.subscribe(value => {
       console.log(value)
      if(value){
       // this.routingService.goByUrl()
        console.log(this.routingService.getFullUrl)
      }
      });
  }

  onValueChanges(detectedValue: string) {
    this.valueChange.subscribe(data => {
    console.log(data)
      console.log(this.value)
    });
    console.log("Found this: " + detectedValue)
  }
  isScanMatch(scanResult: QuaggaJSResultObject, errorThresholdPercentage: number): boolean {
    const avgErrors = this.meanBy(scanResult.codeResult.decodedCodes, 'error');
    return !!avgErrors && avgErrors < errorThresholdPercentage;
  }

  onStopButtonPress() {
    this.service.stop()
  }
  onError(err){
    console.log('error',err);
  }
  close(reason = ''): void {
    this.launchDialogService.closeDialog(reason);
  }

  ngOnInit(): void {
    // this.setConfig();

    const threshold = isNaN(this.errorThreshold) ? 0.1 : this.errorThreshold;
    // isScanMatch(this.scanResult: QuaggaJSResultObject, threshold): boolean {
    //   const avgErrors = this.meanBy(this.scanResult.codeResult.decodedCodes, 'error');
    //   return !!avgErrors && avgErrors < threshold;
    // }
    // this.service.start(this.config, threshold).subscribe((value) => {
    //   this.valueChange.emit(value);
    // }, error => {
    //   this.exception.emit(error);
    // });
    // this.service.start(this.config, threshold).subscribe((value) => {
    Quagga.onDetected((result: QuaggaJSResultObject) => {
      const barcode = result.codeResult.code;
      this.valueChange.emit(this.value);
      // this.valueChange.subscribe(value => {
      //   console.log(value)
      // });
      if (this.isScanMatch(result, threshold)) {
        this.scanResult?.next(barcode + '');
        // console.log(this.scanResult)
      }
      console.log(barcode)
      if(barcode) {
        let redirectUrl = `${window.location.origin}/electronics-spa/en/USD/product/${barcode}`
        console.log(redirectUrl)
        location.href = redirectUrl;
      }
      })
    }
}
