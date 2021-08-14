"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.SignUpPage = void 0;
var http_1 = require("@angular/common/http");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var popover_for_advisor_verification_component_1 = require("src/app/shared/components/popover-for-advisor-verification/popover-for-advisor-verification.component");
var popover_for_client_advisorcode_component_1 = require("src/app/shared/components/popover-for-client-advisorcode/popover-for-client-advisorcode.component");
var SignUpPage = /** @class */ (function () {
    function SignUpPage(navService, authService, codeService, formBuilder, UploadDocumentsService, loaderCtrl, popOverCtrl, menuCtrl, camera, fileChooser, file, filePath, platform, apiService, loadingCtrl, http) {
        this.navService = navService;
        this.authService = authService;
        this.codeService = codeService;
        this.formBuilder = formBuilder;
        this.UploadDocumentsService = UploadDocumentsService;
        this.loaderCtrl = loaderCtrl;
        this.popOverCtrl = popOverCtrl;
        this.menuCtrl = menuCtrl;
        this.camera = camera;
        this.fileChooser = fileChooser;
        this.file = file;
        this.filePath = filePath;
        this.platform = platform;
        this.apiService = apiService;
        this.loadingCtrl = loadingCtrl;
        this.http = http;
        this.appName = 'Durity';
        this.passwordShown = false;
        this.passwordType = 'password';
        this.passwordIcon = 'eye-off';
        this.uploadImageName = '';
        this.Question = 'Are You a Financial Advisor ?';
        this.qNo = '1';
        this.isSignUpMode = false;
        this.btnColor = 'medium';
        this.questionOneBtn = 'medium';
        this.isFinancialAdvisor = false;
        this.isHaveCouponCode = false;
        this.isQuestion = '1';
        this.message = 'Please Enter Advisor/Bank Code.';
        this.isCorrectAdvisor = false;
        this.isDataNotNull = false;
        this.header = new http_1.HttpHeaders({
            'content-type': 'application/json'
        });
        this.countryCodes = this.codeService.getCountryCodes();
        this.selectedCountry = this.countryCodes[94];
        this.menuCtrl.swipeGesture(false);
        this.signUpForm = this.formBuilder.group({
            email: ['', [
                    forms_1.Validators.required,
                    forms_1.Validators.pattern(String.raw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["^(([^<>()[]\\.,;:s@\"]+(.[^<>()[]\\.,;:s@\"]+)*)|(\".+\"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$"], ["^(([^<>()\\[\\]\\\\.,;:\\s@\"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$"]))))
                ]],
            password: ['', [
                    forms_1.Validators.required,
                    forms_1.Validators.minLength(6)
                ]],
            name: ['', [
                    forms_1.Validators.required,
                    forms_1.Validators.pattern(String.raw(templateObject_2 || (templateObject_2 = __makeTemplateObject(["^[ +A-Za-z'-]+$"], ["^[ +A-Za-z'-]+$"]))))
                ]],
            telephoneNumber: ['', [
                    forms_1.Validators.required, forms_1.Validators.maxLength(15),
                    forms_1.Validators.pattern(String.raw(templateObject_3 || (templateObject_3 = __makeTemplateObject(["^[0-9]*$"], ["^[0-9]*$"]))))
                    //  Validators.pattern(String.raw`^(?:(?:\+|0{0,2})01(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){10}\d$`)
                ]],
            image: ['']
        });
    }
    SignUpPage.prototype.ngOnInit = function () {
    };
    SignUpPage.prototype.ionViewWillEnter = function () {
        this.menuCtrl.swipeGesture(false);
        this.menuCtrl.enable(false);
    };
    SignUpPage.prototype.onChange = function (event) {
        this.selectedCountry = event;
    };
    //    changeChkBx(value){
    //     this.checkBoxValue = !this.checkBoxValue
    //    }
    SignUpPage.prototype.register = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loader, credentials;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.signUpForm.valid) return [3 /*break*/, 3];
                        Object.keys(this.signUpForm.controls).forEach(function (key) {
                            return _this.signUpForm.get(key).setValue(_this.signUpForm.get(key).value.trim());
                        });
                        return [4 /*yield*/, this.loaderCtrl.create({
                                message: 'Please wait...'
                            })];
                    case 1:
                        loader = _a.sent();
                        return [4 /*yield*/, loader];
                    case 2:
                        (_a.sent()).present();
                        credentials = {
                            name: this.signUpForm.value.name,
                            email: this.signUpForm.value.email,
                            telephoneNumber: this.selectedCountry.Code + this.signUpForm.value.telephoneNumber,
                            password: this.signUpForm.value.password,
                            // isUserAnAdvisor: this.checkBoxValue,
                            createdByAdvisor: false
                        };
                        this.authService.attemptAuth('register', credentials).then(function (res) {
                            _this.loaderCtrl.dismiss();
                            //    if(this.checkBoxValue == true){
                            //     this.verifyAdvisorPopOver();
                            //    }else{
                            // this.clientPopoverForAdvisorCode();
                            // this.authService.presentToast('Registration Successfull!');
                            // this.UploadDocumentsService.createWillFile(this.signUpForm.value.name,this.signUpForm.value.email);
                            //  this.navService.navigateRoot('/add-contacts');typeof-user-selection
                            if (_this.FinancialAdvisorbase64Data !== (undefined || null || '') && _this.isFinancialAdvisor === true) {
                                _this.uploadAdvisorLogo();
                            }
                            _this.navService.navigateRoot('/add-contacts');
                            //    }
                        })["catch"](function (err) {
                            _this.loaderCtrl.dismiss();
                            _this.authService.presentToast('Error in Registering, Please try after sometime');
                        });
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SignUpPage.prototype.showPassword = function () {
        this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
        this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
    };
    SignUpPage.prototype.verifyAdvisorPopOver = function () {
        return __awaiter(this, void 0, void 0, function () {
            var popover;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.popOverCtrl.create({
                            component: popover_for_advisor_verification_component_1.PopoverForAdvisorVerificationComponent,
                            cssClass: 'verificatioAdvisor-popover',
                            backdropDismiss: false
                        })];
                    case 1:
                        popover = _a.sent();
                        return [4 /*yield*/, popover.present()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SignUpPage.prototype.clientPopoverForAdvisorCode = function () {
        return __awaiter(this, void 0, void 0, function () {
            var popover;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.popOverCtrl.create({
                            component: popover_for_client_advisorcode_component_1.PopoverForClientAdvisorcodeComponent,
                            cssClass: 'clientAdvisorCode-popover',
                            backdropDismiss: false
                        })];
                    case 1:
                        popover = _a.sent();
                        return [4 /*yield*/, popover.present()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SignUpPage.prototype.signUpWithGoogle = function () {
    };
    SignUpPage.prototype.goto = function (page) {
        switch (page) {
            case 'signIn':
                this.navService.navigateRoot('login');
                break;
            default:
                break;
        }
    };
    SignUpPage.prototype.userType = function (ev, qno) {
        if (ev === 'yes' && qno === '1') {
            this.Question = 'Are You a Financial Advisor ?';
            this.questionOneBtn = 'primary';
            this.isFinancialAdvisor = true;
            this.isHaveCouponCode = false;
            this.isQuestion = qno;
        }
        else if (ev === 'no' && qno === '1') {
            this.Question = 'Are You a Financial Advisor ?';
            this.btnColor = 'medium';
            this.questionOneBtn = 'medium';
            this.isQuestion = qno;
            this.isFinancialAdvisor = false;
            this.isHaveCouponCode = false;
        }
        else if (ev === 'no' && qno === '2') {
            this.Question = 'Do you have an Financial Advisor or Bank Code ?';
            this.questionOneBtn = 'medium';
            this.btnColor = 'medium';
            this.isQuestion = qno;
            this.isFinancialAdvisor = false;
            this.isHaveCouponCode = false;
            console.log(this.Question);
        }
        else if (ev === 'yes' && qno === '2') {
            this.Question = 'Do you have an Financial Advisor or Bank Code ?';
            this.btnColor = 'primary';
            this.isQuestion = qno;
            this.isFinancialAdvisor = false;
            this.isHaveCouponCode = true;
        }
    };
    SignUpPage.prototype.changeLogo = function () {
        var _this = this;
        this.fileChooser.open()
            .then(function (uri) {
            _this.filePath.resolveNativePath(uri)
                .then(function (resolveFilePath) { return __awaiter(_this, void 0, void 0, function () {
                var _a, filePathBasedOnOs, temp, imgName, nameFile, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = this;
                            return [4 /*yield*/, this.loadingCtrl.create({
                                    message: 'Uploading...'
                                })];
                        case 1:
                            _a.loader = _c.sent();
                            return [4 /*yield*/, this.loader];
                        case 2:
                            (_c.sent()).present();
                            this.fileDir = resolveFilePath;
                            this.fileName = resolveFilePath.substring(resolveFilePath.lastIndexOf('/') + 1);
                            this.name = this.fileName;
                            this.fileUrl = this.fileDir;
                            filePathBasedOnOs = this.fileUrl;
                            temp = filePathBasedOnOs.split('/');
                            imgName = temp.length - 1;
                            this.uploadImageName = temp[imgName];
                            this.loader.dismiss();
                            nameFile = temp.pop();
                            filePathBasedOnOs = decodeURI(temp.join('/') + '/');
                            _b = this;
                            return [4 /*yield*/, this.readFileAsBase64Data(filePathBasedOnOs, this.name)];
                        case 3:
                            _b.FinancialAdvisorbase64Data = _c.sent();
                            return [2 /*return*/];
                    }
                });
            }); })["catch"](function (err) { });
        });
    };
    SignUpPage.prototype.readFileAsBase64Data = function (filePathBasedOnOs, filename) {
        return __awaiter(this, void 0, void 0, function () {
            var base4Data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.file
                            .readAsDataURL(filePathBasedOnOs, filename)
                            .then(function (fnBase64Data) {
                            base4Data = fnBase64Data;
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, base4Data];
                }
            });
        });
    };
    SignUpPage.prototype.uploadAdvisorLogo = function () {
        var _this = this;
        console.log(this.companyNameInput, "ggggg", this.FinancialAdvisorbase64Data);
        var postData = {
            advisorUrl: this.FinancialAdvisorbase64Data,
            advisorLogoName: this.uploadImageName,
            advisorOrgName: this.companyNameInput
        };
        this.apiService.put('user/profile', { profile: postData }).subscribe(function (data) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        }); });
    };
    SignUpPage.prototype.moveToUploadAgain = function () {
        this.uploadImageName = '';
    };
    SignUpPage.prototype.verifyAdvisor = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loader_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.enteredCode.length > 4)) return [3 /*break*/, 2];
                        this.isCorrectAdvisor = true;
                        return [4 /*yield*/, this.loaderCtrl.create({
                                message: 'Please wait...'
                            })];
                    case 1:
                        loader_1 = _a.sent();
                        this.http
                            .post(this.apiService.apiUrl + "/user/verifyAdvisorCode", {
                            enteredCode: this.enteredCode
                        }, { headers: this.header })
                            .subscribe(function (data) {
                            if (data !== null) {
                                _this.isDataNotNull = false;
                                _this.IsAdvisorCode = data['profile'].name;
                                loader_1.dismiss();
                            }
                            else if (data === null) {
                                _this.isDataNotNull = true;
                                loader_1.dismiss();
                            }
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        this.isCorrectAdvisor = false;
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SignUpPage = __decorate([
        core_1.Component({
            selector: 'app-sign-up',
            templateUrl: './sign-up.page.html',
            styleUrls: ['./sign-up.page.scss']
        })
    ], SignUpPage);
    return SignUpPage;
}());
exports.SignUpPage = SignUpPage;
var templateObject_1, templateObject_2, templateObject_3;
