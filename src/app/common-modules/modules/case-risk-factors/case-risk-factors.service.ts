import { Injectable } from '@angular/core';
import { find } from 'lodash-es';

@Injectable({
  providedIn: 'root'
})
export class CaseRiskFactorsService {

  constructor() { }

  getRiskFlagsWithColorsFromFactors(riskFactors: any[], flagColors: any[]): {riskFlag: string, color: string , name: string}[] {
    return riskFactors.map((flagName) => {
      const color =(find(flagColors, {key: flagName && flagName.level ? flagName.level.toLowerCase() : ''}) || {color: '#007d5e' }).color;
      const riskFlag:string = flagName && flagName.flag  ? flagName.flag : null;
      const name:string = flagName && flagName.name  ? flagName.name : null;
      return {riskFlag, color , name}
    });
  }
}
