'use strict';

window.addEventListener('hashchange', () => {
  if (window.location.hash === '#menu') {
    document.body.classList.add('page__body--with-menu');
  } else {
    document.body.classList.remove('page__body--with-menu');
  }
});

document
  .getElementById('SendForm')
  .addEventListener('submit', function (event) {
    event.preventDefault();

    console.log(
      'Name: ',
      event.target[0].value,
      ', E-mail: ',
      event.target[1].value,
      ', Message: ',
      event.target[2].value
    );

    document.getElementById('SendForm').reset();
  });
