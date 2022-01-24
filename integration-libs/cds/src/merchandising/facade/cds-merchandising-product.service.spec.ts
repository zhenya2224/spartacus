import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { StrategyProducts } from '../model/strategy-products.model';
import { MerchandisingStrategyConnector } from './../connectors/strategy/merchandising-strategy.connector';
import { MerchandisingSiteContext } from './../model/merchandising-site-context.model';
import { MerchandisingUserContext } from './../model/merchandising-user-context.model';
import { CdsMerchandisingProductService } from './cds-merchandising-product.service';
import { CdsMerchandisingSiteContextService } from './cds-merchandising-site-context.service';
import { CdsMerchandisingUserContextService } from './cds-merchandising-user-context.service';
import createSpy = jasmine.createSpy;

const CONSENT_REFERENCE = '75b75543-950f-4e53-a36c-ab8737a0974a';
const STRATEGY_ID = 'test-strategy-id';

const strategyProducts: StrategyProducts = {
  products: [
    {
      id: 'test-product-id',
    },
  ],
  metadata: {
    'test-metadata-field': 'test-metadata-value',
  },
};

const siteContext: MerchandisingSiteContext = {
  site: 'electronics-spa',
  language: 'en',
};

class MockStrategyConnector {
  loadProductsForStrategy = createSpy(
    'StrategyAdapter.loadProductsForStrategy'
  ).and.callFake(() => of(strategyProducts));
}

class SiteContextServiceStub {
  getSiteContext(): Observable<MerchandisingSiteContext> {
    return of();
  }
}
class UserContextServiceStub {
  getUserContext(): Observable<MerchandisingUserContext> {
    return of();
  }
}

describe('CdsMerchandisingProductService', () => {
  let cdsMerchandisingPrductService: CdsMerchandisingProductService;
  let strategyConnector: MerchandisingStrategyConnector;
  let siteContextService: CdsMerchandisingSiteContextService;
  let userContextService: CdsMerchandisingUserContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: MerchandisingStrategyConnector,
          useClass: MockStrategyConnector,
        },
        {
          provide: CdsMerchandisingUserContextService,
          useClass: UserContextServiceStub,
        },
        {
          provide: CdsMerchandisingSiteContextService,
          useClass: SiteContextServiceStub,
        },
      ],
    });
    cdsMerchandisingPrductService = TestBed.inject(
      CdsMerchandisingProductService
    );
    strategyConnector = TestBed.inject(MerchandisingStrategyConnector);
    siteContextService = TestBed.inject(CdsMerchandisingSiteContextService);
    userContextService = TestBed.inject(CdsMerchandisingUserContextService);
  });

  it('should be created', () => {
    expect(cdsMerchandisingPrductService).toBeTruthy();
  });

  it('loadProductsForStrategy should call connector', () => {
    const strategyRequest = {
      queryParams: {
        site: 'electronics-spa',
        language: 'en',
        products: undefined,
        facets: undefined,
        category: '574',
        pageSize: 10,
      },
      headers: {
        consentReference: undefined,
      },
    };
    const userContext: MerchandisingUserContext = {
      category: '574',
    };
    spyOn(siteContextService, 'getSiteContext').and.returnValue(
      of(siteContext)
    );
    spyOn(userContextService, 'getUserContext').and.returnValue(
      of(userContext)
    );

    let actualStartegyProducts: StrategyProducts;
    cdsMerchandisingPrductService
      .loadProductsForStrategy(STRATEGY_ID, 10)
      .subscribe((productsForStrategy) => {
        actualStartegyProducts = productsForStrategy;
      })
      .unsubscribe();
    expect(actualStartegyProducts).toEqual(strategyProducts);
    expect(strategyConnector.loadProductsForStrategy).toHaveBeenCalledWith(
      STRATEGY_ID,
      strategyRequest
    );
  });

  it('loadProductsForStrategy should call connector and pass in the consent-reference as a header', () => {
    const strategyRequest = {
      queryParams: {
        site: 'electronics-spa',
        language: 'en',
        products: undefined,
        facets: undefined,
        category: '574',
        pageSize: 10,
      },
      headers: {
        consentReference: `${CONSENT_REFERENCE}`,
      },
    };
    const userContext: MerchandisingUserContext = {
      category: '574',
      consentReference: `${CONSENT_REFERENCE}`,
    };
    spyOn(siteContextService, 'getSiteContext').and.returnValue(
      of(siteContext)
    );
    spyOn(userContextService, 'getUserContext').and.returnValue(
      of(userContext)
    );

    let actualStartegyProducts: StrategyProducts;
    cdsMerchandisingPrductService
      .loadProductsForStrategy(STRATEGY_ID, 10)
      .subscribe((productsForStrategy) => {
        actualStartegyProducts = productsForStrategy;
      })
      .unsubscribe();
    expect(actualStartegyProducts).toEqual(strategyProducts);
    expect(strategyConnector.loadProductsForStrategy).toHaveBeenCalledWith(
      STRATEGY_ID,
      strategyRequest
    );
  });

  it('should retrieve the product Id from the state send this in the StrategyRequest to the StrategyConnector', () => {
    const strategyRequest = {
      queryParams: {
        site: 'electronics-spa',
        language: 'en',
        products: ['123456'],
        facets: undefined,
        category: undefined,
        pageSize: 10,
      },
      headers: {
        consentReference: undefined,
      },
    };

    spyOn(siteContextService, 'getSiteContext').and.returnValue(
      of(siteContext)
    );
    spyOn(userContextService, 'getUserContext').and.returnValue(
      of({ products: ['123456'] })
    );

    let actualStrategyProducts: StrategyProducts;
    cdsMerchandisingPrductService
      .loadProductsForStrategy(STRATEGY_ID, 10)
      .subscribe((productsForStrategy) => {
        actualStrategyProducts = productsForStrategy;
      })
      .unsubscribe();
    expect(actualStrategyProducts).toEqual(strategyProducts);
    expect(strategyConnector.loadProductsForStrategy).toHaveBeenCalledWith(
      STRATEGY_ID,
      strategyRequest
    );
  });
});
