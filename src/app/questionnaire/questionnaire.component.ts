import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api-service.service';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss']
})
export class QuestionnaireComponent implements OnInit {

	constructor(private apiService: ApiService) { }

	questionnaireData = {
		'item': []
	};
  	questionnarireForm = {
		"resourceType" : "QuestionnaireResponse",
		"identifier" : "",
		"basedOn" :"",
		"partOf" : "",
		"questionnaire" : "", 
		"status" : "Patient", // The subject of the questions
		"encounter" :"", // Encounter created as part of
		"authored" : new Date(), // Date the answers were gathered
		"author" : "Vijay",
		"source" : "User", // The person who answered the questions
		"item" : [{ // Groups and questions
		  "linkId" : "", // R!  Pointer to specific item from Questionnaire
		  "definition" : "", // ElementDefinition - details for the item
		  "text" : "", // Name for group or question text
		  "answer" : [{ // The response(s) to the question
			// value[x]: Single-valued answer to the question. One of these 12:
			/*"valueBoolean" : "",
			"valueDecimal" : "",
			"valueInteger" : "",
			"valueDate" : "<date>",
			"valueDateTime" : "<dateTime>",
			"valueTime" : "<time>",
			"valueString" : "<string>",
			"valueUri" : "<uri>",*/
			"value": "",
			"item" : [] // Nested groups and questions
		  }],
		  "item" : [] // Nested questionnaire response items
		}]
	};
  
	ngOnInit(): void {
		this.getQuestionnaire();
	}

	getQuestionnaire() {
		this.apiService.getQuestionnaire().subscribe(result => {
			//this.questionnaireData = result;
			//console.log('this.questionnaireData ', this.questionnaireData.item);
			this.updateQuestionnaireModel(result);
		});
	}


	updateQuestionnaireModel(result) {
		this.questionnaireData = result;
		var updated = this.questionnaireData.item.map(item => {
			if (item.type === 'group') {
				var groupItems = item.item.map(groupItem => {
					groupItem.value = groupItem.type === 'boolean' ? false : "";
					return groupItem;
				});
				return groupItems;
			} else {
				item.value = item.type === 'boolean' ? false : "";
				return item;
			}
		});
		console.log('updated ', updated);
	}

  	saveForm() {
		console.log('this.questionnaireData ', this.questionnaireData);
		this.questionnarireForm.authored = new Date();
		this.questionnarireForm.item = this.questionnaireData.item;
		console.log('this.questionnarireForm ', this.questionnarireForm);
  	}
}
