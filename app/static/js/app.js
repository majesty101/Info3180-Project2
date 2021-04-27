const Login = {
  name: 'loginPage',
  template:`
  <div class="login-container">
  <h2> {{displayTitle}} </h2>
  <form @submit.prevent="login" method="post" id="loginForm">

      <div class="alert" id="showAlert">
          {{alertText}}
          <ul>
              <li v-for = "showError in errors"> {{showError}} </li>
          </ul>
      </div>
      <div class="logincard">
          <div class="form-group">
              <label for ="username" class="form-control-label">Username</label>
              <input type="text" class="form-control" name="username">
              <label for="password">Password</label>
              <input type="password" class="form-control" name="password">
              <button type="submit"  class="btn btn-primary">Login</button>
              </div>
      </div>
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
  
  <div class="new_user">
    <h2>Register New User</h2>   
    <form @submit.prevent="registerUser" method="POST" enctype="multipart/form-data" id="register_form">
      <div class = "registerform">
      
       <div class= "row">
          <div class= "column1">
             <label> Username </label><br>
             <input type="text" name="username"><br>

            </div> 
          <div class="column">
              <label> Password </label><br>
              <input type="password" name="password"><br>
          </div>
        </div>  

        <div class = "row">
          <div class= "column1">
            <label> Full Name </label><br>
            <input type="text" name="name"><br>
            
          </div>
          <div class= "column">
            <label> Email </label><br>
            <input type="text" name="email"><br>
          </div>
        </div>

      <label> Location </label><br>
      <input type="text" name="location"><br>

      <label> Biography </label><br>
      <textarea rows="4" class="bio" name="biography"> </textarea><br>

      <label> Upload Photo: </label><br>
      <input id="browse1" type="file" name="photo"> <br>
      <button class="btn btn-primary mb-2"> Register </button>

    </div> 
    
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
  <div class='user-profile'> 
    
      <div class='photo'><img id="car-img" :src="'/static/uploads/' + user.photo" alt="user img"> </div>
      <div class='details'> 
    <H2> {{user.name}}</H2>
    <p class = "user_at"> @{{user.username}} </p> 
    <p class = "profile-text"> {{user.biography}} </p>
      <div class='flex-row'> 
        <div class='column'>
          <label>Email:</label><br>
          <label>Location:</label><br>
          <label>Date Joined:</label>

        </div>
        <div class='column2'>
          <p>{{user.email}}</p>
          <p>{{user.location}}</p>
          <p>{{user.date_joined}}</p>
        </div>



      </div>

    </div>
  </div>



              
    <h2 class="fav-cars"> Cars Favourited </h2>
    <div class = "row">


    <div class= "cars">
    <ul class="cars__list">
    <li v-for="car in cars" class="cars__item">
      <div class="detailcard-group">
        <div class="detailcard">
          <img id="car-img" :src="'/static/uploads/' + car.photo" alt="car img"> 
            <div class= "top">
              <div class= "head1">
                <h5> {{car.year}} </h5>
                <h5> {{car.make}} </h5>
              </div>
              <div class="price">
                  <img id = "price-tag" src = "/static/price-tag.png">
                  <p class="text"> {{car.price}}</p>
              </div>
            </div>
              <p class="text"> {{car.model}}</p>
          </div>
              <button id="bluebtn" @click="searchCars(car.id)">View more Details</button>
      </div>
    </li>
    </ul>
    </div>`, 

  data() {
    return { user: [], cars: []
    }
  },
  created() {
    let self = this;
    this.getFavs()
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

    methods:{
      getFavs: function(){
        let self=this;
        
        fetch('/api/users/' + user + '/favourites',{ 
          
          method: 'GET',
          headers: { 
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'), 'X-CRFToken': token
          }
        })
        .then(function (response) {
          return response.json();
          })
          .then(function (data) {
            self.cars=data
            })
            .catch(function (error) {
              //this.errormessage = "Something went wrong"
              console.log(error);
              });
      }

      
    },

}

const cars = {
  name: 'newcar',
  template:`
  
  <div class = "new_user">
  <h2 id= "addcar2"> Add New Car </h2>
  <form v-on:submit.prevent="registerCar" method="POST" enctype="multipart/form-data" id="addcarForm">
  <div class = "registerform">
      <div class= "row">
          <div class= "column1">
             <label> Make </label><br>
             <input type="text" name="make"><br>
            </div> 
          <div class= "column">
            <label> Model </label><br>
            <input type="text" name="model"><br>

           </div> 
        </div>
        <div class="row">
          <div class= "column1">
            <label> Colour </label><br>
            <input type="text" name="colour"><br>
          </div> 
          <div class= "column">
            <label> Year </label><br>
            <input type="text" name="year"><br>
          </div>
        </div>
        <div class = "row">
            <div class= "column1">
              <label> Price </label><br>
              <input type="text" name="price"><br>
            </div>
            <div class="column">
                  <label> Car Type </label><br>
                  <select name="car_type"> 
                      <option value="SUV" placeholder="SUV"> SUV </option>
                      <option value="CONVERTIBLE"> Convertable </option>
                      <option value="HATCHBACK"> Hatchback </option>
                      <option value="Coupe"> Coupe </option>
                  </select><br>
            </div>
        </div>
           
        <label> Transmission </label><br>
        <select name="transmission"> 
            <option value=Automatic> Automatic </option>
            <option value=Manual> Manual </option>
        </select><br>
        <label> Description </label><br>
        <textarea name="description" rows="4" class="bio"> </textarea><br>
        <label> Upload Photo: </label><br>
        <input id= "browse2" type="file" name="photo"><br>
        <button class="btn btn-success" > Save </button>
    
</div>
</form>
</div>

  `,
  methods: {
    registerCar(){
        let car_fourm = document.getElementById('addcarForm');
        let carData = new FormData(car_fourm);
        let self = this;
        fetch('/api/cars' ,
        {
          method: 'POST',
          body: carData,
          headers: { 
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'), 'X-CSRF-Token': token

          },
          credentials: 'same-origin'
        })
      
            .then(function (response) {
            return response.json();
            })
            .then(function (jsonResponse) {
            console.log(jsonResponse);
            })
            .catch(function (error) {
            console.log(error);
            });

        }
},  
}

const car_id = {
  name: 'carid',
  template:`
  <div class="car-details">
  <h1 v-if="car">{{car.id}}</h1>
    <p> {{ car.make }} {{ car.model }} </p>
  </div>

  <div>
  <div class="cars-container">
      <div class="car-info">
          <div class="img-box">
              <img id="car-pic" :src="'/static/uploads/' + photo" alt="Pic of car" class="car-image"> 
          </div>

          <div class = "car-body">
              <div class = "year-of-model">
                      <h2 class = "car-title">  {{ year }}  {{ make }} </h2> <br> 
              </div>

              <p class="car-model"> {{model}} </p>  
              <p class="car-text"> {{description}} </p>

              <div class = "row">
                  <div class = "column">
                      <label>Colour</label>
                      <p class="car-text"> {{colour}} </p> <br>
                  </div>
                  <div class = "column">
                      <label>Body Type</label>
                      <p class="car-text"> {{car_type}} </p> <br>
                  </div>
              </div>

              <div class = "row">
                  <div class = "column">
                      <label>Price</label>
                      <p class="car-text"> {{price}} </p> <br>
                  </div>

                  <div class = "column">
                      <label>Transmission</label>
                      <p class="car-text"> {{transmission}} </p> <br>
                  </div>

              </div>
              <div class = "car-btns">
                  <button class="btn" > Email Owner </button>
                  <button v-if="faved" type="button" class="btn-circle">
                      <img src="/static/heart.png"> 
                  </button>
                  <button v-else" @click="favouritecar(car.id)" type = "submit" class="btn-circle" >  
                      <img src="/static/outline.png"> 
                  </button>
              </div>

          </div>
      </div>
  </div>
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
    methods: {
      favouritecar(id){
        fetch('/api/cars/' + id + '/favourite',
        {
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
            })
            .catch(function (error) {
              //this.errormessage = "Something went wrong"
              console.log(error);
              });
  
      }
    }
    
}


const explorepage={
  name: 'explorepage',
  template: ` 
  <div class="cars">
  <h2>Explore</h2>
  <div class = "explore-card"> 
    <form @submit.prevent="Viewdetails" methods="GET" id="searchform"  enctype="multipart/form-data">
      <div class="class-group">
      <div class = "col">
        <label for="make">Make</label>
        <br><input type="text" name="searchformake" v-model="searchMake" />
      </div>
      <div class = "col">
        <label for="model">Model</label>
        <br><input type="text" name="searchformodel" v-model="searchModel" />
      </div>         
      <div class = "explore-btn">
        <button id="but" type="submit" name="submit">Search</button>
      </div>
      </div>
    </form>
  </div>
     
  </div>
 

  <div class= "cars">
<ul class="cars__list">
<li v-for="car in cars" class="cars__item">
  <div class="detailcard-group">
    <div class="detailcard">
      <img id="car-img" :src="'/static/uploads/' + car.photo" alt="car img"> 
        <div class= "top">
          <div class= "head1">
            <h5> {{car.year}} </h5>
            <h5> {{car.make}} </h5>
          </div>
          <div class="price">
              <img id = "price-tag" src = "/static/price-tag.png">
              <p class="text"> {{car.price}}</p>
          </div>
        </div>
          <p class="text"> {{car.model}}</p>
      </div>
          <button id="bluebtn" @click="searchCars(car.id)">View more Details</button>
  </div>
</li>
</ul>
</div>`,

created() {
  let self = this;
  self.searchMake = ''
  self.searchModel = ''
  fetch('/api/cars',
  {
    method:'GET',
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
          

    },
    searchCars(id) {
      router.push('/cars/' + id)
      

    },
    

  },
  


};

const Home = {
  name: 'Home',
  template: `
  <div class= 'home-page'>
    <div class ='main'>
        <h2>Buy and Sell Cars Online</h2>
        <p> United Auto Sales provides the fastest, easiest and most user friendly way to buy or sell cars online.
        Find a Great Price and the Vehicle You Want </p>
        <button id="reg_btn" @click="$router.push('register')" type="button" class="btn btn-success">Register</button>
        <button id="login_btn" @click="$router.push('login')" type="button" class="btn btn-primary">Login</button>
    </div>
    <div class='home-img'>
      <img src="/static/homepage-img.jpg" class="homepage-img" alt="luxurycar">            
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
