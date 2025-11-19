Feature: Expense Tracking
  As a user
  I want to track my expenses
  So that I can monitor my spending

  Scenario: Create a new expense
    Given I am a user with id "user-123"
    When I create an expense with amount 50 and description "Groceries"
    Then the expense should be saved successfully
    And the expense should have the correct details

  Scenario: Get monthly expenses
    Given I am a user with id "user-123"
    And I have created expenses for January 2025
    When I request my expenses for January 2025
    Then I should see all my expenses for that month

  Scenario: Get spending summary
    Given I am a user with id "user-123"
    And I have a spending limit of 1000 for January 2025
    And I have spent 600 in January 2025
    When I request my spending summary for January 2025
    Then I should see my total spending is 600
    And I should see my remaining budget is 400
    And I should see I have used 60% of my limit
