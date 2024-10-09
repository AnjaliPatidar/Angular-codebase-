import { InjectionToken, TemplateRef } from '@angular/core';

export class ToastData {
  type: ToastType;
  text?: string;
  template?: TemplateRef<any>;
  undo?: boolean;
  templateContext?: {};
  undoFN(callback?: (n: number) => any): void {
      callback(42);
  }
}

export type ToastType = 'warning' | 'info' | 'success' | 'danger';

export interface ToastConfig {
    position?: {
        top: number;
        right: number;
    };
    animation?: {
        fadeOut: number;
        fadeIn: number;
    };
}

export const defaultToastConfig: ToastConfig = {
    position: {
        top: 80,
        right: 20,
    },
    animation: {
        fadeOut: 3000,
        fadeIn: 300,
    },
};

export const TOAST_CONFIG_TOKEN = new InjectionToken('toast-config');