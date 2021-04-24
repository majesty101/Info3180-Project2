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
  <h1> Logging out user <h1>
  `,
  created() {
    let self = this;
    fetch('/api/auth/logout',
    {
      method: 'POST',
      headers: { 
        'X-CSRFToken': token
      }
    })
  
    .then(function(response) {
      return response.json()
    })
  
    .then(function(result) {
      if (result.status == 200){
        sessionStorage.removeItem('token')
        router.push('/')
      } 
      });
    },

}
const users = {
  name: 'users',
  template:`
  <div class="user-profile">
    <h2>User {{user.id}}</h2>
  </div>
  `,
  created() {
    let self = this;
    fetch('/api/users/' + self.$route.params.UID,
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
      self.user = data
      });
    },
    data() {
      return { user: []
      }
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
  self.searchMake = ''
  self.searchModel = ''
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
          console.log(jsonResponse)
          self.cars=jsonResponse
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
              <li v-if='!isLoggedIn' class="nav-item">
                <router-link to="/" class="nav-link">Home</router-link>
                </li>
                <li v-if='!isLoggedIn' class="nav-item">
                <router-link to="/login" class="nav-link">Login</router-link>
                </li>
                <li v-if='isLoggedIn' class="nav-item">
                <router-link to="/explorepage" class="nav-link">Explore</router-link>
                </li>
                <li v-if='isLoggedIn' class="nav-item">
                <router-link to="/cars/new" class="nav-link">Add Car</router-link>
                </li>
                <li v-if='isLoggedIn' class="nav-item">
                <router-link v-bind:to="'/users/' + currentUser" class="nav-link">My Account</router-link>
                </li>
                <li v-if='isLoggedIn' class="nav-item">
                <router-link to="/logout" class="nav-link">Logout</router-link>
                </li>
                <li v-if='!isLoggedIn' class="nav-item">
                <router-link to="/register" class="nav-link">Register</router-link>
                </li>
              </ul>
            </div>
          </nav>
      </header>    
  `,
  computed:{
    currentUser: function(){
      return user
    },
    isLoggedIn: function(){
      if (sessionStorage.getItem('token')){
        return true
      }else{
        return false
      }
    }
  },
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
