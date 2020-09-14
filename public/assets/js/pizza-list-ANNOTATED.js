// empty target div to display results
const $pizzaList = document.querySelector('#pizza-list');

// fetch pizzas from db
const getPizzaList = () => {
	fetch('/api/pizzas')
		.then((response) => response.json())
		.then((pizzaListArr) => {
			// call printPizza for each result to display pizza.  no need to explicitly pass arguments to forEach callback
			pizzaListArr.forEach(printPizza);
		})
		.catch((err) => {
			console.log(err);
		});
};

// dynamically display each pizza.  destructure pizza properties from db results
const printPizza = ({
	_id,
	pizzaName,
	toppings,
	size,
	commentCount,
	createdBy,
	createdAt
}) => {
	const pizzaCard = `
    <div class="col-12 col-lg-6 flex-row">
      <div class="card w-100 flex-column">
        <h3 class="card-header">${pizzaName}</h3>
        <div class="card-body flex-column col-auto">
          <h4 class="text-dark">By ${createdBy}</h4>
          <p>On ${createdAt}</p>
          <p>${commentCount} Comments</p>
          <h5 class="text-dark">Suggested Size: ${size}
          <h5 class="text-dark">Toppings</h5>
          <ul>
            ${/* loop over toppings sub-array */ ''}
            ${toppings
				.map((topping) => {
					return `<li>${topping}</li>`;
				})
				.join('')}
          </ul>
          ${/* how does href know which single pizza to go to?  It loads '/pizza' route.  the pizza.html page has it's own .js file which uses query string to find correct pizza from db */ ''}
          <a class="btn display-block w-100 mt-auto" href="/pizza?id=${_id}">See the discussion.</a>
        </div>
      </div>
    </div>
  `;

	$pizzaList.innerHTML += pizzaCard;
};

getPizzaList();
