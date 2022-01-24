import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { WindowRef } from '@spartacus/core';
import {
  CommonConfigurator,
  ConfiguratorModelUtils,
} from '@spartacus/product-configurator/common';
import { KeyboardFocusService } from '@spartacus/storefront';
import { Observable, of } from 'rxjs';
import { ConfiguratorGroupsService } from '../../core/facade/configurator-groups.service';
import { Configurator } from '../../core/model/configurator.model';
import { ConfiguratorStorefrontUtilsService } from './configurator-storefront-utils.service';

let isGroupVisited: Observable<boolean> = of(false);

class MockConfiguratorGroupsService {
  isGroupVisited(): Observable<boolean> {
    return isGroupVisited;
  }
}

class MockKeyboardFocusService {
  findFocusable() {}
}

describe('ConfigUtilsService', () => {
  let classUnderTest: ConfiguratorStorefrontUtilsService;
  const owner = ConfiguratorModelUtils.createOwner(
    CommonConfigurator.OwnerType.PRODUCT,
    'testProduct'
  );
  let windowRef: WindowRef;
  let keyboardFocusService: KeyboardFocusService;
  let querySelectorOriginal: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ConfiguratorGroupsService,
          useClass: MockConfiguratorGroupsService,
        },
        {
          provide: KeyboardFocusService,
          useClass: MockKeyboardFocusService,
        },
      ],
    });
    classUnderTest = TestBed.inject(ConfiguratorStorefrontUtilsService);
    windowRef = TestBed.inject(WindowRef as Type<WindowRef>);
    spyOn(windowRef, 'isBrowser').and.returnValue(true);
    keyboardFocusService = TestBed.inject(
      KeyboardFocusService as Type<KeyboardFocusService>
    );
    querySelectorOriginal = document.querySelector;
  });

  afterEach(() => {
    document.querySelector = querySelectorOriginal;
  });

  it('should be created', () => {
    expect(classUnderTest).toBeTruthy();
  });

  function getCurrentResult() {
    let result = false;
    classUnderTest
      .isCartEntryOrGroupVisited(owner, 'group_01')
      .subscribe((data) => (result = data))
      .unsubscribe();
    return result;
  }

  it('should scroll to element', () => {
    const theElement = document.createElement('div');
    document.querySelector = jasmine
      .createSpy('HTML Element')
      .and.returnValue(theElement);
    spyOn(theElement, 'getBoundingClientRect').and.returnValue(
      new DOMRect(100, 2000, 100, 100)
    );
    const nativeWindow = windowRef.nativeWindow;
    if (nativeWindow) {
      spyOn(nativeWindow, 'scroll').and.callThrough();
      classUnderTest.scrollToConfigurationElement(
        '.VariantConfigurationTemplate'
      );

      expect(nativeWindow.scroll).toHaveBeenCalledWith(0, 0);
    }
  });

  it('should return false because the product has not been added to the cart and the current group was not visited', () => {
    isGroupVisited = of(false);
    owner.type = CommonConfigurator.OwnerType.PRODUCT;
    expect(getCurrentResult()).toBe(false);
  });

  it('should return true because the product has been added to the cart', () => {
    isGroupVisited = of(false);
    owner.type = CommonConfigurator.OwnerType.CART_ENTRY;
    expect(getCurrentResult()).toBe(true);
  });

  it('should return true because the current group was visited', () => {
    isGroupVisited = of(true);
    expect(getCurrentResult()).toBe(true);
  });

  it('should assemble values from a checkbox list into an attribute value', () => {
    const controlArray = new Array<FormControl>();
    const control1 = new FormControl(true);
    const control2 = new FormControl(false);
    controlArray.push(control1, control2);
    const attribute: Configurator.Attribute = {
      name: 'attr',
      values: [{ valueCode: 'b' }, { name: 'blue', valueCode: 'a' }],
    };

    const values: Configurator.Value[] =
      classUnderTest.assembleValuesForMultiSelectAttributes(
        controlArray,
        attribute
      );
    if (attribute.values) {
      expect(values.length).toBe(2);
      expect(values[0].valueCode).toBe(attribute.values[0].valueCode);
      expect(values[0].selected).toBe(true);
      expect(values[1].name).toBe(attribute.values[1].name);
      expect(values[1].selected).toBe(false);
    } else fail();
  });

  it('should gracefully handle situation that control array has values not present in attribute', () => {
    const controlArray = new Array<FormControl>();
    const control1 = new FormControl(true);
    const control2 = new FormControl(false);
    controlArray.push(control1, control2);
    const attribute: Configurator.Attribute = {
      name: 'attr',
      values: [{ name: 'blue', valueCode: 'a' }],
    };

    const values: Configurator.Value[] =
      classUnderTest.assembleValuesForMultiSelectAttributes(
        controlArray,
        attribute
      );
    expect(values.length).toBe(1);
  });

  describe('focusFirstAttribute', () => {
    it('should delegate to focus service', () => {
      const theElement = document.createElement('form');
      document.querySelector = jasmine
        .createSpy('HTML Element')
        .and.returnValue(theElement);
      spyOn(keyboardFocusService, 'findFocusable').and.returnValue([]);
      classUnderTest.focusFirstAttribute();
      expect(keyboardFocusService.findFocusable).toHaveBeenCalledTimes(1);
    });

    it('should not delegate to focus service if form is not available', () => {
      document.querySelector = jasmine
        .createSpy('HTML Element')
        .and.returnValue(null);
      spyOn(keyboardFocusService, 'findFocusable').and.returnValue([]);
      classUnderTest.focusFirstAttribute();
      expect(keyboardFocusService.findFocusable).toHaveBeenCalledTimes(0);
    });
  });

  describe('createGroupId', () => {
    it('should return empty string because group ID is undefined', () => {
      expect(classUnderTest.createGroupId(undefined)).toBeUndefined();
    });

    it('should return group ID string', () => {
      expect(classUnderTest.createGroupId('1234')).toBe('1234-group');
    });
  });

  describe('change styling of selected element', () => {
    it('should get HTML element based on query selector', () => {
      const theElement = document.createElement('elementMock');
      document.querySelector = jasmine
        .createSpy('HTML Element')
        .and.returnValue(theElement);

      expect(classUnderTest.getElement('elementMock')).toEqual(theElement);
    });
    it('should change styling of HTML element', () => {
      const theElement = document.createElement('elementMock');
      document.querySelector = jasmine
        .createSpy('HTML Element')
        .and.returnValue(theElement);

      classUnderTest.changeStyling('elementMock', 'position', 'sticky');
      expect(theElement.style.position).toEqual('sticky');
    });
  });
});
