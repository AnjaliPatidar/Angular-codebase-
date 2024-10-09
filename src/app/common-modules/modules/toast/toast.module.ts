import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastComponent } from './toast.component';
import { MatIconModule } from '@angular/material/icon';
import { defaultToastConfig, TOAST_CONFIG_TOKEN } from './toast.model';
import { OverlayModule } from '@angular/cdk/overlay';


@NgModule({
  declarations: [ToastComponent],
  imports: [
    CommonModule,
    MatIconModule,
    OverlayModule
  ],
  entryComponents: [ToastComponent]
})
export class ToastModule {
  public static forRoot(config = defaultToastConfig): ModuleWithProviders<ToastModule> {
    return {
      ngModule: ToastModule,
      providers: [
        {
          provide: TOAST_CONFIG_TOKEN,
          useValue: { ...defaultToastConfig, ...config },
        },
      ],
    };
  }
}
