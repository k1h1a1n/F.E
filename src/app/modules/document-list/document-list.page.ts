import { Component, OnInit } from '@angular/core';
import { NavigationService, UserService } from '@durity/services';
import { MenuController, NavController, Events, AlertController, PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
import { GlobalVariablesService } from 'src/app/services/global-variables.service';
import { ApiService } from 'src/app/services/api.service';
import { ModalController} from '@ionic/angular';
import { DeletePopoverComponent } from 'src/app/shared/components/delete-popover/delete-popover.component';
import { DownloadDocumentService } from 'src/app/shared/services/download-document.service';
import { AuthService } from 'src/app/services/auth.service';
import { RecordsService } from '../../../app/shared/services/records.service';
import { Userrecords } from '../home/userrecords.model';
import { Subscription } from 'rxjs';
import { PopoverComponent } from './popover/popover.component';
@Component({
    selector: 'app-document-list',
    templateUrl: './document-list.page.html',
    styleUrls: ['./document-list.page.scss'],
})
export class DocumentListPage implements OnInit {
    attachments = [];
    signInType: string;
    isFincAdvisor: boolean = false;
    activeContactGroup  = 'group1';
    name ='Name';
    category ='Category';
    currentTab: string;
    currentTabs: string;
    searchTerm: string;
    searchTermname: string;
    public userrecord: Userrecords[] =[];
    public dataDisplay: Userrecords[] =[]
    dataDisplayNames = [];
    public recSub: Subscription;
    fromPopOver: string;

    constructor (
        public navService: NavigationService,
        private router: Router,
        public globalVariablesProvider: GlobalVariablesService,
        private apiService: ApiService,
        private auth: AuthService,
        private downloadDocumentService: DownloadDocumentService,
        private modalCtrl: ModalController,
        public recordService: RecordsService,
        public popover: PopoverController,
        public alertController: AlertController,

    ) {
        this.auth.currentUser.subscribe((user) => {
            this.isFincAdvisor = user.profile.isFinancialAdvisor;
        })
         // this.getAttachments();
    }
    ionViewWillEnter () {
        this.getAttachments();
        this.signInType = this.globalVariablesProvider.signInType;
        localStorage.setItem('currentTabs', 'Name');
    }
    ngOnInit () {
        // this.getAttachments();    
       

      this.recordService.getUserRecords();
      this.recSub = this.recordService.getRecordUpdateListener().subscribe((userrecord: Userrecords[]) => {
      this.userrecord = userrecord;
      this.dataDisplay=this.userrecord;
      });
      console.log(this.userrecord);
      console.log(this.dataDisplay)
    
    }

    choose(){
       if(localStorage.getItem('currentTabs')=='Category'){
        console.log('category'); 
        this.popOver();
       }else{
        console.log('name');
        this.goto('select-doc','Other')
       }
    }

    selectTab (index) {
        if (index === 1) {
            this.activeContactGroup = 'group' + index;
            const currentTab =  this.name;
            localStorage.setItem('currentTabs', currentTab);

        } else if (index === 2) {
            this.activeContactGroup = 'group' + index;
            const currentTab =  this.category;
            localStorage.setItem('currentTabs', currentTab);
        }
    }

    setFilteredItems() {
        this.dataDisplay = this.filterItems(this.searchTerm);
      }
    
      filterItems(searchTerm){
        return this.userrecord.filter((item) => {
        console.log(item)
        return  item.category.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
        });
      }

      setFilteredItemsname() {
        this.dataDisplayNames = this.filterItemsname(this.searchTermname);
      }
    
      filterItemsname(searchTerm){
        return this.attachments.filter((item) => {
          return item.filename.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
        });
      }  

    getAttachments () {
        this.apiService.get({ name: 'myFiles' }).subscribe(attachments => {
            this.attachments = [];
            if (this.isFincAdvisor == true) {
                let attLen = [];
                attLen = attachments;
                for (let i = 0; i < attLen.length; i++) {
                
                    // console.log(attachments[i]['advisorAccess']);
                    if(attachments[i]['advisorAccess'] == true || attachments[i]['advisorAccess'] == (undefined || null)){
                      console.log(attachments[i]['advisorAccess']);
                      this.attachments.push(attachments[i]);
                    }
                }
                this.dataDisplayNames = this.attachments;
            }else{
                this.attachments = attachments;
                this.dataDisplayNames = this.attachments;
            }
            console.log(this.attachments);
        }, error => {
        });

    }


    download (fileName, fileId, isEncrypted) {
        this.downloadDocumentService.downloadFile(fileName, fileId, isEncrypted);
    }
    goto (pageName, data?) {
        this.navService.goto(pageName, data);
    }

    addDocument () {
        this.navService.navigateForword('/select-doc');
    }

    viewDocument (index) {
        this.router.navigate(['/view-document', index]);
    }

    next () {
        this.navService.navigateRoot('/everything-set');
    }

    async popOver () {
        const popover = await this.popover.create({
          component: PopoverComponent,
          cssClass: 'add-category-class',
        });
        popover.onDidDismiss().then( (data: any) => {
          console.log(data);
          if(data !== undefined){
            console.log(data.data.frompopover);
          }
          this.fromPopOver = data.data.frompopover;
          const catrecord = {category: this.fromPopOver};
          this.recordService.postRecords(this.fromPopOver);
          console.log('from' + this.fromPopOver);
          // this.ionViewWillEnter();
          // this.getAttachments();
          this.recSub = this.recordService.getRecordUpdateListener().subscribe((userrecord: Userrecords[]) => {
            this.userrecord = userrecord;
            this.dataDisplay=this.userrecord;
            });
        });
        
        return await popover.present();
       
      }

    async deleteAttachment (fileId) {
        const modal = await this.modalCtrl.create({
            component: DeletePopoverComponent,
            cssClass: 'simple-delete-modal',
            componentProps: { deleteType: 'deleteAttachment', fileId }
        });
        await modal.present();
        const { } = await modal.onWillDismiss();
        this.getAttachments ();

    }
    async deleteCategory (s:string,r: string) {
        const modal = await this.modalCtrl.create({
            component: DeletePopoverComponent,
            cssClass: 'simple-delete-modal',
            componentProps: { deleteType: 'deleteCategory', s ,r}
            
            

        });
        await modal.present();
        const { data} = await modal.onWillDismiss();
        console.log(data)
        if (data.category === 'delete') {
            this.apiService.post('categories' , {category:s,_id: r,}).subscribe(attachments => {
                console.log(attachments);
               
                
            });
            this.recordService.deleteUserCategory(s,r);
        }
      



    }
}
