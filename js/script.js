window.addEventListener('DOMContentLoaded', () => {

  const input = document.querySelector('input'),
        table = document.querySelector('table'),
        spinner = document.querySelector('.spinner'),
        buttons = document.querySelectorAll('.table__button');

  let results;

  const tableHeader = `
    <tr class="table__header">
      <th>id</th>
      <th>Имя</th>
      <th>Эл. почта</th>
      <th>Веб-сайт</th>
    </tr>
  `;

  // table

  class Table {
    constructor(id, name, email, website) {
      this.id = id;
      this.name = name;
      this.email = email;
      this.website = website;

      this.createRow();
    }

    createRow() {
      
      const element = `
        <tr class="table__row">
          <td>${this.id}</td>
          <td class="elastic">${this.name}</td>
          <td><a href="mailto:${this.email}">${this.email}</a></td>
          <td><a href="http://${this.website}">${this.website}</a></td>
        </tr>
      `;
      table.innerHTML += element;
    }
  }

  // server request

  fetch('https://jsonplaceholder.typicode.com/users')
    .then(data => {
      if(data.status === 200) {
        spinner.classList.add('hide');
      }
      return data.json();
    })
    .catch(err => {
      console.error('Fetch error: ', err);
    })
    .then(data => {
      results = data;
      results.forEach(item => {
        new Table(
          item.id, 
          item.name, 
          item.email, 
          item.website
        );
      });
    });

    // sorting by buttons

    function deleteActiveBtn() {
      buttons.forEach(button => {
        button.classList.remove('table__button_active');
      });
    }

    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        const btn = e.target;

        function sortArr(field) {
          return (a, b) => a[field] > b[field] ? 1 : -1;
        }

        function addRow() {
          input.value = '';
          table.innerHTML = tableHeader;
          results.forEach(item => {
            new Table(
              item.id, 
              item.name, 
              item.email, 
              item.website
            );
          });
        }
        

        if(btn.getAttribute('data-classificator') === 'id') {
          results.sort(sortArr('id'));
          addRow();
        }

        if(btn.getAttribute('data-classificator') === 'name') {
          results.sort(sortArr('name'));
          addRow();
        }

        if(btn.getAttribute('data-classificator') === 'reverse' && !btn.classList.contains('table__button_active')) {
          results.sort(sortArr('id'));
          results.reverse();
          addRow();
        }

        deleteActiveBtn();
        btn.classList.add('table__button_active');
      });
    });

    // search

  const debounce = (fn, ms) => {
    let timeout;
    return function() {
      const fnCall = () => fn.apply(this);
      clearTimeout(timeout);
      timeout = setTimeout(fnCall, ms);
    };
  };

  function onChange() {
    let val = this.value.trim();
    let elasticItems = document.querySelectorAll('.elastic');
    
    if(val != '') {
      elasticItems.forEach(item => {
        if(item.textContent.toLowerCase().search(val.toLowerCase()) == -1) {
          item.parentElement.classList.add('hide');    
          
        } else {
          item.parentElement.classList.remove('hide');

        }
      });
    } else {
      elasticItems.forEach(item => {
        item.parentElement.classList.remove('hide');

      });
    }

    let countHide = document.querySelectorAll('table .hide');
    if(elasticItems.length === countHide.length) {
      document.querySelector('.matches').textContent = 'Совпадения отсутствуют 😞';
    } else {
      document.querySelector('.matches').textContent = '';
    }
  }


  const startOnChange = debounce(onChange, 300);

  input.addEventListener('input', startOnChange);
});