import * as moment from "moment";
import { AlertGeneralInfoTypes } from './alert-general-info.types'

export namespace AlertGeneralInfoUtility {

  export function AttributeNameMapper(attribute, entityType, attributesDisplayNameMapping) {
    let attributeName
    if ((entityType && entityType.toLowerCase() == 'person')) {
      if (attributesDisplayNameMapping.person && attributesDisplayNameMapping.person[attribute]) {
        attributeName = attributesDisplayNameMapping.person[attribute];
      }
      else {
        attributeName = attribute.replace(/_/g, " ");       // replace underscore with blank space
      }
    }
    else {
      if (attributesDisplayNameMapping.Organization && attributesDisplayNameMapping.Organization[attribute]) {
        attributeName = attributesDisplayNameMapping.Organization[attribute];
      }
      else {
        attributeName = attribute.replace(/_/g, " ");        // replace underscore with blank space
      }
    }
    return attributeName
  }

  export function recordInfoFormatter(attribute, recordValue) {

    switch (attribute.toLowerCase().trim()) {
      case AlertGeneralInfoTypes.Schema.legal_type:
        return dataSchema.legal_type(recordValue);

      case AlertGeneralInfoTypes.Schema.city_of_birth:
        return dataSchema.place_of_birth(recordValue);

      case AlertGeneralInfoTypes.Schema.birthPlace:
        return dataSchema.place_of_birth(recordValue);

      case AlertGeneralInfoTypes.Schema.home_location:
        return dataSchema.home_location(recordValue);

      case AlertGeneralInfoTypes.Schema.works_for:
        return dataSchema.comman(recordValue);

      case AlertGeneralInfoTypes.Schema.alumni_of:
        return dataSchema.comman(recordValue);

      case AlertGeneralInfoTypes.Schema.business_classifier:
        return dataSchema.business_classifier(recordValue);

      case AlertGeneralInfoTypes.Schema.address:
        return dataSchema.address(recordValue);

      case AlertGeneralInfoTypes.Schema.identifiers:
        return dataSchema.identifiers(recordValue);

      case AlertGeneralInfoTypes.Schema.date_of_birth:
        return dataSchema.date_of_birth(recordValue);

      default:
        return dataSchema.default(recordValue);
    }
  }

  export function matchInfoFormatter(attribute, matchValue) {
    switch (attribute.toLowerCase().trim()) {
      case AlertGeneralInfoTypes.Schema.date_of_birth:
        return dataSchema.date_of_birth(matchValue);

      case AlertGeneralInfoTypes.Schema.address:
        return dataSchema.address(matchValue);

      default:
        return dataSchema.default(matchValue);
    }
  }

  export function getConfidencePercentage(num) {
    if (num && num <= 1) {
      num = parseFloat(num) * 100
      return num.toFixed(2);
    }
    return num;
  }

  const dataSchema = {
    legal_type: (value) => {
      if (value && typeof value == 'object' && !Array.isArray(value)) {
        let returnValue = "";
        if (value.code) {
          returnValue = value.code + " : ";
        }
        if (value.label) {
          returnValue = returnValue + value.label;
        }
        return returnValue;
      }
    },

    business_classifier: (value) => {
      if (Array.isArray(value)) {
        let classifiers = [];
        value.forEach((item) => {
          let returnValue = "";
          if (item.code) {
            returnValue = item.code + " : ";
          }
          if (item.label) {
            returnValue = returnValue + item.label;
          }
          classifiers.push(returnValue)

        })
        return simpleArrayFormatter(classifiers);
      }
    },

    address: (value) => {
      if (value) {
        let addresses = [];
        if (Array.isArray(value) && value.length >= 0) {
          value.forEach((item) => {
            let address = [];
            if (typeof item == "object" && !Array.isArray(item)) {
              if (item.street_address && typeof item.street_address == "string" && item.street_address.trim().length > 0) {
                address.push(item.street_address)
              }
              if (item.address_locality && typeof item.address_locality == "string" && item.address_locality.trim().length > 0) {
                address.push(item.address_locality);
              }
              if (item.locality && typeof item.locality == "string" && item.locality.trim().length > 0) {
                address.push(item.locality);
              }
              if (item.city && typeof item.city == "string" && item.city.trim().length > 0) {
                address.push(item.city)
              }
              if (item.region && typeof item.region == "string" && item.region.trim().length > 0) {
                address.push(item.region);
              }
              if (item.country && typeof item.country == "string" && item.country.trim().length > 0) {
                address.push(item.country)
              }
              if (item.zip && typeof item.zip == "string" && item.zip.trim().length > 0) {
                address.push(item.zip)
              }
              if (item.postal_code && typeof item.postal_code == "string" && item.postal_code.trim().length > 0) {
                address.push(item.postal_code)
              }
              addresses.push(address.join(" "));
            }
          });
          return simpleArrayFormatter(addresses);
        }
        else {
          return value;
        }
      }
      else {
        return 'N/A';
      }
    },

    place_of_birth: (value) => {
      if (Array.isArray(value)) {
        return simpleArrayFormatter(value)
      }
      else if (value) {
        if (typeof value == 'string') {
          return value;
        }
        else if (typeof value == 'object') {
          let address = [];
          if (value.locality) {
            address.push(value.locality);
          }
          if (value.region) {
            address.push(value.region);
          }
          if (value.country) {
            address.push(value.country);
          }
          return address.join(", ");
        }
        else {
          return "N/A";
        }
      } else {
        return "N/A";
      }
    },

    identifiers: (value) => {
      if (value) {
        let identifiers = [];
        if (Array.isArray(value) && value.length >= 0) {
          value.forEach((item) => {
            let identifiersObj = [];
            if (typeof item == "object" && !Array.isArray(item)) {
              if (item.id_type && typeof item.id_type == "string" && item.id_type.trim().length > 0) {
                identifiersObj.push(item.id_type)
              }
              if (item.id_value && typeof item.id_value == "string" && item.id_value.trim().length > 0) {
                identifiersObj.push(item.id_value);
              }
              identifiers.push(identifiersObj.join(", "));
            }
          });
          return simpleArrayFormatter(identifiers);
        }
        else {
          return value;
        }
      }
      else {
        return 'N/A';
      }
    },

    home_location: (value) => {
      if (value) {
        if (Array.isArray(value)) {
          return simpleArrayFormatter(value);
        }
        else if (typeof value == 'object') {
          let items = [];
          if (value.address) {
            if (value.address.street_address && typeof value.address.street_address == "string" && value.address.street_address.trim().length > 0) {
              items.push(value.address.street_address)
            }
            if (value.address.locality) {
              items.push(value.address.locality);
            }
            if (value.address.address_locality && typeof value.address.address_locality == "string" && value.address.address_locality.trim().length > 0) {
              items.push(value.address.address_locality);
            }
            if (value.address.city && typeof value.address.city == "string" && value.address.city.trim().length > 0) {
              items.push(value.address.city)
            }
            if (value.address.region && typeof value.address.region == "string" && value.address.region.trim().length > 0) {
              items.push(value.address.region);
            }
            if (value.address.country && typeof value.address.country == "string" && value.address.country.trim().length > 0) {
              items.push(value.address.country);
            }
            if (value.address.postal_code && typeof value.address.postal_code == "string" && value.address.postal_code.trim().length > 0) {
              items.push(value.address.postal_code);
            }
            if (value.address.zip && typeof value.address.zip == "string" && value.address.zip.trim().length > 0) {
              items.push(value.address.zip);
            }
            return items.join(", ");
          }
        }
        else {
          return value;
        }
      }
      else {
        return 'N/A';
      }
    },

    comman: (value) => {
      if (value) {
        return value.join(", ")
      }
      else {
        return 'N/A';
      }
    },

    date_of_birth: (value) => {
      let date = simpleArrayFormatter(value) && simpleArrayFormatter(value).includes('-') ? moment(simpleArrayFormatter(value)).format('DD/MM/YYYY') : simpleArrayFormatter(value)
      return date;
    },

    default: (value) => {
      if (value) {
        if (typeof value == "string") {
          return value;
        } else if (typeof value == 'number') {
          return value;
        }
        else if (Array.isArray(value)) {
          return simpleArrayFormatter(value);
        } else {
          let result = '';
          if (value.address) {
            for (let key in value.address) {
              result = result + (key + ':' + value.address[key]) + ', '
            }
            return result.slice(0, -2);
          }
          else if (value.overview) {
            for (let key in value.overview) {
              result = result + (key + ':' + value.overview[key]) + ', '
            }
            return result.slice(0, -2);
          }
        }
      } else {
        return 'N/A';
      }
    }
  }

  function simpleArrayFormatter(value) {
    let values = [];
    if (value) {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item && typeof item == 'string' && item.trim().length > 0 && values.indexOf(item) == -1) {
            values.push(item)
          }
        });
        return values.join(", ");
      }
      else if (typeof value == 'string') {
        return value;
      }
      else if (typeof value == 'object') {
        simpleJsonFormater(value)
      }
    }
    else {
      return 'N/A';
    }
  }

  function simpleJsonFormater(value, sep = ",") {
    const capitalize = (s) => {
      if (typeof s !== 'string') return ''
      return s.charAt(0).toUpperCase() + s.slice(1)
    }
    if (value) {
      if (typeof value == "object") {
        let returnValue = [];
        let keys = Object.keys(value);
        keys.forEach((key) => {
          if (value[key] && typeof value[key] == 'string' && value[key].trim().length > 0) {
            returnValue.push(capitalize(key.replace(/_/g, " ")) + " : " + value[key]);
          }
        })
        return returnValue.join(sep);
      }
      else {
        return value;
      }
    }
    else {
      return 'N/A';
    }
  }

}