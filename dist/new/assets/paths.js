var paths = {
  "AUTHENTICATION_URL": "{{AUTHENTICATION_URL}}",
  "AUTH_CLIENT_ID": "{{AUTH_CLIENT_ID}}",
  "X_API_KEY": "{{X_API_KEY}}",
  "MICRO_SERVICE_API": "{{MICRO_SERVICE_API}}/Prod/v1/",
  "EHUB_API": "{{EHUB_API}}/ehubrest/api/",
  "EHUB_FE_API": "{{EHUB_FE_API}}/",
  "EHUB_API_LOGIN": "{{EHUB_API}}/ehubrest/api/security/init",
  "TI_API": "{{TI_API}}/transaction/",
  "ACTIVITI_FE_PATH": "{{ACTIVITI_FE_PATH}}/elementbpm/#/",
  "KYC_QUESTIONNAIRE_PATH": "{{KYC_QUESTIONNAIRE_PATH}}/element-questionnaire-builder/index.php/admin",
  "POLICY_ENFORCEMENT_PATH": "{{POLICY_ENFORCEMENT_PATH}}/policyEnforcement/",
  "PROD_VERSION": "{{PROD_VERSION}}",
  "DEFAULT_LOCALIZATION" : "{{DEFAULT_LOCALIZATION}}",
  "DEFAULT_THEME" : "{{DEFAULT_THEME}}",
  "DEFAULT_LOGO" : "{{DEFAULT_LOGO}}",
  "TWO_WAY_AUTHENTICATION" : "{{TWO_WAY_AUTHENTICATION}}",
  "DOCUMENT_API" : "{{DOCUMENT_API}}/v1/documents/",
  "TAG_API" : "{{TAG_API}}/v1/tags/",
  "CASE_API": "{{CASE_API}}/v1/case/",
  "CLOUD": "{{CLOUD}}",
  "WEB_SOCKET_PATH": '{{WEB_SOCKET_PATH}}',
  "LIST_FE" : "{{LIST_FE}}",
  "THEME_API": "{{THEME_API}}",
  "DOCUMENT_FE" : "{{DOCUMENT_FE}}"
}

// var paths = {
//   "AUTHENTICATION_URL": "{{AUTHENTICATION_URL}}",
//   "AUTH_CLIENT_ID": "{{AUTH_CLIENT_ID}}",
//   "X_API_KEY": "{{X_API_KEY}}",
//   "MICRO_SERVICE_API": "{{MICRO_SERVICE_API}}/Prod/v1/",
//   "EHUB_API": "http://localhost:8080/ehubrest/api/",
//   "EHUB_FE_API": "http://localhost/",
//   "EHUB_API_LOGIN": "http://localhost:8080/ehubrest/api/security/init",
//   "TI_API": "{{TI_API}}/transaction/",
//   "ACTIVITI_FE_PATH": "{{ACTIVITI_FE_PATH}}/elementbpm/#/",
//   "KYC_QUESTIONNAIRE_PATH": "{{KYC_QUESTIONNAIRE_PATH}}/element-questionnaire-builder/index.php/admin",
//   "POLICY_ENFORCEMENT_PATH": "{{POLICY_ENFORCEMENT_PATH}}/policyEnforcement/",
//   "PROD_VERSION": "{{PROD_VERSION}}",
//   "DEFAULT_LOCALIZATION" : "{{DEFAULT_LOCALIZATION}}",
//   "DEFAULT_THEME" : "{{DEFAULT_THEME}}",
//   "DEFAULT_LOGO" : "{{DEFAULT_LOGO}}",
//   "TWO_WAY_AUTHENTICATION" : "{{TWO_WAY_AUTHENTICATION}}",
//   "DOCUMENT_API" : "{{DOCUMENT_API}}/v1/documents/",
//   "TAG_API" : "{{TAG_API}}/v1/tags/",
// }

//only set paths if they've been initialized
if (paths.EHUB_API.indexOf("{{") == -1) {
  window.localStorage.setItem("paths", (JSON.stringify(paths)));
}
