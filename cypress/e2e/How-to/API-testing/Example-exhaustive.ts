/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/**
import { TrelloCardApi } from '@pages/GX2-16267-cards.Page';
import type { GetListByIdResponse, GetCardByIdResponse, TrelloDataParams } from '../../../support/types/GX2-16267-responseType';
import { TrelloCardApi } from '@pages/GX2-16267-cards.Page';
import { method, urlList } from 'cypress/support/types/GX2-16267-urlData';
import { faker } from '@faker-js/faker';

const dataParams: TrelloDataParams = dataJson as TrelloDataParams;
const description : string =  faker.commerce.productDescription();
const updatedDescription : string =  faker.commerce.productDescription();
const cardNameA : string =  faker.commerce.productName();
const cardNameB : string =  faker.commerce.productName();
const updatedCardNameA : string =  faker.commerce.productName();

function checkListNaming(listId: string, listName: string) {
	const options = {
		idList: listId,
	};
	TrelloCardApi.request(method.GET, urlList.getList, options)
		.then(response => {
			const responseBody: GetListByIdResponse = response.body;
			expect(response).to.be.an('object');
			expect(response.status).to.eq(200);
			expect(response.body.name).to.eq(listName);
			expectedResultList(listId, responseBody);
		});
}

const expectedResultList = (listId : string, responseBody : GetListByIdResponse) => {
	expect(responseBody).to.have.property('id').that.is.equal(listId);
	expect(responseBody).to.have.property('id').that.is.a('string');
	expect(responseBody).to.have.property('name').that.is.a('string');
	expect(responseBody).to.have.property('closed').that.is.a('boolean');
	expect(responseBody).to.have.property('color').that.is.oneOf([null, 'string']);
	expect(responseBody).to.have.property('idBoard').that.is.a('string');
	expect(responseBody).to.have.property('pos').that.is.a('number');
};
const expectedResultCard = (cardId : string, responseBody : GetCardByIdResponse) => {
	expect(responseBody).to.have.property('id').that.is.equal(cardId);
	expect(responseBody).to.have.property('id').that.is.a('string');
	expect(responseBody).to.have.property('closed').that.is.a('boolean');
	expect(responseBody).to.have.property('idList').that.is.a('string');
	expect(responseBody).to.have.property('badges').that.is.an('object');
	expect(responseBody).to.have.property('checkItemStates').that.is.an('array');
	expect(responseBody).to.have.property('dueComplete').that.is.a('boolean');
	expect(responseBody).to.have.property('dateLastActivity').that.is.a('string');
	expect(responseBody).to.have.property('desc').that.is.a('string');
	expect(responseBody).to.have.property('descData').that.is.an('object');
	expect(responseBody).to.have.property('due').that.satisfies((due: string | null) => due === null || typeof due === 'string');
	expect(responseBody).to.have.property('dueReminder').that.satisfies((dueReminder: number | null) => dueReminder === null || typeof dueReminder === 'number');
	expect(responseBody).to.have.property('email').that.satisfies((email: string | null) => email === null || typeof email === 'string');
	expect(responseBody).to.have.property('idBoard').that.is.a('string');
	expect(responseBody).to.have.property('idChecklists').that.is.an('array');
	expect(responseBody).to.have.property('idMembers').that.is.an('array');
	expect(responseBody).to.have.property('idMembersVoted').that.is.an('array');
	expect(responseBody).to.have.property('idShort').that.is.a('number');
	expect(responseBody).to.have.property('idAttachmentCover').that.satisfies((id: string | null) => id === null || typeof id === 'string');
	expect(responseBody).to.have.property('labels').that.is.an('array');
	expect(responseBody).to.have.property('idLabels').that.is.an('array');
	expect(responseBody).to.have.property('manualCoverAttachment').that.is.a('boolean');
	expect(responseBody).to.have.property('name').that.is.a('string');
	expect(responseBody).to.have.property('pos').that.is.a('number');
	expect(responseBody).to.have.property('shortLink').that.is.a('string');
	expect(responseBody).to.have.property('shortUrl').that.is.a('string');
	expect(responseBody).to.have.property('start').that.satisfies((start: string | null) => start === null || typeof start === 'string');
	expect(responseBody).to.have.property('subscribed').that.is.a('boolean');
	expect(responseBody).to.have.property('url').that.is.a('string');
	expect(responseBody).to.have.property('cover').that.is.an('object');
	expect(responseBody).to.have.property('isTemplate').that.is.a('boolean');
	expect(responseBody).to.have.property('cardRole').that.satisfies((role: string | null) => role === null || typeof role === 'string');
};

describe('GX2-16267 | {API} Trello | Cards | Create Cards from a Board', () => {
	it('GX2-16274 | TC1: Check that name of the list is BACKLOG', () => {
		checkListNaming(dataParams.lists.backlog.id, dataParams.lists.backlog.name);
	});
	it('GX2-16274 | TC2: Check that name of the list is ACTIVE', () => {
		checkListNaming(dataParams.lists.active.id, dataParams.lists.active.name);
	});
	it('GX2-16274 | TC3: Check that name of the list is DONE', () => {
		checkListNaming(dataParams.lists.done.id, dataParams.lists.done.name);
	});
	it('GX2-16274 | TC4: Check that the user can create Card A on the Backlog list', () => {
		const options = {
			idList: dataParams.lists.backlog.id,
			body: {
				name: cardNameA,
				desc: description,
			}
		};
		TrelloCardApi.request(method.POST, urlList.createCard,options)
			.then(response => {
				const responseBody: GetCardByIdResponse = response.body;
				expect(response).to.be.an('object');
				expect(response.status).to.eql(200);
				expect(response.body.name).to.eql(options.body.name);
				expect(response.body.desc).to.eql(options.body.desc);
				dataParams.cards.idCardA = response.body.id;
				expectedResultCard(dataParams.cards.idCardA, responseBody);
			});
	});
	it('GX2-16274 | TC5: Check that the user can create Card B on the Active list', () => {
		const options = {
			idList: dataParams.lists.active.id,
			body: {
				name: cardNameB,
				desc: description,
			}
		};
		TrelloCardApi.request(method.POST, urlList.createCard, options)
			.then(response => {
				const responseBody: GetCardByIdResponse = response.body;
				expect(response).to.be.an('object');
				expect(response.status).to.eql(200);
				expect(response.body.name).to.eql(options.body.name);
				expect(response.body.desc).to.eql(options.body.desc);
				dataParams.cards.idCardB = response.body.id;
				expectedResultCard(dataParams.cards.idCardB, responseBody);
			});
	});

	it('GX2-16274 | TC6: Check that the user can update Card A', () => {
		const updates = {
			idCard: dataParams.cards.idCardA,
			body: {
				name: updatedCardNameA,
				desc: updatedDescription,
			}
		};
		TrelloCardApi.request(method.PUT, urlList.updateCard, updates)
			.then(response => {
				const responseBody: GetCardByIdResponse = response.body;
				expect(response).to.be.an('object');
				expect(response.status).to.eql(200);
				expect(response.body.name).to.eql(updates.body.name);
				expect(response.body.desc).to.eql(updates.body.desc);
				expectedResultCard(dataParams.cards.idCardA, responseBody);
			});
	});
	it('GX2-16274 | TC7: Check that the user can move Card A to Active List', () => {
		const update = {
			idCard: dataParams.cards.idCardA,
			body: {
				idList: dataParams.lists.active.id,
			}
		};
		TrelloCardApi.request(method.PUT, urlList.updateCard, update)
			.then(response => {
				const responseBody: GetCardByIdResponse = response.body;
				expect(response).to.be.an('object');
				expect(response.status).to.eql(200);
				expect(response.body.idList).to.eql(dataParams.lists.active.id);
				expectedResultCard(dataParams.cards.idCardA, responseBody);
			});
	});
	it('GX2-16274 | TC8: Check that the user can move Card A to Done List', () => {
		const update = {
			idCard: dataParams.cards.idCardA,
			body: {
				idList: dataParams.lists.done.id,
			}
		};
		TrelloCardApi.request(method.PUT, urlList.updateCard, update)
			.then(response => {
				const responseBody: GetCardByIdResponse = response.body;
				expect(response).to.be.an('object');
				expect(response.status).to.eql(200);
				expect(response.body.idList).to.eql(dataParams.lists.done.id);
				expectedResultCard(dataParams.cards.idCardA, responseBody);
			});
	});
	it('GX2-16274 | TC9: Check that card A has status closed: false', () => {
		const card = {
			idCard: dataParams.cards.idCardA,
		};
		TrelloCardApi.request(method.GET, urlList.getCard, card)
			.then(response => {
				const responseBody: GetCardByIdResponse = response.body;
				expect(response.body.closed).to.eql(false);
				expectedResultCard(dataParams.cards.idCardA, responseBody);
			});
	});
	it('GX2-16274 | TC10: Check that the user can archive card A', () => {
		const update = {
			idCard: dataParams.cards.idCardA,
			body: {
				closed: true,
			}
		};
		TrelloCardApi.request(method.PUT, urlList.getCard, update)
			.then(response => {
				const responseBody: GetCardByIdResponse = response.body;
				expect(response).to.be.an('object');
				expect(response.status).to.eql(200);
				expect(response.body.closed).to.eql(true);
				expectedResultCard(dataParams.cards.idCardA, responseBody);
			});
	});
	it('GX2-16274 | TC11: Check that the user can recover an archived card', () => {
		const update = {
			idCard: dataParams.cards.idCardA,
			body: {
				closed: false,
			}
		};
		TrelloCardApi.request(method.PUT, urlList.getCard, update)
			.then(response => {
				const responseBody: GetCardByIdResponse = response.body;
				expect(response).to.be.an('object');
				expect(response.status).to.eql(200);
				expect(response.body.closed).to.eql(false);
				expectedResultCard(dataParams.cards.idCardA, responseBody);
			});
	});
	it('GX2-16274 | TC12: Check that the user can delete a card', () => {
		const card = {
			idCard: dataParams.cards.idCardA,
		};
		TrelloCardApi.request(method.DELETE, urlList.deleteCard, card)
			.then(response => {
				expect(response.body.id).to.not.exist;
				expect(response.status).to.eql(200);
			});
	});
	it('GX2-16274 | TC13: Check that the user can delete all cards from Active List', () => {
		const list = {
			idList: dataParams.lists.active.id,
		};
		TrelloCardApi.request(method.POST, urlList.archiveCardsInList, list)
			.then(response => {
				expect(response).to.be.an('object');
				expect(response.status).to.eql(200);
			});
	});
});
*/