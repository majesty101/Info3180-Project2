const Login = {
  name: 'loginPage',
  template:`
  <div>
  <h2> {{displayTitle}} </h2>
  <form @submit.prevent="login" method="post" id="loginForm">

      <div class="alert" id="showAlert">
          {{alertText}}
          <ul>
              <li v-for = "showError in errors"> {{showError}} </li>
          </ul>
      </div>         
      <div class="form-group">
          <label for ="username" class="form-control-label">Username</label>
          <input type="text" class="form-control" name="username">
      </div>

      <div class="form-group">
          <label for="password">Password</label>
          <input type="password" class="form-control" name="password">
      </div>
      
      <button type="submit"  class="btn btn-primary">Login</button>
  </form>
</div>
`,
data() {
  return {
      displayTitle: 'Login to your account',
      alertText: '',
      errors: []
  }
},
methods: {
  login() {
      let self = this;
      let loginForm = document.getElementById('loginForm');
      let form_data = new FormData(loginForm);
      let displayAlert = document.getElementById('showAlert');

      fetch("/api/auth/login", {
          method: 'POST',
          body: form_data,
          headers: {
              'X-CSRFToken': token
          },
          credentials: 'same-origin'
      }).then(function(response) {
          return response.json();
      }).then(function(jsonResponse) {
          // display a success message or error/s, depending
          displayAlert.style.display = "block";
          console.log(jsonResponse.status);
          if (jsonResponse.status == 200) {
              self.alertText = jsonResponse.message;
              // alert(self.alertText);
              self.errors = []
              displayAlert.classList.add("alert-success");
              displayAlert.classList.remove("alert-danger");
          } else if (jsonResponse.status == 500) {
              self.errors = jsonResponse.errors;
              self.alertText = "";
              displayAlert.classList.add('alert-danger');
              displayAlert.classList.remove('alert-success');
          }
      }).catch(function(error) {
          console.log(error);
          self.errors = error;
      });


  }

},
mounted() {
  document.getElementById("showAlert").style.display = "none";
}

};

const register = {
  name: 'register',
  template:`
  `
}
const logout = {
  name: 'logout',
  template:`
  `
}

const users = {
  name: 'users',
  template:`
  `
}

const cars = {
  name: 'newcar',
  template:`
  `
}

const car_id = {
  name: 'carid',
  template:`
  `
}


const explorepage={
  name: 'explorepage',
  template: ` 
  <div class="cars">
      <h2>Explore</h2>
      
  </div>
  <div class="form-group mx-sm-3 mb-2">
        <label class="sr-only" for="search">Search</label>
        <input type="search" name="search" v-model="searchTerm"
        id="search" class="form-control mb-2 mr-sm-2" placeholder="Enter search term here" />
        <input type="search" name="search" v-model="searchTerm"
        id="search" class="form-control mb-2 mr-sm-2" placeholder="Enter search term here" />
        <button class="btn btn-primary mb-2"
          @click="searchNews">Search</button>
      </div>
      <ul class="cars__list">
        <li v-for="car in cars"
        class="cars__item">{{car.photo}}{{ car.title }}{{car.price}}</li>
        <button class="btn btn-primary mb-2"
        @click="searchNews">View more Details</button>
      </ul>`,


created() {
  let self = this;
  fetch('https://localhost/api/cars',
  {
    headers: { 
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ'
    }
  })

  .then(function(response) {
    return response.json();
  })

  .then(function(data) {
    console.log(data);
    self.cars = data.cars;
    });
  },

  data() {
    return { cars: [], searchTerm: ''
    }
  },
  methods: {
    searchCars() {
      let self = this;
      fetch('https://localhost/api/cars'+ self.searchTerm + '&language=en', {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ'
      })
      
      .then(function(response) {
        return response.json();
      })

      .then(function(data) {
        console.log(data);
        self.cars = data.cars;
      });
    }
  }
};

const Home = {
  name: 'Home',
  template: `
  <div class="home">
    <img src="/static/images/logo.png" alt="VueJS Logo">
    <h1>{{ welcome }}</h1>
  </div>
  `,

    data() {
      return { welcome: 'Hello World! Welcome to VueJS'}
    }
  };

 const app = Vue.createApp({
    components: {
        'Home' : Home,
        'explorepage' : explorepage,
        'loginPage' : Login
    },    
    data() {
        return {
          welcome: 'Hello World! Welcome to VueJS'
        }
    }
  });


app.component('app-header', {
  name: 'AppHeader',
  template: `
      <header>
          <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
            <a class="navbar-brand" href="#">United Auto Sales</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <ul class="navbar-nav mr-auto">
                <li class="nav-item active">
                  <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#"></a>
                </li>
              </ul>
            </div>
          </nav>
      </header>    
  `,
  data: function() {
    return {};
  }
});

app.component('app-footer', {
  name: 'AppFooter',
  template: `
      <footer>
          <div class="container">
              <p>Copyright &copy {{ year }} Flask Inc.</p>
          </div>
      </footer>
  `,
  data: function() {
      return {
          year: (new Date).getFullYear()
      }
  }
})

const router =VueRouter.createRouter({
  history:VueRouter.createWebHistory(),
  routes:[
    { path: '/', component: Home },
    { path: '/explorepage', component:explorepage },
    { path: '/login', component: Login },
    { path: '/register', component: register },
    { path: '/logout', component: logout },
    { path: '/users/{user_id}', component: users},
    { path: '/cars/new', component: cars },  
    { path: '/cars/{card_id}', component: car_id}
  ]
});

app.use(router);
app.mount('#app');
