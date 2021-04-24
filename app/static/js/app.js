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
          if (jsonResponse.status == 200) {
              self.alertText = jsonResponse.message;
              // alert(self.alertText);
              self.errors = []
              displayAlert.classList.add("alert-success");
              displayAlert.classList.remove("alert-danger");
              let jwt_token = jsonResponse.token;
              sessionStorage.setItem('token',jwt_token)
              router.push('explorepage')
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
  <div id="new_user">
  <h2> Registration </h2>
  </div> 
 
  <form @submit.prevent="registerUser" method="POST" enctype="multipart/form-data" id="register_form">
  <div class="forms">
      <label> Username </label><br>
      <input type="text" name="username"><br>
      <label> Password </label><br>
      <input type="text" name="password"><br>
      <label> Full Name </label><br>
      <input type="text" name="name"><br>

      <label> Email </label><br>
      <input type="text" name="email"><br>
      <label> Location </label><br>
      <input type="text" name="location"><br>
      <label> Biography </label><br>
      <textarea name="biography"> </textarea><br>
      <label> Upload Photo: </label><br>
      <input type="file" name="photo">
  </div>
      <button class="btn btn-primary mb-2"> Register </button>
  </form>
  </div> 
  `,

  methods: {
    registerUser(){
        let self = this;
        let register_Form = document.getElementById('register_form');
        let userData = new FormData(register_Form);
        fetch("/api/register", {
            method: 'POST',
            body: userData,
            headers: {
                'X-CSRFToken': token
                 },
          credentials: 'same-origin'
           })
            .then(function (response) {
            return response.json();
            })
            .then(function (jsonResponse) {
            console.log(jsonResponse);
            router.push('login')
            })
            .catch(function (error) {
            console.log(error);
            });

        }
},  

};
const logout = {
  name: 'logout',
  template:`
  `
}

const users = {
  name: 'users',
  template:`
  <div class="user-profile">
    <h2>User {{$route.params.UID}}</h2>
  </div>
  `,
  created() {
    let self = this;
    fetch('/api/users/' + self.$route.params.UID,
    {
      headers: { 
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ'
      }
    })
  
    .then(function(response) {
      return response.json()
    })
  
    .then(function(data) {
      self.car = data
      });
    },
}

const cars = {
  name: 'newcar',
  template:`
  `
}

const car_id = {
  name: 'carid',
  template:`
  <div class="car-details">
  <h1 v-if="car">{{car.id}}</h1>
    <p> {{ car.make }} {{ car.model }} </p>
  </div>
  `,
  created() {
    let self = this;
    fetch('/api/cars/' + self.$route.params.CID,
    {
      method: 'GET',
      headers: { 
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'), 'X-CRFToken': token
      }
    })
  
    .then(function(response) {
      return response.json()
    })
  
    .then(function(data) {
      console.log(data)
      self.car = data
      });
    },
    data() {
      return { car: []
      }
    },
    
}


const explorepage={
  name: 'explorepage',
  template: ` 
  <div class="cars">
      <h2>Explore</h2>
      
      </div>
  
<form @submit.prevent="Viewdetails" methods="GET" id="searchform"  enctype="multipart/form-data">
 <div class= form-group>
  <textfield type="text" rows="3" cols="30" id="des" name=""></textfield>
  <br/>
  <br/>
  <label for="make">Make</label><br/>
  <input type="text" name="searchformake" v-model="searchMake" />
  <br/>
  <br/>
  <label for="model">Model</label><br/>
  <input type="text" name="searchformodel" v-model="searchModel" />
  <br/>
  <br/>
  
  <button id="but" type="submit" name="submit">Submit</button>
  </div>
  </form>
 


<ul class="cars__list">
<li v-for="car in cars"

class="cars__item">
<img id="car-img" :src="'/static/uploads/' + car.photo" alt="car img"> 


<button class="btn btn-primary mb-2"
@click="searchCars(car.id)">View more Details</button>
</li>
</ul>`,

created() {
  let self = this;
  fetch('/api/cars',
  {
    headers: { 
      'Authorization': 'Bearer ' + sessionStorage.getItem('token'), 'X-CRFToken': token
    }
  })

  .then(function(response) {
    return response.json();
  })

  .then(function(data) {
    self.cars = data;
    });
  },

  data() {
    return { cars: [], searchformake: '',searchformodel: ''
    }
  },

  methods:{
    Viewdetails(){
      let self=this;
      let searchform= document.getElementById('searchform');
      let form_data= new FormData(searchform);

      fetch('/api/search?searchformake=' +self.searchMake+ '&searchformodel=' +self.searchModel, { 
        
        method: 'GET',
        headers: { 
          'Authorization': 'Bearer ' + sessionStorage.getItem('token'), 'X-CRFToken': token
        }
      })
      .then(function (response) {
        return response.json();
        })
        .then(function (jsonResponse) {
          self.cars=jsonResponse.response
          console.log(jsonResponse);
          })
          .catch(function (error) {
            //this.errormessage = "Something went wrong"
            console.log(error);
            });

    }
  },
    searchCars(id) {
      router.push('/cars/' + id)
      

    }

};

const Home = {
  name: 'Home',
  template: `
  <div class= 'home-page'>
    <div class ='main'>
        <h2>Buy and Sell Cars Online</h2>
        <p> United Auto Sales provides the fastest, easiest and most user friendly way to buy or sell cars online.
        Find a Great Price and the Vehicle You Want </p>
      <br>
     <button id="reg_btn" @click="$router.push('register')" type="button" class="btn btn-success">Register</button>
      <button id="login_btn" @click="$router.push('login')" type="button" class="btn btn-primary">Login</button>
      <div class='home-img'>
          <img src="/static/images/homepage_img.jpg" class="" alt="luxurycar">            
      </div>  
      
     
     </div>
  </div> 
  `, 
  data(){
    return{}
  }
};

  const app = Vue.createApp({
    data() {
      return {
        welcome: 'Hello World! Welcome to VueJS',
        components:{
          'explorepage': explorepage,
          'users/UID': users,
          'cars/CID':car_id,
          'loginPages' : Login,
          'register': register
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
                  <a class="nav-link" href="#">Login</a>
                </li>
                <li class="nav-item">
                <a class="nav-link" href="#">Logout</a>
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
    { path: '/users/:UID', component: users},
    { path: '/cars/new', component: cars },  
    { path: '/cars/:CID', component: car_id}
  ]
});

app.use(router);
app.mount('#app');
