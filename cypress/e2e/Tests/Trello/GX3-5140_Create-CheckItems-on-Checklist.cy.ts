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

	it('2: Get lists of the created board, to assign id of the list', () => {
		cy.api({
			method: 'GET',
			url: `${baseURL}/${pathBoard}/${idBoard}/${pathLists}`,
			qs: {
				key: key,
				token: token,
			},
		}).then(response => {
			expect(response).to.be.an('object');
			expect(response.status).to.eql(200);
			idList = response.body[0].id;
		});
	});

	it('3: Create card on List 1', () => {
		cy.api({
			method: 'POST',
			url: `${baseURL}/${pathCards}`,
			qs: {
				key: key,
				token: token,
				idList: idList,
				name: titleCard
			},
		}).then(response => {
			expect(response).to.be.an('object');
			expect(response.status).to.eql(200);
			idCard = response.body.id;
		});
	});

	it('4: Create check list on card 1', () => {
		cy.api({
			method: 'POST',
			url: `${baseURL}/${pathCards}/${idCard}/${pathChecklists}`,
			qs: {
				key: key,
				token: token,
				name: titleCkeckList
			},
		}).then(response => {
			expect(response).to.be.an('object');
			expect(response.status).to.eql(200);
			idChecklist = response.body.id;
		});
	});

});
