import { Given, When, Then, Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { strict as assert } from 'assert';

setDefaultTimeout(10000);

interface TestContext {
  app: INestApplication;
  userId: string;
  createdExpense: any;
  expenses: any[];
  summary: any;
}

// Create a context object that will be shared across steps
let testContext: TestContext = {} as TestContext;

Before(async function () {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  testContext.app = moduleFixture.createNestApplication();
  await testContext.app.init();
});

After(async function () {
  if (testContext.app) {
    await testContext.app.close();
  }
});

Given('I am a user with id {string}', async function (userId: string) {
  testContext.userId = userId;
});

When(
  'I create an expense with amount {int} and description {string}',
  async function (amount: number, description: string) {
    const response = await request(testContext.app.getHttpServer())
      .post('/expenses')
      .send({
        amount,
        description,
        category: 'Food',
        date: new Date().toISOString(),
        userId: testContext.userId,
      })
      .expect(201);

    testContext.createdExpense = response.body;
  },
);

Then('the expense should be saved successfully', function () {
  assert.ok(testContext.createdExpense);
  assert.ok(testContext.createdExpense.id);
});

Then('the expense should have the correct details', function () {
  assert.strictEqual(testContext.createdExpense.amount, 50);
  assert.strictEqual(testContext.createdExpense.description, 'Groceries');
  assert.strictEqual(testContext.createdExpense.userId, testContext.userId);
});

Given('I have created expenses for January {int}', async function (year: number) {
  const expenses = [
    {
      amount: 100,
      description: 'Expense 1',
      category: 'Food',
      date: new Date(year, 0, 15).toISOString(),
      userId: testContext.userId,
    },
    {
      amount: 200,
      description: 'Expense 2',
      category: 'Transport',
      date: new Date(year, 0, 20).toISOString(),
      userId: testContext.userId,
    },
  ];

  for (const expense of expenses) {
    await request(testContext.app.getHttpServer())
      .post('/expenses')
      .send(expense)
      .expect(201);
  }
});

When('I request my expenses for January {int}', async function (year: number) {
  const response = await request(testContext.app.getHttpServer())
    .get(`/expenses?userId=${testContext.userId}&month=1&year=${year}`)
    .expect(200);

  testContext.expenses = response.body;
});

Then('I should see all my expenses for that month', function () {
  assert.ok(Array.isArray(testContext.expenses));
  assert.ok(testContext.expenses.length >= 2);
});

Given(
  'I have a spending limit of {int} for January {int}',
  async function (limit: number, year: number) {
    await request(testContext.app.getHttpServer())
      .post('/spending-limits')
      .send({
        userId: testContext.userId,
        month: 1,
        year,
        monthlyLimit: limit,
      })
      .expect(201);
  },
);

Given('I have spent {int} in January {int}', async function (amount: number, year: number) {
  const expenses = [
    {
      amount: 300,
      description: 'Expense A',
      category: 'Food',
      date: new Date(year, 0, 10).toISOString(),
      userId: testContext.userId,
    },
    {
      amount: 300,
      description: 'Expense B',
      category: 'Transport',
      date: new Date(year, 0, 15).toISOString(),
      userId: testContext.userId,
    },
  ];

  for (const expense of expenses) {
    await request(testContext.app.getHttpServer())
      .post('/expenses')
      .send(expense)
      .expect(201);
  }
});

When('I request my spending summary for January {int}', async function (year: number) {
  const response = await request(testContext.app.getHttpServer())
    .get(`/expenses/summary?userId=${testContext.userId}&month=1&year=${year}`)
    .expect(200);

  testContext.summary = response.body;
});

Then('I should see my total spending is {int}', function (expectedAmount: number) {
  assert.strictEqual(testContext.summary.totalSpent, expectedAmount);
});

Then('I should see my remaining budget is {int}', function (expectedRemaining: number) {
  assert.strictEqual(testContext.summary.remainingBudget, expectedRemaining);
});

Then('I should see I have used {int}% of my limit', function (expectedPercentage: number) {
  assert.strictEqual(testContext.summary.percentageUsed, expectedPercentage);
});
