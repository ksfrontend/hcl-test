import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api-service.service';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss']
})
export class QuestionnaireComponent implements OnInit {

	constructor(private apiService: ApiService) { }

	saved = true;
	questionnaireData= {
		'item': []
	};
  	questionnarireForm:any = {}
  
	ngOnInit(): void {
		this.getQuestionnaire();
	}

	getQuestionnaire() {
		this.apiService.getQuestionnaire().subscribe(result => {
			this.updateQuestionnaireModel(result);
		});
	}


	updateQuestionnaireModel(result) {
		let data = result
		data.item.map(item => {
			if (item.type === 'group') {
				var groupItems = item.item.map(groupItem => {
					groupItem.value = groupItem.type === 'boolean' ? true : "";
					return groupItem;
				});
				return groupItems;
			} else {
				item.value = item.type === 'boolean' ? true : "";
				return item;
			}
		});
		this.questionnaireData = data;
	}

	getInputType(type) {
		return type === 'boolean' ? 'checkbox' : type;
	}

  	saveForm() {
		this.questionnarireForm.item = this.questionnaireData.item;
		this.questionnarireForm.item.map(item => {
			if (item.type === 'group') {
				var groupItems = item.item.map(groupItem => {
					groupItem.answer = [{'valueString': groupItem.value}];
					delete groupItem.value;
					delete groupItem.values;
					return groupItem;
				});
				return groupItems;
			} else {
				item.answer = [{'valueString': item.value}];
				delete item.value;
				delete item.values;
				return item;
			}
		})
		this.questionnarireForm = Object.assign(this.questionnarireForm, this.generateFormData());
		console.log('Generated form data ', this.questionnarireForm);
		this.saved = true;
	}
	  
	generateFormData() {
		return {
			"resourceType": "QuestionnaireResponse",
			"id": "f201",
			"text": {
				"status": "generated"
			},
			"status": "completed",
			"subject": {
				"reference": "Patient/f201",
				"display": "Roel"
			},
			"authored": new Date(),
			"author": {
				"reference": "Practitioner/f201"
			},
			"source": {
				"reference": "Practitioner/f201"
			},
		}
	}
}
