describe('User Data Table', () => {

    context('Mocking API Responses', () => {
        it('should display data from the mocked API response', () => {
            cy.intercept('GET', 'https://jsonplaceholder.typicode.com/users', {
                fixture: 'userMock'
            }).as('getUsers');
            cy.visit('./src/index.html');
            cy.wait('@getUsers');

            cy.get('[data-test="table-body"] tr').within(() => {
                cy.get('td').eq(0)
                    .should('contain', '1'); // ID
                cy.get('td').eq(1)
                    .should('contain', 'User mocks'); // Name
                cy.get('td').eq(2)
                    .should('contain', 'cypressMock@april.biz'); // Email
            });
        });

        it('should display "No users found." for an empty API response', () => {
            cy.intercept(
                'GET',
                 'https://jsonplaceholder.typicode.com/users', 
                []
            ).as('getUsersEmpty');
            cy.visit('./src/index.html');
            cy.wait('@getUsersEmpty');

            cy.get('[data-test="error-message"]')
                .should('contain.text', 'No users found.');
        });

        it('should display data from multiple users in the mocked API response', () => {
            cy.intercept('GET', 'https://jsonplaceholder.typicode.com/users', {
                fixture: 'multipleUsersMock'
            }).as('getUsersMultiple');
            cy.visit('./src/index.html');
            cy.wait('@getUsersMultiple');

            cy.get('[data-test="data-table"]')
                .should('be.visible');
            cy.get('[data-test="table-body"] tr')
                .should('have.length', 3);
        });
    });

    context('Real API Responses', () => {
        it('should display data from the real API response', () => {
            cy.intercept('GET', 'https://jsonplaceholder.typicode.com/users').as('getUsers');
            cy.visit('./src/index.html');
            cy.wait('@getUsers');

            cy.get('[data-test="data-table"]')
                .should('be.visible');
            cy.get('[data-test="table-body"] tr')
                .should('exist');
        });
    });

    context('Error Handling', () => {
        it('should handle a 500 Internal Server Error', () => {
            cy.intercept('GET', 'https://jsonplaceholder.typicode.com/users', {
                statusCode: 500,
                body: {
                    message: 'Internal Server Error'
                }
            }).as('getUsersError500');

            cy.visit('./src/index.html');
            cy.wait('@getUsersError500');

            cy.get('[data-test="error-message"]')
                .should('contain.text', 'An error occurred while loading data: Error 500: Internal Server Error');
        });

        it('should handle a network error', () => {
            cy.intercept('GET', 'https://jsonplaceholder.typicode.com/users', {
                forceNetworkError: true
            }).as('getUsersNetworkError');

            cy.visit('./src/index.html');
            cy.wait('@getUsersNetworkError');

            cy.get('[data-test="error-message"]')
                .should('contain.text', 'An error occurred while loading data: Failed to fetch');
        });

        it('should handle a slow API response gracefully', () => {
            cy.intercept('GET', 'https://jsonplaceholder.typicode.com/users', (req) => {
                req.on('response', (res) => {
                    res.setDelay(1000); 
                });
            }).as('getUsersSlow');

            cy.visit('./src/index.html');
            cy.wait('@getUsersSlow');
            cy.get('[data-test="loading-indicator"]')
                .should('contain.text', 'Loading...');
        });

        it('should handle unexpected API response structure', () => {
            cy.intercept('GET', 'https://jsonplaceholder.typicode.com/users', {
                body: [{ id: 1, unknownField: 'Unexpected Data' }]
            }).as('getUsersUnexpected');

            cy.visit('./src/index.html');
            cy.wait('@getUsersUnexpected');

            cy.get('[data-test="error-message"]')
                .should('contain.text', 'Unexpected data format');
        });
    });
});
