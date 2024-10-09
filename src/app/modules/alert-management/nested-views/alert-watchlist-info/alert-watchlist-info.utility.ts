  export namespace AlertWatchlistInfoUtility {

    export function flattenWatchlistInformation(obj: Object, parentKey?: string) {
      let result = {};
  
      if (typeof obj === "object" && obj) {
        Object.keys(obj).forEach((key) => {
          const value = obj[key];
          
          const key_with_underscore = parentKey ? parentKey : key;
  
          let _key = key_with_underscore.replace(/_/g, ' ');
  
          if (typeof value === "object") {
            result = {
              ...result,
              ...this.flattenWatchlistInformation(value, _key),
            };
          } else {
            result[_key] = value;
          }
        });
  
        return result;
      }
    }
  }
