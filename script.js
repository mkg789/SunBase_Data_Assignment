let bearerToken;
// Authenticate user using the credentials specified
async function login() {
    const name = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    const authenticationResult = await Authentication(name, pass);

    if (authenticationResult) {
        console.log("Success");
        // Redirect to list.html or perform actions after successful authentication
        window.location.href="./list.html";
    } else {
        console.log("Login failed");
    }
}

async function Authentication(loginid, password) {
    const url = 'https://qa2.sunbasedata.com/sunbase/portal/api/assignment_auth.jsp';
    const payload = {
        login_id: loginid,
        password: password
    };
    const headers = {
        'Content-Type': 'application/json'
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const data = await response.json();
            bearerToken = data.access_token;
            console.log('Bearer Token:', bearerToken);
            return true; // Return true on successful authentication
        } else {
            console.error('Authentication failed:', response.status);
            return false; // Return false on failed authentication
        }
    } catch (error) {
        console.error('Authentication failed:', error);
        return false; // Return false on error during authentication
    }
}

function showCustomerForm() {
  const form = document.getElementById('customerForm');
  form.style.display = 'block';
}
// 2. Create a new Customer:
function hideCustomerForm() {
  const form = document.getElementById('customerForm');
  form.style.display = 'none';
}

async function createCustomer(data) {
  const url = 'https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp';
  const token = 'Bearer dGVzdEBzdW5iYXNlZGF0YS5jb206VGVzdEAxMjM='; 
  const headers = {
      'Authorization': token,
      'Content-Type': 'application/json'
  };
  const params = {
    'cmd': 'create'
  };

  try {
      
      const response = await fetch(`${url}?${new URLSearchParams(params)}`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(data)
      });

      if (response.status === 201) {
          console.log('Successfully Created');
          hideCustomerForm(); // Hide the form upon successful submission
      } else if (response.status === 400) {
          console.log('First Name or Last Name is missing');
      } else {
          console.log('Unexpected Error:', response.status);
      }
  } catch (error) {
      console.error('Error:', error);
  }
}

function submitForm(event) {
  event.preventDefault();
  const formData = {
      "first_name": document.getElementById("firstName").value,
      "last_name": document.getElementById("lastName").value,
      "street": document.getElementById("street").value,
      "address": document.getElementById("address").value,
      "city": document.getElementById("city").value,
      "state": document.getElementById("state").value,
      "email": document.getElementById("email").value,
      "phone": document.getElementById("phone").value
  };

  createCustomer(formData);
}
// Get customer list:
const getCustomerListUrl = 'https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp';
const token = 'Bearer dGVzdEBzdW5iYXNlZGF0YS5jb206VGVzdEAxMjM=';

const headers = {
    'Authorization': token
};

const params = {
    'cmd': 'get_customer_list'
};

fetch(`${getCustomerListUrl}?cmd=get_customer_list`, {
    method: 'GET',
    headers: headers
})
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to fetch customer list');
        }
    })
    .then(customerList => {
        const tableBody = document.getElementById('customerList');
        customerList.forEach(customer => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${customer.first_name}</td>
                <td>${customer.last_name}</td>
                <td>${customer.street}</td>
                <td>${customer.address}</td>
                <td>${customer.city}</td>
                <td>${customer.state}</td>
                <td>${customer.email}</td>
                <td>${customer.phone}</td>
                <td><!-- Action button(s) here --></td>
            `;
            tableBody.appendChild(row);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
// Delete a customer
const deleteCustomer = (uuid) => {
  fetch('https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp', {
      method: 'POST',
      headers: {
          'Authorization': 'Bearer dGVzdEBzdW5iYXNlZGF0YS5jb206VGVzdEAxMjM=',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          cmd: 'delete',
          uuid: uuid
      })
  })
  .then(response => {
      if (response.status === 200) {
          console.log('Successfully deleted');
          // Handle success
      } else if (response.status === 500) {
          console.log('Error: Not deleted');
          // Handle failure
      } else if (response.status === 400) {
          console.log('UUID not found');
          // Handle UUID not found
      } else {
          console.log('Unexpected Error:', response.status);
          // Handle other status codes
      }
  })
  .catch(error => {
      console.error('Error:', error);
      // Handle network errors or exceptions
  });
};

// Edit a customer
const editCustomer = (uuid, updatedData) => {
  fetch('https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp', {
      method: 'POST',
      headers: {
          'Authorization': 'Bearer dGVzdEBzdW5iYXNlZGF0YS5jb206VGVzdEAxMjM=',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          cmd: 'update',
          uuid: uuid,
          ...updatedData
      })
  })
  .then(response => {
      if (response.status === 200) {
          console.log('Successfully updated');
          // Handle success
      } else if (response.status === 500) {
          console.log('UUID not found');
          // Handle UUID not found
      } else if (response.status === 400) {
          console.log('Body is Empty');
          // Handle empty body
      } else {
          console.log('Unexpected Error:', response.status);
          // Handle other status codes
      }
  })
  .catch(error => {
      console.error('Error:', error);
      // Handle network errors or exceptions
  });
};
