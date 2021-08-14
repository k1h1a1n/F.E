import { Component } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { ValueAccessor } from '@ionic/angular/dist/directives/control-value-accessors/value-accessor';
import { random } from 'node-forge';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-microsurvey',
  templateUrl: './microsurvey.component.html',
  styleUrls: ['./microsurvey.component.scss'],
})
export class MicrosurveyComponent {
  progress = 0;
  optn3 = true;
  reference: any;
  currentIndexToShow: number = -1;
  buttonColor: string = '#fefefe';
  list: any;
  total = 4;
  userEmail: any;
  currentQ: number = 0;
  endQuiz = false;
  i: number;
  token:any;
  header:any;
  questions: Array<any> = [];
  randomArray: Array<any> = [];
  finalArray: Array<any> = [];
  buttonColors: string = '#FFFFFF';
  constructor(public navParams: NavParams,    private http: HttpClient,    private apiService: ApiService,    private authService: AuthService,



    public modalCtrl: ModalController) {

      this.authService.currentUser.subscribe((user) => {
        this.userEmail = user.email
        this.token = user.token;

      });

    this.questions = [
      {
        'question': 'What brought you to Durity?',
        'option1': "I’m here to create a Will",
        'option2': "I’m here to store my documents",
        'option3': "I’m here to explore the App",
        'option4': '',
        'Answer':''

      },
      {
        'question': 'How did you get to know about Durity?',
        'option1': "My Advisor suggested this App",
        'option2': "I saw a post on social media",
        'option3': "I watched a video on Youtube",
        'option4': "I found it while browsing Play Store",
        'Answer':''

      },
      {
        'question': 'Have you visited our website www.durity.life?',
        'option1': "Yes",
        'option2': "No",
        'option3': "",
        'option4': "",
        'Answer':''

      },
      {
        'question': 'Which social media platform do you use the most?',
        'option1': "Facebook",
        'option2': "YouTube",
        'option3': "Twitter",
        'option4': "Linkedin",
        'Answer':''

      },
      {
        'question': 'Select your age group:',
        'option1': "25-35",
        'option2': "35-45",
        'option3': "45-55",
        'option4': "more than 55",
        'Answer':''

      },
      {
        'question': 'Have you ever thought about writing a Will?',
        'option1': "Yes, I thought about it recently",
        'option2': " Yes, I thought about it last year",
        'option3': "Yes, I thought about it few years ago",
        'option4': "No, I have never thought about it",
        'Answer':''

      },
      {
        'question': 'Would you prefer having a live chat within our App to serve you?',
        'option1': "Yes",
        'option2': "No",
        'option3': "Maybe",
        'option4': "Not necessary",
        'Answer':''

      },
      {
        'question': 'How likely are you to recommend our App to your friends & family?',
        'option1': "Very likely",
        'option2': "Somewhat likely",
        'option3': "Somewhat unlikely",
        'option4': "Unlikely",
        'Answer':''

      }

    ]
    this.randomSequence();
    this.nextButtonClick(event, "");


  }



  public closeModal() {

    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  randomSequence() {

    var arr = [];
    let i;
    while (arr.length < 4) {
      var r = Math.floor(Math.random() * 7) + 1;
      if (arr.indexOf(r) === -1) {
        arr.push(r)
        this.randomArray.push(this.questions[r])
      }

    }

  }





  nextButtonClick(event, id) {

    console.log(this.reference)
    if (id === "one") {
      this.buttonColors = '#1473E7'
      console.log("optionSelected==", this.randomArray[this.currentIndexToShow].option1)
      this.reference.Answer = this.randomArray[this.currentIndexToShow].option1;
      this.finalArray.push(this.reference)
    }
    else if (id === "two") {
      console.log("optionSelected==", this.randomArray[this.currentIndexToShow].option2)
      this.reference.Answer = this.randomArray[this.currentIndexToShow].option2;
      this.finalArray.push(this.reference)

    }
    else if (id === "three") {
      console.log("optionSelected==", this.randomArray[this.currentIndexToShow].option3)
      this.reference.Answer = this.randomArray[this.currentIndexToShow].option3;
      this.finalArray.push(this.reference)

    } else if (id === "four") {
      console.log("optionSelected==", this.randomArray[this.currentIndexToShow].option4)
      this.reference.Answer = this.randomArray[this.currentIndexToShow].option4;
      this.finalArray.push(this.reference)

    }
    // if(this.currentQ != this.total){
      this.currentQ++;
      this.progress += 1 / 4;
      // this.currentIndexToShow++;
    // }
    this.currentIndexToShow++;
   
    console.log(this.currentIndexToShow);

    if (this.currentIndexToShow > 3) {
      this.endQuiz = true;
    }

    else {
      this.reference = this.randomArray[this.currentIndexToShow];

    }

    if(this.endQuiz == true){
      let TIME_IN_MS = 3000;
      // if(this.auth.userSignedUp == true){
        let hideFooterTimeout = setTimeout(() => {
          this.endSurvey();
        }, TIME_IN_MS);
      // }
    }

  }

  prevButtonClick() {
    this.progress -= 1 / (this.randomArray.length);
    this.buttonColor = '#fff';
    this.currentIndexToShow--;
    this.reference = this.randomArray[this.currentIndexToShow];
    this.currentQ--;

  }

  endSurvey() {
    console.log("///*****////")
    this.header = new HttpHeaders({
      "content-type": "application/json",
      Authorization: this.token,
    });
    this.closeModal()
    console.log("finalarray ==", this.finalArray);
    let data = {survey:this.finalArray}
    this.http.post(`${this.apiService.apiUrl}/user/saveSurveyDetails?email=${this.userEmail}`, this.finalArray, { headers: this.header })
    .subscribe((res) => {
        console.log(res);
      });

  }



}
