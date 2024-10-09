export class AppConstants {
  public static paths = localStorage.getItem("paths") ? JSON.parse(localStorage.getItem("paths")) : null;
  /**
   * Local : http://localhost:8080/ehubui
   */
  public static rootPath = AppConstants.paths && AppConstants.paths.EHUB_FE_API ? AppConstants.paths.EHUB_FE_API : 'http://localhost:8080/ehubui/';
  public static Ehub_Rest_API = AppConstants.paths && AppConstants.paths.EHUB_API ? AppConstants.paths.EHUB_API : 'http://localhost:8080/ehubrest/api/';
  public static Ehub_UI_API = AppConstants.paths && AppConstants.paths.EHUB_FE_API ? AppConstants.paths.EHUB_FE_API : 'http://localhost:8080/ehubui/';
  // public static KYC_QUESTIONNAIRE_PATH = 'http://188.166.40.105/element-questionnaire-builder/index.php/admin';
  // public static POLICY_ENFORCEMENT_PATH = 'http://188.166.40.105:7070/policyEnforcement';
  public static KYC_QUESTIONNAIRE_PATH = AppConstants.paths && AppConstants.paths.KYC_QUESTIONNAIRE_PATH ? AppConstants.paths.KYC_QUESTIONNAIRE_PATH : 'http://188.166.40.105/element-questionnaire-builder/index.php/admin';
  public static POLICY_ENFORCEMENT_PATH = AppConstants.paths && AppConstants.paths.POLICY_ENFORCEMENT_PATH ? AppConstants.paths.POLICY_ENFORCEMENT_PATH : 'http://188.166.40.105:7070/policyEnforcement';
  public static ACTIVITI_FE_PATH = AppConstants.paths && AppConstants.paths.ACTIVITI_FE_PATH ? AppConstants.paths.ACTIVITI_FE_PATH : 'http://localhost:8080/activiti-app/#/';
  public static Ehubui_token = localStorage.getItem("ehubObject") && JSON.parse(localStorage.getItem("ehubObject")).token ? JSON.parse(localStorage.getItem("ehubObject")).token : "e58bc382-87ef-4670-a86b-7afd3eb75a15";
  public static domainSelected = localStorage.getItem("domain") ? localStorage.getItem("domain") : "FINANCIAL CRIME";
  public static Generate_report_Survey_URL = 'http://159.65.192.32/element-questionnaire-builder/index.php/{serveyID}?newtest=Y&lang=en';
  public static Document_FE = AppConstants.paths.DOCUMENT_FE;
  public static Document_API = AppConstants.paths && AppConstants.paths.DOCUMENT_API ? AppConstants.paths.DOCUMENT_API : 'https://dkn8vl3sfj.execute-api.eu-west-1.amazonaws.com/dev3/v1/documents/';
  public static Tag_API = AppConstants.paths && AppConstants.paths.TAG_API ? AppConstants.paths.TAG_API :'https://v9vkemadnf.execute-api.eu-west-1.amazonaws.com/dev3/v1/tags/';
  public static Case_New_API = AppConstants.paths && AppConstants.paths.CASE_API ? AppConstants.paths.CASE_API :'https://aps-cases-microservice-srv.qa-toronto.xara.ai/v1/case/';
  public static Cloud = AppConstants.paths && AppConstants.paths.CLOUD ? AppConstants.paths.CLOUD : 'AWS';
  public static List_FE = AppConstants.paths && AppConstants.paths.LIST_FE ? AppConstants.paths.LIST_FE :'https://wl-micro-frontend.dev-toronto.xara.ai/#/watchlists';
  public static Theme_API = AppConstants.paths && AppConstants.paths.THEME_API ? AppConstants.paths.THEME_API :'https://qxafnr2ks8.execute-api.eu-west-1.amazonaws.com/dev/getThemePreSignedUrl';
}
