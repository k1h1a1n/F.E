"use strict";
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
exports.SignupWizardService = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var environment_1 = require("src/environments/environment");
var sha1 = require("js-sha1");
var pdfMake = require("pdfmake/build/pdfmake");
var pdfFonts = require("pdfmake/build/vfs_fonts");
// import { SelectImagesforPdfuploadComponent } from '../components/select-imagesfor-pdfupload/select-imagesfor-pdfupload.component';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
var SignupWizardService = /** @class */ (function () {
    function SignupWizardService(auth, navService, toastCtrl, Scan, 
    // tslint:disable-next-line: deprecation
    transfer, mediaCapture, storage, globalVariablesProvider, media, fileChooser, fileOpener, actionsheetCtrl, filePath, platform, loadingCtrl, camera, file, alertCtrl, router, modalCtrl, popOverCtrl, aes256) {
        var _this = this;
        this.auth = auth;
        this.navService = navService;
        this.toastCtrl = toastCtrl;
        this.Scan = Scan;
        this.transfer = transfer;
        this.mediaCapture = mediaCapture;
        this.storage = storage;
        this.globalVariablesProvider = globalVariablesProvider;
        this.media = media;
        this.fileChooser = fileChooser;
        this.fileOpener = fileOpener;
        this.actionsheetCtrl = actionsheetCtrl;
        this.filePath = filePath;
        this.platform = platform;
        this.loadingCtrl = loadingCtrl;
        this.camera = camera;
        this.file = file;
        this.alertCtrl = alertCtrl;
        this.router = router;
        this.modalCtrl = modalCtrl;
        this.popOverCtrl = popOverCtrl;
        this.aes256 = aes256;
        this.apiUrl = environment_1.environment.apiUrl;
        this.image = [];
        this.user = new rxjs_1.BehaviorSubject(['no-recepient']);
        this.share = this.user.asObservable();
        this.token = this.auth.getToken();
        this.auth.currentUser.subscribe(function (user) { return _this.userId = user._id; });
    }
    SignupWizardService.prototype.addUser = function (newUser) {
        this.user.next(newUser);
    };
    SignupWizardService.prototype.getUserToken = function () {
        // api call or token from storage
        return 'testtoken';
    };
    SignupWizardService.prototype.getFile = function (accessType) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (this.platform.is('ios')) {
                    window.FilePicker.pickFile(function (uri) {
                        _this.fileName = uri;
                        _this.filename = uri.substr(uri.lastIndexOf('/') + 1);
                        _this.name = _this.filename;
                        _this.fileUrl = _this.fileName;
                        // this.getFileSize (uri, accessType);
                        _this.navService.navigateForword('/upload-document');
                    }, function (error) {
                    }, function (sucess) {
                    });
                }
                else {
                    this.fileChooser.open()
                        .then(function (uri) {
                        _this.filePath.resolveNativePath(uri)
                            .then(function (resolveFilePath) {
                            // this.fileOpener.open(resolveFilePath, 'application/pdf').then(value => {
                            _this.fileDir = resolveFilePath;
                            _this.fileName = resolveFilePath.substring(resolveFilePath.lastIndexOf('/') + 1);
                            _this.name = _this.fileName; // alert('Selected Pdf file');
                            _this.fileUrl = _this.fileDir;
                            _this.file.resolveLocalFilesystemUrl(uri).then(function (fileEntry) {
                                fileEntry.file(function (fileObj) {
                                    var fileReader = new FileReader();
                                    fileReader.readAsText(fileObj);
                                    fileReader.onload = function (e) {
                                        _this.fileChecksumValue = sha1(fileReader.result);
                                    };
                                    // this.size = fileObj.size;
                                    _this.fileSize = (((fileObj.size / 1000) / 1000).toFixed(2));
                                    if (accessType === 'sign-up') {
                                        _this.navService.navigateForword('/upload-document');
                                    }
                                    else {
                                        _this.navService.navigateForword('/upload-document');
                                    }
                                });
                            });
                        })["catch"](function (err) {
                            // alert(JSON.stringify(err));
                            _this.alertDismissed();
                        });
                    });
                }
                return [2 /*return*/];
            });
        });
    };
    SignupWizardService.prototype.getFileSize = function (uri, accessType) {
        var _this = this;
        this.file.resolveLocalFilesystemUrl(uri).then(function (fileEntry) {
            fileEntry.file(function (fileObj) {
                var fileReader = new FileReader();
                fileReader.readAsText(fileObj);
                fileReader.onload = function (e) {
                    _this.fileChecksumValue = sha1(fileReader.result);
                };
                _this.size = fileObj.size;
                _this.fileSize = (((fileObj.size / 1000) / 1000).toFixed(2));
                if (accessType === 'sign-up') {
                    _this.navService.navigateForword('/upload-document');
                }
                else {
                    _this.navService.navigateForword('/upload-document');
                }
            });
        });
    };
    SignupWizardService.prototype.generateChecksum = function (file) {
        var _this = this;
        var fileReader = new FileReader();
        fileReader.onload = function (e) {
            _this.fileChecksumValue = sha1(fileReader.result);
        };
        fileReader.readAsText(file);
    };
    SignupWizardService.prototype.uploadCamScanPDF = function (fileDir, filename, blob) {
        var savedFileUrl = fileDir + filename;
        this.fileUrl = savedFileUrl;
        this.name = filename;
        this.navService.navigateForword('/upload-document');
    };
    SignupWizardService.prototype.chooseCameraType = function (type) {
        return __awaiter(this, void 0, void 0, function () {
            var actionSheet;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.actionsheetCtrl.create({
                            header: 'Choose Scanner type',
                            buttons: [{
                                    text: 'Camera',
                                    role: 'destructive',
                                    icon: 'camera',
                                    handler: function () {
                                        _this.takePhoto(type);
                                    }
                                }, {
                                    text: 'Camscanner',
                                    icon: 'image',
                                    handler: function () {
                                        _this.methodCallforPdf();
                                        // this.openGallery(type);
                                        // this.captureImage(1)
                                    }
                                }]
                        })];
                    case 1:
                        actionSheet = _a.sent();
                        return [4 /*yield*/, actionSheet.present()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SignupWizardService.prototype.methodCallforPdf = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.navService.navigateForword('/scanned-images-popover');
                return [2 /*return*/];
            });
        });
    };
    // captureImage(val) {
    //     const options = {
    //       sourceType : val,
    //       fileName : 'myfile',
    //       quality : 2.5,
    //       returnBase64 : true
    //     };
    //     this.Scan.scanDoc(options).then(data => {
    //       this.myData(data);
    //     });
    //   }
    SignupWizardService.prototype.addPhoto = function (type) {
        return __awaiter(this, void 0, void 0, function () {
            var actionSheet, actionSheet;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.platform.is('android')) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.actionsheetCtrl.create({
                                header: 'Albums',
                                buttons: [{
                                        text: 'Camera',
                                        role: 'destructive',
                                        icon: 'camera',
                                        handler: function () {
                                            // this.takePhoto(type);
                                            _this.chooseCameraType(type);
                                        }
                                    }, {
                                        text: 'Choose from gallery',
                                        icon: 'image',
                                        handler: function () {
                                            _this.openGallery(type);
                                        }
                                    }]
                            })];
                    case 1:
                        actionSheet = _a.sent();
                        return [4 /*yield*/, actionSheet.present()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 3: return [4 /*yield*/, this.actionsheetCtrl.create({
                            header: 'Select Image source',
                            buttons: [{
                                    text: 'Load from Library',
                                    handler: function () {
                                        _this.takePictureiOS(_this.camera.PictureSourceType.PHOTOLIBRARY, type);
                                    }
                                },
                                {
                                    text: 'Use Camera',
                                    handler: function () {
                                        _this.takePictureiOS(_this.camera.PictureSourceType.CAMERA, type);
                                    }
                                }, {
                                    text: 'Cancel',
                                    role: 'cancel'
                                }]
                        })];
                    case 4:
                        actionSheet = _a.sent();
                        return [4 /*yield*/, actionSheet.present()];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    SignupWizardService.prototype.takePhoto = function (type) {
        var _this = this;
        this.selImage = true;
        var options = { limit: 1, saveToPhotoAlbum: false };
        this.mediaCapture.captureImage(options)
            .then(function (imageData) {
            var i, path, len;
            for (i = 0, len = imageData.length; i < len; i += 1) {
                path = imageData[i].fullPath;
                _this.size = imageData[i].size;
            }
            _this.fileName = path;
            _this.filename = path.substr(path.lastIndexOf('/') + 1);
            _this.name = _this.filename;
            _this.fileUrl = _this.fileName;
            //  let fhgg= path.size;
            _this.file.resolveLocalFilesystemUrl(path).then(function (fileEntry) {
                fileEntry.file(function (fileObj) {
                    _this.generateChecksum(fileObj);
                    _this.size = fileObj.size;
                    _this.fileSize = (((fileObj.size / 1000) / 1000).toFixed(2));
                    // this.navService.navigateForword('/upload-document');
                    if (type === 'profilePic') {
                        _this.navService.navigateForword('/upload-profilePic');
                    }
                    else {
                        _this.navService.navigateForword('/upload-document');
                    }
                });
            });
        }, function (err) {
            _this.alertDismissed();
        });
    };
    SignupWizardService.prototype.openGallery = function (type) {
        var _this = this;
        this.selImage = false;
        var options = {
            destinationType: this.camera.DestinationType.FILE_URI,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM
        };
        this.camera.getPicture(options)
            .then(function (imageUrl) {
            _this.filePath.resolveNativePath(imageUrl)
                .then(function (resolveFilePath) {
                _this.fileDir = resolveFilePath;
                _this.fileName = resolveFilePath.substring(resolveFilePath.lastIndexOf('/') + 1);
                _this.name = _this.fileName;
                _this.fileUrl = _this.fileDir;
                _this.file.resolveLocalFilesystemUrl(imageUrl).then(function (fileEntry) {
                    fileEntry.file(function (fileObj) {
                        _this.generateChecksum(fileObj);
                        _this.size = fileObj.size;
                        _this.fileSize = (((fileObj.size / 1000) / 1000).toFixed(2));
                        if (type === 'profilePic') {
                            _this.navService.navigateForword('/upload-profilePic');
                        }
                        else {
                            _this.navService.navigateForword('/upload-document');
                        }
                    });
                });
            });
        }, function (err) {
            _this.alertDismissed();
        });
    };
    SignupWizardService.prototype.takePictureiOS = function (sourceType, type) {
        var _this = this;
        var options = {
            quality: 100,
            sourceType: sourceType,
            saveToPhotoAlbum: false,
            correctOrientation: true
        };
        this.camera.getPicture(options).then(function (imagePath) {
            var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
            var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
            // this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
            _this.fileName = correctPath;
            _this.filename = currentName;
            _this.name = _this.filename;
            _this.fileUrl = _this.fileName;
            _this.file.resolveLocalFilesystemUrl(imagePath).then(function (fileEntry) {
                fileEntry.file(function (fileObj) {
                    _this.generateChecksum(fileObj);
                    _this.size = fileObj.size;
                    _this.fileSize = (((fileObj.size / 1000) / 1000).toFixed(2));
                    // this.navService.navigateForword('/upload-document');
                    if (type === 'profilePic') {
                        _this.navService.navigateForword('/upload-profilePic');
                    }
                    else {
                        _this.navService.navigateForword('/upload-document');
                    }
                });
            });
        });
    };
    SignupWizardService.prototype.presentToast = function (msg) {
        return __awaiter(this, void 0, void 0, function () {
            var toast;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.toastCtrl.create({
                            message: msg,
                            duration: 3000
                        })];
                    case 1:
                        toast = _a.sent();
                        toast.present();
                        return [2 /*return*/];
                }
            });
        });
    };
    SignupWizardService.prototype.addVideo = function (acessType) {
        return __awaiter(this, void 0, void 0, function () {
            var actionSheet, actionSheet;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.platform.is('android')) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.actionsheetCtrl.create({
                                header: 'Albums',
                                buttons: [{
                                        text: 'Capture Video',
                                        role: 'destructive',
                                        icon: 'camera',
                                        handler: function () {
                                            _this.captureVideo(acessType);
                                        }
                                    }, {
                                        text: 'Choose from gallery',
                                        icon: 'image',
                                        handler: function () {
                                            _this.selectVideo(acessType);
                                        }
                                    }]
                            })];
                    case 1:
                        actionSheet = _a.sent();
                        return [4 /*yield*/, actionSheet.present()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 3: return [4 /*yield*/, this.actionsheetCtrl.create({
                            header: 'Select Video source',
                            buttons: [{
                                    text: 'Load from Library',
                                    handler: function () {
                                        _this.selectVideoiOS(_this.camera.PictureSourceType.PHOTOLIBRARY, acessType);
                                    }
                                },
                                {
                                    text: 'Use Camera',
                                    handler: function () {
                                        _this.captureVideoiOS(_this.camera.PictureSourceType.CAMERA, acessType);
                                    }
                                }, {
                                    text: 'Cancel',
                                    role: 'cancel'
                                }]
                        })];
                    case 4:
                        actionSheet = _a.sent();
                        return [4 /*yield*/, actionSheet.present()];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    SignupWizardService.prototype.captureVideo = function (acessType) {
        var _this = this;
        this.selVideo = false;
        var options = { limit: 1, saveToPhotoAlbum: false };
        this.mediaCapture.captureVideo(options)
            .then(function (videodata) {
            var i, path, len;
            for (i = 0, len = videodata.length; i < len; i += 1) {
                path = videodata[i].fullPath;
            }
            _this.fileName = path;
            _this.filename = path.substr(path.lastIndexOf('/') + 1);
            _this.name = _this.filename;
            _this.fileUrl = _this.fileName;
            _this.fileSize = path.size;
            _this.file.resolveLocalFilesystemUrl(path).then(function (fileEntry) {
                fileEntry.file(function (fileObj) {
                    _this.size = fileObj.size;
                    _this.fileSize = (((fileObj.size / 1000) / 1000).toFixed(2));
                    if (acessType === 'sign-up') {
                        _this.navService.navigateForword('/upload-documents');
                    }
                    else {
                        _this.navService.navigateForword('/upload-document');
                    }
                });
            });
        }, function (err) {
            _this.alertDismissed();
        });
    };
    SignupWizardService.prototype.selectVideo = function (acessType) {
        var _this = this;
        this.selVideo = true;
        var options = {
            destinationType: this.camera.DestinationType.FILE_URI,
            mediaType: this.camera.MediaType.VIDEO,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
        };
        this.camera.getPicture(options)
            .then(function (videoUrl) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.makeFileIntoBlob(videoUrl);
                return [2 /*return*/];
            });
        }); }, function (err) {
            _this.alertDismissed();
        });
    };
    SignupWizardService.prototype.selectVideoiOS = function (sourceType, type) {
        var _this = this;
        var options = {
            quality: 100,
            destinationType: this.camera.DestinationType.FILE_URI,
            mediaType: this.camera.MediaType.VIDEO,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            saveToPhotoAlbum: false,
            correctOrientation: true
        };
        this.camera.getPicture(options).then(function (videoUrl) {
            _this.name = videoUrl.substring(videoUrl.lastIndexOf('/') + 1);
            _this.fileUrl = videoUrl.substring(0, videoUrl.lastIndexOf('/') + 1);
            _this.navService.navigateForword('/upload-document');
            // this.makeFileIntoBlob(videoUrl);
        }, function (err) {
        });
    };
    SignupWizardService.prototype.captureVideoiOS = function (sourceType, type) {
        var _this = this;
        var options = {
            limit: 1,
            saveToPhotoAlbum: false
        };
        this.mediaCapture.captureVideo(options).then(function (res) {
            var capturedFile = res[0];
            var fileName = capturedFile.name;
            var dir = capturedFile['localURL'].split('/');
            dir.pop();
            var fromDirectory = dir.join('/');
            var toDirectory = _this.file.documentsDirectory;
            _this.file.copyFile(fromDirectory, fileName, toDirectory, fileName).then(function (res) {
            }, function (err) {
                console.log('err: ', err);
            });
        }, function (err) { return console.error(err); });
    };
    SignupWizardService.prototype.makeFileIntoBlob = function (videoUrl) {
        var _this = this;
        var correctPath = 'file://' + videoUrl;
        this.file.resolveLocalFilesystemUrl(correctPath).then(function (fileEntry) {
            fileEntry.file(function (res) {
                _this.readFile(res);
                _this.fileSize = (((res.size / 1000) / 1000).toFixed(2));
                _this.name = res.name;
                _this.fileUrl = correctPath;
                _this.navService.navigateForword('/upload-document');
            });
        });
    };
    SignupWizardService.prototype.readFile = function (file) {
        if (file) {
            var reader_1 = new FileReader();
            reader_1.onloadend = function () {
                var blob = new Blob([reader_1.result], { type: file.type });
                blob.name = file.name;
                return blob;
            };
            reader_1.readAsArrayBuffer(file);
        }
    };
    SignupWizardService.prototype.presentAlert = function (msg) {
        return __awaiter(this, void 0, void 0, function () {
            var alert;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertCtrl.create({
                            message: msg,
                            buttons: ['OK']
                        })];
                    case 1:
                        alert = _a.sent();
                        return [4 /*yield*/, alert.present()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SignupWizardService.prototype.captureAudio = function (acessType) {
        var _this = this;
        var options = {
            limit: 1,
            saveToPhotoAlbum: false
        };
        this.mediaCapture.captureAudio(options)
            .then(function (audiodata) {
            var i, path, len;
            for (i = 0, len = audiodata.length; i < len; i += 1) {
                path = audiodata[i].fullPath;
            }
            _this.fileName = path;
            _this.filename = path.substr(path.lastIndexOf('/') + 1);
            _this.name = _this.filename;
            _this.fileUrl = _this.fileName;
            _this.file.resolveLocalFilesystemUrl(path).then(function (fileEntry) {
                fileEntry.file(function (fileObj) {
                    _this.size = fileObj.size;
                    _this.fileSize = (((fileObj.size / 1000) / 1000).toFixed(2));
                    if (acessType === 'sign-up') {
                        _this.navService.navigateForword('/upload-documents');
                    }
                    else {
                        _this.navService.navigateForword('/upload-document');
                    }
                });
            });
        }, function (err) {
            _this.alertDismissed();
        });
    };
    SignupWizardService.prototype.alertDismissed = function () {
        var newVar;
        newVar = window.navigator;
        newVar.notification.alert('Document couldnt be uploaded.', // the message
        function () { }, // a callback
        'Access Denied', // a title
        'OK' // the button text
        );
    };
    SignupWizardService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], SignupWizardService);
    return SignupWizardService;
}());
exports.SignupWizardService = SignupWizardService;
