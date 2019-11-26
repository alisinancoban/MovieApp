import 'bootstrap';
import './scss/app.scss';
import './css/style.css';

var movieController = (function(){
    let Movie = function(id, data){
        this.id = id;
        this.poster = data.Poster;
        this.title = data.Title;
        this.imdbRating = data.imdbRating;
        this.language = data.Language;
        this.actors = data.Actors;
        this.desc = data.Plot;
    };

    let movies = [];

    return {
        addMovie: function(data){
            let newMovie, ID;
            ID = movies.length > 0 ? movies[movies.length - 1].id + 1 : 0;
            newMovie = new Movie(ID, data);
            movies.push(newMovie);
            return newMovie;
        },
        deleteMovie: function(id){
            let index, deleteMovieIDs;
            deleteMovieIDs = movies.map(i => i.id);
            index = deleteMovieIDs.indexOf(id);
            if(index !== -1){
                movies.splice(index,1);
            }                
        },   
        testing: () => {
            console.log(movies);
        }
    };
})();

var UIController = (function(){
    let DOMStrings = {
        movieContainer: ".movie-list",
        input: ".input",
        inputButton: ".add-btn",
        deleteButton: ".delete-btn",
        container: '#movies'
    };

    return {
        addListItem: function(obj){
            let html;           
            html = document.querySelector("#template").innerHTML;
            html=html.replace('_id',obj.id);
            html=html.replace('_src',obj.poster);
            html=html.replace('_alt',obj.title);
			html=html.replace('_title',obj.title);
            html=html.replace('_rate',obj.imdbRating);
            html=html.replace('_language',obj.language);
            html=html.replace('_actors',obj.actors);
            html=html.replace('_desc',obj.desc);

           console.log(document.querySelector(DOMStrings.movieContainer));
            document.querySelector(DOMStrings.movieContainer).insertAdjacentHTML("beforeend", html);
        },
        clearField: function(){
            let fields;

            fields = document.querySelector(DOMStrings.input);
            fields.value = "";
            fields.focus();
        },
        deleteListItem: function(selectorID){
            let element = document.getElementById(selectorID);
            element.parentNode.removeChild(element);
        },
        getDOMStrings: function(){
            return DOMStrings;
        },
        getInput: function(){
            return {
                movieName: document.querySelector(DOMStrings.input).value
            };  
        }
    };
})();


//GLOBAL APP CONTROLLER
var controller = (function(movieCtrl, UICtrl){
    var ctrlAddMovie = function(){
        const URL = "http://www.omdbapi.com/?apikey=9a5b6f54&t=";
        let input, newMovie;
        //get the field input data
        input = UICtrl.getInput();
        if(input.movieName === ""){alert("You must enter a movie name"); return;}
/**********************************************
*** FETCH()
**********************************************/
        fetch(URL+input.movieName)
        .then(result =>{
            return result.json();
        })
        .then(data => {
            if(data.Title === undefined){alert("Movie not found");return;}
            newMovie = movieCtrl.addMovie(data);
            UIController.addListItem(newMovie);
            UIController.clearField();
            return data;
        })
        .catch(error => console.log("Unhandled exception"));

    };
    var ctrlDeleteItem = function(event){
        let itemID, ID;
        console.log("delete");
        itemID = (event.target.parentNode.parentNode.parentNode.parentNode.parentNode.id);
        console.log(itemID);
        if(itemID){
            ID = parseInt(itemID);
            movieCtrl.deleteMovie(ID);
            UICtrl.deleteListItem(itemID);
        }
    };
    var setupEventListeners = function(){
        let DOMStrings = UIController.getDOMStrings();

        document.querySelector(DOMStrings.inputButton).addEventListener("click", ctrlAddMovie);
        document.addEventListener("keypress",function(event){
            if(event.keyCode === 13 || event.which === 13 /*for old browser*/){
                ctrlAddMovie(); 
            }
        });
/*         document.querySelector(DOMStrings.deleteButton).addEventListener("click", ctrlDeleteItem); */
        document.addEventListener('click',function(event){
            if(event.target && event.target.classList.contains('delete-btn')){
                  ctrlDeleteItem(event);
             }
         });

    };
    return {
      init: function(){
          console.log("Application has started.");
          setupEventListeners();
      }  
    };
})(movieController, UIController);

controller.init();

