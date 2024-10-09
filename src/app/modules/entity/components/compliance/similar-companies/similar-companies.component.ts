import { Component, OnInit } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

import { EntityCommonTabService } from '@app/modules/entity/services/entity-common-tab.service';
import { VLA } from '../../../../../modules/entity/constants/similar-companies'
import { LoadEntityNetworkChartModule } from '../../../../../shared/charts/networkChartEntity.js'

@AutoUnsubscribe()
@Component({
  selector: 'app-similar-companies',
  templateUrl: './similar-companies.component.html',
  styleUrls: ['./similar-companies.component.scss']
})
export class SimilarCompaniesComponent implements OnInit {

  public vlaZoomIn = 0;
  public vlaChartLoader: boolean = false;
  graphData = {
    nodes: [],
    edges: []
  }
  productsIds = 0;
  compId =1100123;
  edges = [];
  nodes = [];
  productData = [];
  similarCompanyNodes = [];
  similarCompanies: any = [];
  existingCompanies: any = {};
  showEnitytNetwork = false;
  clientName
  constructor(public entityCommonTabService: EntityCommonTabService) { }

  ngOnInit() {
    this.entityCommonTabService.sourceTargetDetails.subscribe(data => {
      if (Object.keys(data).length > 0) {
        for (let companies of data.results) {
          if (companies.overview.comapnyInfo.isSimilarTo) {
            this.similarCompanies = JSON.parse(companies.overview.comapnyInfo.isSimilarTo.value);
            this.clientName = companies.overview.comapnyInfo['vcard:organization-name'].value;
          }
        }
        this.existingCompanies = data.customerInfoSimilarCompData;
        this.loadEntityGraphData(this.existingCompanies, this.similarCompanies);
      }
    })
  }

  ngOnDestroy() {
  }

  // method to get entity network data
  loadEntityGraphData(existingCompanies, similarCompanies) {
    this.vlaChartLoader = true;
    let data = {
      "fetchers": ["1008", "1006", "1013", "1021"],
      // "fetchers": ["32", "34", "35"],
      "keyword": "adidas AG",
      "layout": "cise",//"concentric"//cise
      "searchType": "Company",
      "lightWeight": true,
      "limit": 2,
      "iterations": 1,
      "alias": "Stock",
      "create_new_graph": false,
      "requires_expansion": true,
      "entity_resolution": true,
      "expansion_fetchers_lightweight": true,
      "expansion_fetchers": ["1005", "1009", "1010", "1011", "1012"]
    };
    let vlaData = VLA;
    let options = {
      data: vlaData,
      id: 'VLA',
      layouts: data,
      vlaDataType: 'companyVla'
    }

    // for both existingCompanies and similarCompanies data
    if (Object.keys(existingCompanies).length > 0 && (similarCompanies !== null && similarCompanies !== undefined && similarCompanies !== '' && Object.keys(similarCompanies).length > 0)) {
      if (existingCompanies.clientName) {
        this.nodes.push({
          data: {
            id: existingCompanies.internalId,
            rootval: "rootva",
            labelV: "rootva",
            name: existingCompanies.clientName
          }
        })
      }

      for (let companies of similarCompanies) {
        this.similarCompanyNodes.push({
          id: this.productsIds += 1,
          address: companies.address,
          name: companies.name
        })
      }

      for (let companyData of this.similarCompanyNodes) {
        this.nodes.push({
          data: {
            id: companyData.id,
            name: companyData.name,
            address: companyData.address,
            labelV: "similarCompany"
          }
        })
        this.edges.push({
          data: {
            source: existingCompanies.internalId,
            target: companyData.id,
            labelE: "children"
          }
        })
      }

      if (existingCompanies.existingSimilarCompanies) {
        for (let data of existingCompanies.existingSimilarCompanies) {
          this.nodes.push({
            data: {
              labelV: "company",
              address: data.address,
              name: data.companyName,
              id: data.internalId,
              value: {
                "entity_type": "Company"
              }
            }
          })

          this.edges.push({
            data: {
              source: existingCompanies.internalId,
              target: data.internalId,
              labelE: "children",
            }
          })
          for (let products of data.products) {
            this.productData.push({
              internalId: data.internalId,
              product: {
                name: products.productName,
                startDate: products.startDate,
                expirationDate: products.expirationDate,
                price: products.price,
                id: this.productsIds += 1,
               
              }
            })
          }
        }
      }

      for (let productEdge of this.productData) {
        this.nodes.push({
          data: {
            id: productEdge.product.id,
            labelV: "product",
            name: productEdge.product.name,
            startDate: productEdge.product.startDate,
            expirationDate: productEdge.product.expirationDate,
            price: productEdge.product.price
          }
        })
        this.edges.push({
          data: {
            source: productEdge.internalId,
            target: productEdge.product.id,
            labelE: "children"
          }
        })
      }
      this.graphData.nodes = this.nodes;
      this.graphData.edges = this.edges;
      LoadEntityNetworkChartModule.loadEntityNetworkChart(this.graphData, options, "adidas AG", options.layouts.layout, options.vlaDataType);
      // for similarCompanies only
    } else if (similarCompanies !== null && similarCompanies !== undefined && similarCompanies !== '' && Object.keys(similarCompanies).length > 0) {
      // for (let companies of similarCompanies) { 
      //   this.similarCompanyNodes.push({
      //     id: this.productsIds += 1,
      //     address: companies.address,
      //     name: companies.name
      //   })
      // }

      if (this.clientName) {
        this.nodes.push({
          data: {
            id: this.compId,
            rootval: "rootva",
            labelV: "rootva",
            name: this.clientName
          }
        })
      }

      for (let companies of similarCompanies) {
        this.similarCompanyNodes.push({
          id: this.productsIds += 1,
          address: companies.address,
          name: companies.name
        })
      }

      for (let companyData of this.similarCompanyNodes) {
        this.nodes.push({
          data: {
            id: companyData.id,
            name: companyData.name,
            address: companyData.address,
            labelV: "similarCompany"
          }
        })
        this.edges.push({
          data: {
            source: this.compId,
            target: companyData.id,
            labelE: "children"
          }
        })
      }
      // for (let companyData of this.similarCompanyNodes) {
      //   this.nodes.push({
      //     data: {
      //       id: companyData.id,
      //       name: companyData.name,
      //       address: companyData.address,
      //       labelV: "similarCompany",
      //       // rootval: "rootva",
      //       // labelV: "rootva",
      //     }
      //   })
      // }
      this.graphData.nodes = this.nodes;
      this.graphData.edges = this.edges;
      LoadEntityNetworkChartModule.loadEntityNetworkChart(this.graphData, options, "adidas AG", options.layouts.layout, options.vlaDataType);
      // for existingCompanies only
    } else if (Object.keys(existingCompanies).length > 0) {
      if (existingCompanies.clientName) {
        this.nodes.push({
          data: {
            id: existingCompanies.internalId,
            rootval: "rootva",
            labelV: "rootva",
            name: existingCompanies.clientName
          }
        })
      }
      if (existingCompanies.existingSimilarCompanies) {
        for (let data of existingCompanies.existingSimilarCompanies) {
          this.nodes.push({
            data: {
              labelV: "company",
              address: data.address,
              name: data.companyName,
              id: data.internalId,
              value: {
                "entity_type": "Company"
              }
            }
          })

          this.edges.push({
            data: {
              source: existingCompanies.internalId,
              target: data.internalId,
              labelE: "children",
            }
          })

          for (let products of data.products) {
            this.productData.push({
              internalId: data.internalId,
              product: {
                name: products.productName,
                startDate: products.startDate,
                expirationDate: products.expirationDate,
                id: this.productsIds += 1,
                price: products.price
              }
            })
          }
        }
      }

      for (let productEdge of this.productData) {
        this.nodes.push({
          data: {
            id: productEdge.product.id,
            labelV: "product",
            name: productEdge.product.name,
            startDate: productEdge.product.startDate,
            expirationDate: productEdge.product.expirationDate,
            price: productEdge.product.price,
          }
        })
        this.edges.push({
          data: {
            source: productEdge.internalId,
            target: productEdge.product.id,
            labelE: "children"
          }
        })
      }
      this.graphData.nodes = this.nodes;
      this.graphData.edges = this.edges;
      LoadEntityNetworkChartModule.loadEntityNetworkChart(this.graphData, options, "adidas AG", options.layouts.layout, options.vlaDataType);

    } else {
      this.showEnitytNetwork = true;
    }
  }

  zoomIn() {
    if (this.vlaZoomIn < 100) {
      this.vlaZoomIn = this.vlaZoomIn + 1
    }
  }

  vlaZoomOut() {
    if (this.vlaZoomIn >= 0) {
      this.vlaZoomIn = this.vlaZoomIn - 1
    }
  }

}
