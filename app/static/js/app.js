const app = Vue.createApp({
  components: {
    'Home' : Home
  },  
  data() {
    return {
      welcome: 'Hello World! Welcome to VueJS',
      component:{
        'explorePage': explorepage
      }
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

const NotFound = {
  name: 'NotFound',
  template: `
  <div>
      <h1>404 - Not Found</h1>
  </div>
  `,
  data() {
      return {}
  }
};



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

// Define Routes
const routes = [
  { path: "/", component: Home },
  { path:'/explorepage', component:explorepage },
  // Put other routes here

  // This is a catch all route in case none of the above matches
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound }
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes, // short for `routes: routes`
});


app.use(router)
app.mount('#app');
