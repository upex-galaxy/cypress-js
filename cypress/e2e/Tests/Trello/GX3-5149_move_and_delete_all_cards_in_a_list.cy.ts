import data from '../../../fixtures/data/trello.json';

describe('A- Preconditions', () => {
	it('1.0: Create a board', () => {
		cy.api({
			method: 'POST',
			url: `${data.main.baseURL}/${data.paths.boards}`,
			qs: {
				key: data.main.key,
				token: data.main.token,
				name: data.titles.board
			},
		}).then(response => {
			expect(response).to.be.an('object');
			expect(response.status).to.eql(200);
			data.ids.board = response.body.id;
		});
	});
	it('2.0: Get lists id', () => {
		cy.api({
			method: 'GET',
			url: `${data.main.baseURL}/${data.paths.boards}/${data.ids.board}/${data.paths.lists}`,
			qs: {
				key: data.main.key,
				token: data.main.token,
			},
		}).then(response => {
			expect(response).to.be.an('object');
			expect(response.status).to.eql(200);
			data.ids.list1 = response.body[0].id;
			data.ids.list2 = response.body[1].id;
		});
	});
	it('3.0: Create a card', () => {
		cy.api({
			method: 'POST',
			url: `${data.main.baseURL}/${data.paths.cards}`,
			qs: {
				key: data.main.key,
				token: data.main.token,
				idList: data.ids.list1,
				name: data.titles.card
			},
		}).then(response => {
			expect(response).to.be.an('object');
			expect(response.status).to.eql(200);
		});
	});
});

describe('B- Suite',() => {
	it('1.0: Move all cards', () => {
		cy.api({
			method: 'POST',
			url: `${data.main.baseURL}/${data.paths.lists}/${data.ids.list1}/${data.paths.moveAllCards}`,
			qs: {
				key: data.main.key,
				token: data.main.token,
				idBoard: data.ids.board,
				idList: data.ids.list2
			},
		}).then(response => {
			expect(response.status).to.eql(200);
		});
	});
	it('1.1: Validate if list 1 is now empty', () => {
		cy.api({
			method: 'GET',
			url: `${data.main.baseURL}/${data.paths.lists}/${data.ids.list1}/${data.paths.cards}`,
			qs: {
				key: data.main.key,
				token: data.main.token,
			},
		}).then(response => {
			expect(response.status).to.eql(200);
			expect(response.body).to.be.empty;
		});
	});
	it('1.2: Validate if list 2 now has content', () => {
		cy.api({
			method: 'GET',
			url: `${data.main.baseURL}/${data.paths.lists}/${data.ids.list2}/${data.paths.cards}`,
			qs: {
				key: data.main.key,
				token: data.main.token,
			},
		}).then(response => {
			expect(response.status).to.eql(200);
			expect(response.body).to.not.be.empty;
		});
	});
	it('2.0: Validate archieve all cards', () => {
		cy.api({
			method: 'POST',
			url: `${data.main.baseURL}/${data.paths.lists}/${data.ids.list2}/${data.paths.archieveAllCards}`,
			qs: {
				key: data.main.key,
				token: data.main.token,
			},
		}).then(response => {
			expect(response.status).to.eql(200);
		});
	});
	it('2.1: Verify list 2 does not have content', () => {
		cy.api({
			method: 'GET',
			url: `${data.main.baseURL}/${data.paths.lists}/${data.ids.list2}/${data.paths.cards}`,
			qs: {
				key: data.main.key,
				token: data.main.token,
			},
		}).then(response => {
			expect(response.status).to.eql(200);
			expect(response.body).to.be.empty;
		});
	});
	it('2.2: (POSTC) Create another card', () => {
		cy.api({
			method: 'POST',
			url: `${data.main.baseURL}/${data.paths.cards}`,
			qs: {
				key: data.main.key,
				token: data.main.token,
				idList: data.ids.list1,
				name: data.titles.card
			},
		}).then(response => {
			expect(response).to.be.an('object');
			expect(response.status).to.eql(200);
		});
	});
	it('3.0: Verify to not move all cards if initial list does not exist', () => {
		cy.api({
			method: 'POST',
			url: `${data.main.baseURL}/${data.paths.lists}/${data.ids.fake}/${data.paths.moveAllCards}`,
			qs: {
				key: data.main.key,
				token: data.main.token,
				idBoard: data.ids.board,
				idList: data.ids.list2
			},
			failOnStatusCode: false,
		}).then(response => {
			expect(response.status).to.eql(400);
		});
	});
	it('4.0: Verify to not move all cards if recipient list does not exist', () => {
		cy.api({
			method: 'POST',
			url: `${data.main.baseURL}/${data.paths.lists}/${data.ids.list1}/${data.paths.moveAllCards}`,
			qs: {
				key: data.main.key,
				token: data.main.token,
				idBoard: data.ids.board,
				idList: data.ids.fake
			},
			failOnStatusCode: false,
		}).then(response => {
			expect(response.status).to.eql(400);
		});
	});
	it('5.0: Verify to not move all cards if initial list is null', () => {
		cy.api({
			method: 'POST',
			url: `${data.main.baseURL}/${data.paths.lists}/${data.ids.null}/${data.paths.moveAllCards}`,
			qs: {
				key: data.main.key,
				token: data.main.token,
				idBoard: data.ids.board,
				idList: data.ids.list2
			},
			failOnStatusCode: false,
		}).then(response => {
			expect(response.status).to.eql(400);
		});
	});
	it('6.0: Verify to not move all cards if recipient list is null', () => {
		cy.api({
			method: 'POST',
			url: `${data.main.baseURL}/${data.paths.lists}/${data.ids.list1}/${data.paths.moveAllCards}`,
			qs: {
				key: data.main.key,
				token: data.main.token,
				idBoard: data.ids.board,
				idList: data.ids.null
			},
			failOnStatusCode: false,
		}).then(response => {
			expect(response.status).to.eql(400);
		});
	});
	it('7.0: Verify to not archieve all cards of an inexistent list', () => {
		cy.api({
			method: 'POST',
			url: `${data.main.baseURL}/${data.paths.lists}/${data.ids.fake}/${data.paths.archieveAllCards}`,
			qs: {
				key: data.main.key,
				token: data.main.token,
			},
			failOnStatusCode: false,
		}).then(response => {
			expect(response.status).to.eql(400);
		});
	});
	it('8.0: Verify to not archieve all cards of an inexistent list', () => {
		cy.api({
			method: 'POST',
			url: `${data.main.baseURL}/${data.paths.lists}/${data.ids.null}/${data.paths.archieveAllCards}`,
			qs: {
				key: data.main.key,
				token: data.main.token,
			},
			failOnStatusCode: false,
		}).then(response => {
			expect(response.status).to.eql(400);
		});
	});
});

describe('C- Postconditions',() => {
	it('1.0: Delete the board', () => {
		cy.api({
			method: 'DELETE',
			url: `${data.main.baseURL}/${data.paths.boards}/${data.ids.board}`,
			qs: {
				key: data.main.key,
				token: data.main.token,
			},
		}).then(response => {
			expect(response.status).to.eql(200);
		});
	});
});