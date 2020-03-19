import { CapitalizePipe } from './pipes/capitalize.pipe';
import { DEFAULT_THEME } from './styles/theme.default';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbThemeModule } from '@nebular/theme';

const PIPES = [
  CapitalizePipe,
];

@NgModule({
  declarations: [ ...PIPES, ],
  imports: [ CommonModule ]
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
