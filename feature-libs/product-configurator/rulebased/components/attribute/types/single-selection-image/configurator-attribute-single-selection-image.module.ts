import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { I18nModule } from '@spartacus/core';
import { KeyboardFocusModule } from '@spartacus/storefront';
import { ConfiguratorAttributeSingleSelectionImageComponent } from './configurator-attribute-single-selection-image.component';
import { ConfiguratorPriceModule } from '../../../price/configurator-price.module';

@NgModule({
  imports: [
    KeyboardFocusModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    I18nModule,
    ConfiguratorPriceModule,
  ],
  declarations: [ConfiguratorAttributeSingleSelectionImageComponent],
  exports: [ConfiguratorAttributeSingleSelectionImageComponent],
})
export class ConfiguratorAttributeSingleSelectionImageModule {}
