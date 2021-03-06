import { Component } from '@angular/core';
import { NavController, ModalController, AlertController } from 'ionic-angular';
import * as moment from 'moment';
import {ExpirationDataServiceProvider } from '../../providers/expiration-data-service';
import { ItemDataServiceProvider } from '../../providers/item-data-service';

@Component({
  selector: 'page-Calender',
  templateUrl: 'calender.html'
})
export class CalenderPage {
  eventSource = [];
  viewTitle: string;
  Hack = null;
  selectedDay = new Date();
  Food = null;

  calendar = {
    mode: 'month',
    currentDate: new Date()
  };

  constructor(public navCtrl: NavController, private itemDataService: ItemDataServiceProvider, private modalCtrl: ModalController, private alertCtrl: AlertController, public exp: ExpirationDataServiceProvider) {

    this.itemDataService.isReady().then(ready => {
      this.onReady();
    });
  }

  onReady()
  {
    this.Food = this.itemDataService.getAllData();
    this.Hack =[0];
    for (let i= 0; i<this.Food.length; i++)
    {
      let storage = '';
      if(this.Food[i].type == "1")
      {
        storage = 'refrigerator';
      }
      else
      {
        storage = 'counterTop';
      }
      this.addExpirationEvent(this.Food[i].name, new Date(this.Food[i].date), storage);
    }

  }

  addEvent() {
    let modal = this.modalCtrl.create('EventModalPage', {selectedDay: this.selectedDay});
    modal.present();
    modal.onDidDismiss(data => {
      if (data) {
        let eventData = data;

        //Write to json
        this.itemDataService.addFood({'name':data.title,'date':data.startTime,'type':1});

        eventData.startTime = new Date(data.startTime);
        eventData.endTime = eventData.startTime;

        let events = this.eventSource;
        events.push(eventData);
        this.eventSource = [];
        setTimeout(() => {
          this.eventSource = events;
        });
      }
    });
  }

  addExpirationEvent(food, date, storage) {

    let start = new Date(this.exp.getExpirationDate(food, date, storage));
    let end = start;

    let event = {
      title: food,
      startTime: start,
      endTime: end,
      allDay: true
    };

    let events = this.eventSource;
    events.push(event);
    setTimeout(() => {
      this.eventSource = events;
    });
  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  onEventSelected(event) {
    let start = moment(event.startTime).format('LL');

    let alert = this.alertCtrl.create({
      title: '' + event.title,
      subTitle: start,
      buttons: ['Dismiss']
    })
    alert.present();
  }

  onTimeSelected(ev) {
    this.selectedDay = ev.selectedTime;
  }
}
