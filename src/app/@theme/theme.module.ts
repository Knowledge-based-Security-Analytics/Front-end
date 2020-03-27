import { DEFAULT_THEME } from './styles/theme.default';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbThemeModule } from '@nebular/theme';
import { CapitalizePipe, ToUpperPipe, PluralPipe, RoundPipe } from './pipes';

const PIPES = [
  CapitalizePipe,
  ToUpperPipe,
  PluralPipe,
  RoundPipe,
];

@NgModule({
  declarations: [ ...PIPES, ],
  imports: [ CommonModule ],
  exports: [ CommonModule, ...PIPES, ]
})
export class ThemeModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ThemeModule,
      providers: [
        ...NbThemeModule.forRoot(
          {
            name: 'default',
          },
          [ DEFAULT_THEME ],
        ).providers,
      ],
    } as ModuleWithProviders;
  }
 }
