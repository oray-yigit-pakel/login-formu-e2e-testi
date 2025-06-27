describe('Register Form Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5182/'); // Proje ana sayfan, gerekirse burayı değiştir
  });

  it('Form alanları doğru şekilde render edilmeli', () => {
    cy.get('[data-cy=ad-input]').should('exist');
    cy.get('[data-cy=soyad-input]').should('exist');
    cy.get('[data-cy=email-input]').should('exist');
    cy.get('[data-cy=password-input]').should('exist');
    cy.get('[data-cy=submit-button]').should('exist');
  });

  it('Başlangıçta kayıt butonu disable olmalı', () => {
    cy.get('[data-cy=submit-button]').should('be.disabled');
  });

  it('Geçersiz ad girince hata mesajı görünmeli', () => {
    cy.get('[data-cy=ad-input]').type('ab');
    cy.get('[data-cy=error-message]').contains('Adınızı en az 3 karakter giriniz').should('be.visible');
    cy.get('[data-cy=submit-button]').should('be.disabled');
  });

  it('Geçersiz soyad girince hata mesajı görünmeli', () => {
    cy.get('[data-cy=soyad-input]').type('ab');
    cy.get('[data-cy=error-message]').contains('Soyadınızı en az 3 karakter giriniz').should('be.visible');
    cy.get('[data-cy=submit-button]').should('be.disabled');
  });

  it('Geçersiz email girince hata mesajı görünmeli', () => {
    cy.get('[data-cy=email-input]').type('invalid-email');
    cy.get('[data-cy=error-message]').contains('Geçerli bir email adresi giriniz').should('be.visible');
    cy.get('[data-cy=submit-button]').should('be.disabled');
  });

  it('Geçersiz şifre girince hata mesajı görünmeli', () => {
    cy.get('[data-cy=password-input]').type('12345');
    cy.get('[data-cy=error-message]').contains('Şifreniz en az 8 karakter').should('be.visible');
    cy.get('[data-cy=submit-button]').should('be.disabled');
  });

  it('Geçerli bilgilerle buton aktif olmalı ve form gönderilmeli', () => {
    cy.get('[data-cy=ad-input]').clear().type('Oray');
    cy.get('[data-cy=soyad-input]').clear().type('Pakel');
    cy.get('[data-cy=email-input]').clear().type('oray.pakel@example.com');
    cy.get('[data-cy=password-input]').clear().type('ValidPass1!');
    
    cy.get('[data-cy=submit-button]').should('not.be.disabled');

    cy.intercept('POST', 'https://reqres.in/api/users').as('postUser');

    cy.get('[data-cy=submit-button]').click();

    cy.wait('@postUser').its('response.statusCode').should('eq', 201);

    // Kayıt ID'si görünür mü?
    cy.contains('Kayıt ID\'niz:').should('be.visible');
  });
});
