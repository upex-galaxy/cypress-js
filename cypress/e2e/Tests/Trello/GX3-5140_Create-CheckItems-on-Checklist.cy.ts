//import { stringify } from 'querystring';

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
			cy.wrap(idBoard).as('idBoard');
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
			cy.wrap(idList).as('idList');
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
			cy.wrap(idCard).as('idCard');
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
			cy.wrap(idChecklist).as('idChecklist');
		});
	});
});

describe('Suite', () => {
	it('1: Create a new checkitem', () => {
		cy.api({
			method: 'POST',
			url: `${baseURL}/${pathChecklists}/${idChecklist}/${pathCheckItems}`,
			qs: {
				key: key,
				token: token,
				name: titleCheckItem
			},
		}).then(response => {
			expect(response.status).to.eq(200);
			idCheckItem = response.body.id;
			cy.wrap(idCheckItem).as('idCheckItem');
		});
	});
	it('2: Get created Checkitem', () => {
		cy.api({
			method: 'GET',
			url: `${baseURL}/${pathChecklists}/${idChecklist}/${pathCheckItems}/${idCheckItem}`,
			qs: {
				key: key,
				token: token
			},
		}).then(response => {
			expect(response.status).to.eq(200);
			expect(response.body.name).to.eq(`${titleCheckItem}`);
		});
	});
	it('3: Modify checkitem\'s name and status', () => {
		cy.api({
			method: 'PUT',
			url: `${baseURL}/${pathCards}/${idCard}/${pathCheckItem}/${idCheckItem}`,
			qs: {
				key: key,
				token: token,
				state: 'complete',
				name: titleCheckItemModified
			},
		}).then(response => {
			expect(response.status).to.eq(200);
		});
	});
	it('4: Verify checkitem was modified', () => {
		cy.api({
			method: 'GET',
			url: `${baseURL}/${pathChecklists}/${idChecklist}/${pathCheckItems}/${idCheckItem}`,
			qs: {
				key: key,
				token: token
			},
		}).then(response => {
			expect(response.status).to.eq(200);
			expect(response).to.be.an('object');
			expect(response.body.name).to.eq(`${titleCheckItemModified}`);
			expect(response.body.state).to.eq('complete');
		});
	});
	it('5: Delete Checkitem', () => {
		cy.api({
			method: 'DELETE',
			url: `${baseURL}/${pathCards}/${idCard}/${pathCheckItem}/${idCheckItem}`,
			qs: {
				key: key,
				token: token
			},
		}).then(response => {
			expect(response.status).to.eq(200);
		});
	});
	it('6: Not get a deleted checkitem', () => {
		cy.api({
			method: 'GET',
			url: `${baseURL}/${pathChecklists}/${idChecklist}/${pathCheckItems}/${idCheckItem}`,
			qs: {
				key: key,
				token: token
			},
			failOnStatusCode: false,
		}).then(response => {
			expect(response.status).to.eq(404);
			expect(response.body).to.eq('model not found');
		});
	});
});

describe('Postcondition', () => {
	it('1: Delete the board created', () => {
		cy.api({
			method: 'DELETE',
			url: `${baseURL}/${pathBoard}/${idBoard}`,
			qs: {
				key: key,
				token: token
			},
		});
	});
});
