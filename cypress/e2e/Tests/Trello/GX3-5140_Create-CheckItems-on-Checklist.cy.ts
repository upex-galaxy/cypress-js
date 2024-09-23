//!! MI TEST:

let key:string = Cypress.env('trelloApiKey');
let token:string = Cypress.env('trelloApiToken');
let titleBoard:string ='Board-1';
let titleCard:string = 'Card 1';
let titleCkeckList:string = 'Checklist 1';
let titleCheckItem:string = 'CheckItem 1';
let titleCheckItemModified:string = 'Name changed';
let idBoard:string;
let idList:string;
let idCard:string;
let idChecklist:string;
let idCheckItem:string;
let pathBoard:string = 'boards';
let pathLists:string = 'lists';
let pathCards:string = 'cards';
let pathChecklists:string = 'checklists';
let pathCheckItem:string = 'checkitem';
let pathCheckItems:string = 'checkitems';
let baseURL:string = 'https://api.trello.com/1';

describe('Precondition', () => {
	it('1: Create a board', () => {
		cy.api({
			method: 'POST',
			url: `${baseURL}/${pathBoard}/`,
			qs: {
				key: key,
				token: token,
				name: titleBoard
			},
		}).then(response => {
			expect(response).to.be.an('object');
			expect(response.status).to.eql(200);
			idBoard = response.body.id;
		});
	});
});
