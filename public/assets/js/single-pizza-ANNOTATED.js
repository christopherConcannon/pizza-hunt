const $backBtn = document.querySelector('#back-btn');
const $pizzaName = document.querySelector('#pizza-name');
const $createdBy = document.querySelector('#created-by');
const $createdAt = document.querySelector('#created-at');
const $size = document.querySelector('#size');
const $toppingsList = document.querySelector('#toppings-list');
const $commentSection = document.querySelector('#comment-section');
const $newCommentForm = document.querySelector('#new-comment-form');

let pizzaId;

function getPizza() {
  // get id of pizza -- what is this? 
  // https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/URLSearchParams
  // https://www.w3schools.com/jsref/prop_loc_search.asp
  // https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/get
  // document.location.search.substring(1) returns the query string, minus the question mark...so 'id=<2358723957957>'.  This gets passed to URLSearchParams constructor which returns an instance that uses its .get() method to return the value of the id param.  That value is then passed as a param to the api route that hits the db to return correct pizza
  const searchParams = new URLSearchParams(document.location.search.substring(1));
  console.log(searchParams);
  const pizzaId = searchParams.get('id');

  // get pizzaInfo
  fetch(`/api/pizzas/${pizzaId}`)
    .then(response => {
      console.log(response);
      // check for a 4xx or 5xx error from server
      if (!response.ok) {
        // why using Error constructor here?
        throw new Error({ message: 'Something went wrong!' });
      }

      return response.json();
    })
    // closure or just implicit passing of data
    .then(printPizza)
    .catch(err => {
      console.log(err);
      alert('Cannot find a pizza with this id! Taking you back.');
      window.history.back();
    })
}

// how does this function get pizzaData as arg if it is not explicitly passed in the calling function above inside getPizza .then() callback?  is that closure or something in the signature of Promise callbacks?  probably not closure because we are receiving parameter here.
function printPizza(pizzaData) {
  console.log(pizzaData);

  pizzaId = pizzaData._id;

  const { pizzaName, createdBy, createdAt, size, toppings, comments } = pizzaData;

  // populate page elements with db data
  $pizzaName.textContent = pizzaName;
  $createdBy.textContent = createdBy;
  $createdAt.textContent = createdAt;
  $size.textContent = size;
  $toppingsList.innerHTML = toppings
    .map(topping => `<span class="col-auto m-2 text-center btn">${topping}</span>`)
    .join('');

  // why validate both?
  if (comments && comments.length) {
    // call printComment for each comment to display
    comments.forEach(printComment);
  } else {
    $commentSection.innerHTML = '<h4 class="bg-dark p-3 rounded">No comments yet!</h4>';
  }
}

function printComment(comment) {
  // make div to hold comment and subcomments
  const commentDiv = document.createElement('div');
  commentDiv.classList.add('my-2', 'card', 'p-2', 'w-100', 'text-dark', 'rounded');

  const commentContent = `
      <h5 class="text-dark">${comment.writtenBy} commented on ${comment.createdAt}:</h5>
      <p>${comment.commentBody}</p>
      <div class="bg-dark ml-3 p-2 rounded" >
        ${ /* if there are any replies in array, map over them to return markup via printReply() function*/
          comment.replies && comment.replies.length
            ? `<h5>${comment.replies.length} ${
                comment.replies.length === 1 ? 'Reply' : 'Replies'
              }</h5>
        ${comment.replies.map(printReply).join('')}`
            : '<h5 class="p-1">No replies yet!</h5>'
        }
      </div>
      <form class="reply-form mt-3" data-commentid='${comment._id}'>
        <div class="mb-3">
          <label for="reply-name">Leave Your Name</label>
          <input class="form-input" name="reply-name" required />
        </div>
        <div class="mb-3">
          <label for="reply">Leave a Reply</label>
          <textarea class="form-textarea form-input"  name="reply" required></textarea>
        </div>

        <button class="mt-2 btn display-block w-100">Add Reply</button>
      </form>
  `;

  commentDiv.innerHTML = commentContent;
  // add newest comments on top
  $commentSection.prepend(commentDiv);
}

function printReply(reply) {
  return `
  <div class="card p-2 rounded bg-secondary">
    <p>${reply.writtenBy} replied on ${reply.createdAt}:</p>
    <p>${reply.replyBody}</p>
  </div>
`;
}

function handleNewCommentSubmit(event) {
  event.preventDefault();

  const commentBody = $newCommentForm.querySelector('#comment').value;
  const writtenBy = $newCommentForm.querySelector('#written-by').value;

  if (!commentBody || !writtenBy) {
    return false;
  }

  const formData = { commentBody, writtenBy };

  fetch(`/api/comments/${pizzaId}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json', 
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Someting went wrong!');
    }
    response.json();
  })
  .then(commentResponse => {
    console.log(commentResponse);
    location.reload();
    printComment(commentResponse);
  })
  .catch(err => {
    console.log(err);
  })
}

function handleNewReplySubmit(event) {
  event.preventDefault();

  if (!event.target.matches('.reply-form')) {
    return false;
  }

  const commentId = event.target.getAttribute('data-commentid');

  const writtenBy = event.target.querySelector('[name=reply-name]').value;
  const replyBody = event.target.querySelector('[name=reply]').value;

  if (!replyBody || !writtenBy) {
    return false;
  }

  const formData = { writtenBy, replyBody };

  fetch(`/api/comments/${pizzaId}/${commentId}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
  .then(commentResponse => {
    console.log(commentResponse);
    location.reload();
  })
  .catch(err => {
    console.log(err);
  })
}

$backBtn.addEventListener('click', function() {
  window.history.back();
});

$newCommentForm.addEventListener('submit', handleNewCommentSubmit);
$commentSection.addEventListener('submit', handleNewReplySubmit);

getPizza();
