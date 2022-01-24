import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { merge, Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { normalizeHttpError } from '../../../util/normalize-http-error';
import { ProductConnector } from '../../connectors/product/product.connector';
import { ProductActions } from '../actions/index';
import { ScopedProductData } from '../../connectors/product/scoped-product-data';
import { SiteContextActions } from '../../../site-context/store/actions/index';
import { bufferDebounceTime } from '../../../util/rxjs/buffer-debounce-time';
import { Action } from '@ngrx/store';
import { withdrawOn } from '../../../util/rxjs/withdraw-on';

@Injectable()
export class ProductEffects {
  // we want to cancel all ongoing requests when currency or language changes,
  private contextChange$: Observable<Action> = this.actions$.pipe(
    ofType(
      SiteContextActions.CURRENCY_CHANGE,
      SiteContextActions.LANGUAGE_CHANGE
    )
  );

  loadProduct$ = createEffect(
    () =>
      ({ scheduler, debounce = 0 } = {}): Observable<
        ProductActions.LoadProductSuccess | ProductActions.LoadProductFail
      > =>
        this.actions$.pipe(
          ofType(ProductActions.LOAD_PRODUCT),
          map((action: ProductActions.LoadProduct) => ({
            code: action.payload,
            scope: action.meta.scope,
          })),
          // we are grouping all load actions that happens at the same time
          // to optimize loading and pass them all to productConnector.getMany
          bufferDebounceTime(debounce, scheduler),
          mergeMap((products) =>
            merge(
              ...this.productConnector
                .getMany(products)
                .map(this.productLoadEffect)
            )
          ),
          withdrawOn(this.contextChange$)
        )
  );

  private productLoadEffect(
    productLoad: ScopedProductData
  ): Observable<
    ProductActions.LoadProductSuccess | ProductActions.LoadProductFail
  > {
    return productLoad.data$.pipe(
      map(
        (data) =>
          new ProductActions.LoadProductSuccess(
            { code: productLoad.code, ...data },
            productLoad.scope
          )
      ),
      catchError((error) => {
        return of(
          new ProductActions.LoadProductFail(
            productLoad.code,
            normalizeHttpError(error),
            productLoad.scope
          )
        );
      })
    );
  }

  constructor(
    private actions$: Actions,
    private productConnector: ProductConnector
  ) {}
}
