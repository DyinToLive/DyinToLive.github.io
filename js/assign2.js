document.addEventListener("DOMContentLoaded", function () {
    /* url of song api --- https versions hopefully a little later this semester */
    const api = 'https://www.randyconnolly.com/funwebdev/3rd/api/music/songs-nested.php';
    /* note: you may get a CORS error if you try fetching this locally (i.e., directly from a
       local file). To work correctly, this needs to be tested on a local web server.  
       Some possibilities: if using Visual Code, use Live Server extension; if Brackets,
       use built-in Live Preview.
    */
    const url = 'https://www.randyconnolly.com/funwebdev/3rd/async-post.php';
    let playlist = [];
    const jsonData = localStorage.getItem("songs");
    if (!jsonData) {
        fetch(api)
            .then(resp => {
                if (resp.ok) {
                    return resp.json();
                }
                else {
                    return Promise.reject({
                        status: resp.status,
                        statusText: resp.statusText
                    })
                } 
            }).then(data => {
                const jsonData = JSON.stringify(data);
                localStorage.setItem("songs", jsonData);
                const artists = JSON.parse(content);
                const genres = JSON.parse(content2);
                const songs = JSON.parse(jsonData);
                //initially sort the songs by title as per instructions.
                const sortByTitle = songs.sort((a, b) => a.title < b.title ? -1 : 1);
                //display the songs when page is opened
                displaySongs(sortByTitle);
                //invoke genre list
                genreSelectList(genres);
                //invoke select list
                artistSelectList(artists);
                sortSongs(songs);
                formFilter(songs);

                document.querySelector("#closeSong").addEventListener("click", function () {
                    let singleSongView = document.querySelector("#singleSong");
                    singleSongView.classList.toggle("hidden");
                });

                document.querySelector("#openFav").addEventListener("click", function () {
                    let favs = document.querySelector("#playlist");
                    favs.classList.toggle("hidden");
                    displayFavs(playlist);
                    let allSongs = document.querySelector("#allSongs");
                    allSongs.classList.add("hidden");
                    allSongs.classList.toggle("hidden");
                });
                

            }).catch(err => {console.log('err=' + err)});
    }
    else {
        const artists = JSON.parse(content);
        const genres = JSON.parse(content2);
        const songs = JSON.parse(jsonData);
        //initially sort the songs by title as per instructions.
        const sortByTitle = songs.sort((a, b) => a.title < b.title ? -1 : 1);
        //display the songs when page is opened
        displaySongs(sortByTitle);
        //invoke genre list
        genreSelectList(genres);
        //invoke select list
        artistSelectList(artists);
        sortSongs(songs);
        formFilter(songs);
        
        document.querySelector("#closeSong").addEventListener("click", function () {
            let singleSongView = document.querySelector("#singleSong");
            singleSongView.classList.toggle("hidden");
        });
        document.querySelector("#openFav").addEventListener("click", function () {
            let favs = document.querySelector("#playlist");
            favs.classList.toggle("hidden");
            displayFavs(playlist);
        });
     
    }
    /*
    * "const ______RadioButton" SORTS FOR TITLE, ARTIST, YEAR, GENRE, POPULARITY BEGIN HERE.
    * each of these event listeners sort the songs by the appropriate field.
    */
    function sortSongs(songs) {
        const titleRadioButton = document.querySelector("#titleRadioButton").addEventListener("click", function () {
            const sortByTitle = songs.sort((a, b) => a.title < b.title ? -1 : 1);
            displaySongs(sortByTitle);
        });

        const artistRadioButton = document.querySelector("#artistRadioButton").addEventListener("click", function () {
            const sortByArtist = songs.sort((a, b) => a.artist.name < b.artist.name ? -1 : 1);
            displaySongs(sortByArtist);
        });
        //year sorted from newest to oldest
        const yearRadioButton = document.querySelector("#yearRadioButton").addEventListener("click", function () {
            const sortByYear = songs.sort((a, b) => a.year > b.year ? -1 : 1);
            displaySongs(sortByYear);
        });

        const genreRadioButton = document.querySelector("#genreRadioButton").addEventListener("click", function () {
            const sortByGenre = songs.sort((a, b) => a.genre.name < b.genre.name ? -1 : 1);
            displaySongs(sortByGenre);
        });
        //popularity sorted from highest to lowest
        const popRadioButton = document.querySelector("#popRadioButton").addEventListener("click", function () {
            const sortByPop = songs.sort((a, b) => a.details.popularity > b.details.popularity ? -1 : 1);
            displaySongs(sortByPop);
        });
        //end of click events for the sort buttons on the main table.
    }
    /*
     * function name: formFilter
     * parameter: songs object
     * this function performs multiple event listeners dependant on certain
     * radio buttons that are clicked for title, artist, genre, year, and popularity.
     * If no radio buttons are selected, a user can input any field value.
     * If radio buttons are selected, the user must use clear to select a different field.
     */
    function formFilter(songs) {
        const title = document.querySelector("#title");
        const titleText = document.querySelector("#titleSearch");
        const artist = document.querySelector("#artist");
        const artistSelect = document.querySelector("#artistSelect")
        const genre = document.querySelector("#genre");
        const genreSelect = document.querySelector("#genreSelect");
        const year = document.querySelector("#year");
        const yearText = document.querySelector("#yearSearch");
        const pop = document.querySelector("#pop");
        const popLess = document.querySelector("#popSearchLess");
        const popGreater = document.querySelector("#popSearchGreater");
        const clearForm = document.querySelector("#clear");

        //clear the contents of the form and enable the input fields for further use
        clearForm.addEventListener("click", function () {
            title.disabled = false;
            const searchForm = document.querySelector("#searchForm");
            searchForm.reset();
            artist.disabled = false;
            genre.disabled = false;
            artistSelect.disabled = false;
            genreSelect.disabled = false;
            pop.disabled = false;
            year.disabled = false;
            titleText.disabled = false;
            popLess.disabled = false;
            popGreater.disabled = false;
            yearText.disabled = false;
            displaySongs(songs);
        });
        // allow user to search using any filter if no input radio buttons are selected
        if (title.disabled == false && genre.disabled == false && artist.disabled == false &&
            year.disabled == false && pop.disabled == false) {
            searchTitles(songs);
            artistSelected(songs);
            genreSelected(songs);
            yearSearch(songs);
            popSearchGreater(songs);
            popSearchLess(songs);
        }
         //disable everything else if title radio is selected
        title.addEventListener("click", function (e) {
            if (title.disabled == false) {
                artist.disabled = true;
                genre.disabled = true;
                genreSelect.disabled = true;
                artistSelect.disabled = true;
                pop.disabled = true;
                popLess.disabled = true;
                popGreater.disabled = true;
                yearText.disabled = true;
                year.disabled = true;
                searchTitles(songs);
            }
        });
         //disable everything else if artist radio is selected
        artist.addEventListener("click", function (e) {
            if (artist.disabled == false) {
                title.disabled = true;
                titleText.disabled = true;
                genre.disabled = true;
                genreSelect.disabled = true;
                popLess.disabled = true;
                popGreater.disabled = true;
                yearText.disabled = true;
                artistSelected(songs);
                pop.disabled = true;
                year.disabled = true;
            }
        });
         //disable everything else if genre radio is selected
        genre.addEventListener("click", function (e) {
            if (genre.disabled == false) {
                artist.disabled = true;
                title.disabled = true;
                artistSelect.disabled = true;
                pop.disabled = true;
                year.disabled = true;
                popLess.disabled = true;
                popGreater.disabled = true;
                yearText.disabled = true;
                titleText.disabled = true;
                genreSelected(songs);
            }
        });
        //disable everything else if year radio is selected
        year.addEventListener("click", function (e) {
            if (year.disabled == false) {
                artist.disabled = true;
                title.disabled = true;
                artistSelect.disabled = true;
                pop.disabled = true;
                genreSelect.disabled = true;
                genre.disabled = true;
                popLess.disabled = true;
                popGreater.disabled = true;
                titleText.disabled = true;
                yearSearch(songs);
            }
        });
        pop.addEventListener("click", function (e) {
            if (pop.disabled == false) {
                artist.disabled = true;
                title.disabled = true;
                artistSelect.disabled = true;
                year.disabled = true;
                genreSelect.disabled = true;
                genre.disabled = true;
                yearText.disabled = true;
                titleText.disabled = true;
                popSearchGreater(songs);
                popSearchLess(songs);
            }
        });
    }
    /*
     * function name: searchTitles
     * parameters: songs json data
     * this function provides an event listener for when a key is typed into the title search bar.
     * the function will search for titles that match the entered keys, then displays them in the 
     * all songs table.
     * */
    function searchTitles(songs) {
        document.querySelector("#titleSearch").addEventListener("keyup", function (e) {
            if (e.target.nodeName == 'INPUT' && e.target) {
                const search = e.target.value.toLowerCase();
                const searchTitles = songs.filter(s => { return s.title.toLowerCase().includes(search) });
                displaySongs(searchTitles);
            }
        });
    }
    /*
     * function name:artistSelected
     * parameters: songs json data
     * this function provides an event listener for a change in the select list for artist. 
     * if the user selects an artist, the table is populated with the matching songs for that artist. 
     */
    function artistSelected(songs) {
        document.querySelector("#artistSelect").addEventListener("change", function (e) {
            if (e.target.nodeName == 'SELECT' && e.target) {
                const search = e.target.value;
                const searchArtists = songs.filter(s => s.artist.name == search);
                displaySongs(searchArtists);   
            }
        });
    }
    /*
     * function name: artistSelectList
     * parameters: artists json data
     * DROPDOWN SELECT LIST FOR ARTISTS
     * this function recieves artist json data, builds option elements for each artist,
     * and appends the option to the select list with the id artistSelect in the index.html page
     * */

    function artistSelectList(artists) {
        const artistSelect = document.querySelector("#artistSelect");
        for (let a of artists) {
            const artistOption = document.createElement("option");
            artistOption.value = a.name;
            artistOption.textContent = a.name;
            artistSelect.appendChild(artistOption);
        }
    }
    /*
     * function name: yearSearch
     * parameters: songs
     * This function creates a search for the year section of the form. When a user
     * types in a year, the corresponding songs will show in the table.
     * */
    function yearSearch(songs) {
        document.querySelector("#yearSearch").addEventListener("keyup", function (e) {
            if (e.target.nodeName == 'INPUT' && e.target) {
                const search = e.target.value;
                const searchYear = songs.filter(s => { return s.year == search });
                displaySongs(searchYear);
            }
        });
    }
    /*
     * function names: popSearchGreater/Less
     * parameters: songs
     * function takes in the songs as a parameter, and ads an event listener to both the 
     * less than and greater than options for popularity. 
     */
    function popSearchGreater(songs) {
        document.querySelector("#popSearchGreater").addEventListener("keyup", function (e) {
            if (e.target.nodeName == 'INPUT' && e.target) {
                const search = e.target.value;
                const searchPop = songs.filter(s => { return s.details.popularity > search });
                displaySongs(searchPop);
            }
        });
    }
    function popSearchLess(songs) {
        document.querySelector("#popSearchLess").addEventListener("keyup", function (e) {
            if (e.target.nodeName == 'INPUT' && e.target) {
                const search = e.target.value;
                const searchPop = songs.filter(s => { return s.details.popularity < search });
                displaySongs(searchPop);
            }
        });
    }
    /*
   * function name:genreSelected
   * parameters: songs json data
   * this function provides an event listener for a change in the select list for genre. 
   * if the user selects an genre, the table is populated with the matching songs for that genre. 
   */
    function genreSelected(songs) {
        document.querySelector("#genreSelect").addEventListener("change", function (e) {
            if (e.target.nodeName == 'SELECT' && e.target) {
                const search = e.target.value;
                const searchGenres = songs.filter(s => s.genre.name == search);
                displaySongs(searchGenres);
            }
        });
    }
    /*
     * function name: genreSelectList
     * parameters: genre json data
     * DROPDOWN SELECT LIST FOR GENRES
     * this function recieves genre json data, builds option elements for each genre,
     * and appends the option to the select list with the id genreSelect in the index.html page
     * */
    function genreSelectList(genres) {
        const genreSelect = document.querySelector("#genreSelect");
        for (let g of genres) {
            const genreOption = document.createElement("option");
            genreOption.value = g.name;
            genreOption.textContent = g.name;
            genreSelect.appendChild(genreOption);
        }
    }

    //function name: displaySongs. 
    //Parameters: a song object. sorts are done on the songs data then passed in to the function.
    //This function creates a table and its elements and displays
    //the passed in song object, and displays it in a table in the form title, artist, year, genre, popularity. 
    function displaySongs(sortedSongs) {
        
        const tableBody = document.querySelector(".allSongsBody");
        tableBody.innerHTML = ""; 

        for (let s of sortedSongs) {
            //console.log(s);
            let tableRow = document.createElement("tr");
            //tableRow.setAttribute("data-songID", s.id);
            let title = document.createElement("td");
            title.value= s.title;
            let a = document.createElement("a");
            a.setAttribute("data-songid", s.song_id);
            a.classList.add("clickTitle");
            a.textContent = s.title;
            a.style.color = "#7289da";
            a.setAttribute("href", "#");
            title.appendChild(a);
            tableRow.appendChild(title);

            let artist = document.createElement("td");
            artist.textContent = s.artist.name;
            tableRow.appendChild(artist);

            let year = document.createElement("td");
            year.textContent = s.year;
            tableRow.appendChild(year);

            let genre = document.createElement("td");
            genre.textContent = s.genre.name;
            tableRow.appendChild(genre);
            /*
             * USE THIS IF THE POPULARITY PROGRESS BARS BREAK
            let popularity = document.createElement("td");
            popularity.textContent = s.details.popularity;
            tableRow.appendChild(popularity);
            tableBody.appendChild(tableRow);
            */
            let popularity = document.createElement("td");
            let div1 = document.createElement("div");
            div1.className = "progress";
            let div = document.createElement("div");
            div.classList.add("progress", "progress-bar", "progress-bar-striped", "active");
            div.ariaRoleDescription = "progressbar";
            div.ariaValueMax = 100;
            div.ariaValuemin = 0;
            div.ariaValueNow = s.details.popularity;
            div.style = "width:" + s.details.popularity + "%";
            popularity.appendChild(div);
            tableRow.appendChild(popularity)

            //<button type="button" class="btn btn-primary">
           // Favorites
               // </button >
            let favorite = document.createElement("td");
            let button = document.createElement("button");
            favorite.appendChild(button);
            button.classList.add("btn", "btn-dark", "addFav");
            let addFav = document.createElement("img");
            addFav.setAttribute("src", "icons/plus-lg.svg");
            button.setAttribute("data-songid", s.song_id);
            button.appendChild(addFav);
            tableRow.appendChild(favorite);
            tableBody.appendChild(tableRow);
        }
        /*
         * add the click event within the build table loop.
         */ 
        const clickTitle = document.querySelectorAll(".clickTitle");
        for (let titles of clickTitle) {
            titles.addEventListener("click", (e) => {
                if (e.target.nodeName == 'A' && e.target) {
                    let id = e.target.getAttribute("data-songid");
                    const single = sortedSongs.find(s => s.song_id == id);
                    //console.log(single);
                    e.preventDefault();
                    //e.stopPropagation();
                    populateSongView(single);

                    populateChart(single);
                }
            });

        }

        const clickFav = document.querySelectorAll(".addFav");
        for (let fav of clickFav) {
            fav.addEventListener('click', (e) => {
                if (e.target.nodeName.toLowerCase() == 'button' && e.target) {
                    let id = e.target.getAttribute('data-songid');
                    let s = sortedSongs.find(s => s.song_id == id);
                    let formBody = new FormData();
                    formBody.set("data-songid", s.song_id);
                    formBody.set("title", s.title);                   
                    const opt = {
                        method: 'POST',
                        body: formBody
                    };
                    //add to the playlist if it is clicked
                    
                    playlist.push(s);
                    displayFavs(playlist);
                    console.log(playlist);
                    fetch(url, opt)
                        .then(resp => resp.json())
                        .then(data => {
                            favAdded(`${data.received.title} was added to favorites`);
                        })
                        .catch(error => {
                            favAdded('An error occurred, favorites not successful');
                        });
                }
            });
        }
    };

    /*function name: populateSongView
     * This function populates the song view of a single song when it is clicked from the list
     * of displayed songs
     * 
    */
    function populateSongView(single) {
        //populate the analytics for the single
        let analytics = document.querySelector("#songDetails");
        analytics.innerHTML = "";

        //energy
        let li = document.createElement("li");
        let img = document.createElement("img");
        img.setAttribute("src", "icons/arrow.png");
        li.textContent = "Energy - " + single.analytics.energy;
        li.insertAdjacentElement("afterbegin", img);
        analytics.appendChild(li);
        //acousticness
        let li2 = document.createElement("li");
        let img2 = document.createElement("img");
        img2.setAttribute("src", "icons/arrow.png");
        li2.textContent = "Acousticness - " + single.analytics.acousticness;
        li2.insertAdjacentElement("afterbegin", img2);
        analytics.appendChild(li2);
        //danceability
        let li3 = document.createElement("li");
        let img3 = document.createElement("img");
        img3.setAttribute("src", "icons/arrow.png");
        li3.textContent = "Danceability - " + single.analytics.danceability;
        li3.insertAdjacentElement("afterbegin", img3);
        analytics.appendChild(li3);
        //liveness
        let li4 = document.createElement("li");
        let img4 = document.createElement("img");
        img4.setAttribute("src", "icons/arrow.png");
        li4.textContent = "Liveness - " + single.analytics.liveness;
        li4.insertAdjacentElement("afterbegin", img4);
        analytics.appendChild(li4);
        //speechiness
        let li5 = document.createElement("li");
        let img5 = document.createElement("img");
        img5.setAttribute("src", "icons/arrow.png");
        li5.textContent = "Speechiness - " + single.analytics.speechiness;
        li5.insertAdjacentElement("afterbegin", img5);
        analytics.appendChild(li5);
        //valence
        let li6 = document.createElement("li");
        let img6 = document.createElement("img");
        img6.setAttribute("src", "icons/arrow.png");
        li6.textContent = "Valence - " + single.analytics.valence;
        li6.insertAdjacentElement("afterbegin", img6);
        analytics.appendChild(li6);

        //populate the title, artist, and icon
        let songHeader = document.querySelector("#songHead");
        let icon = document.createElement("img");
        icon.setAttribute("src", "icons/play.png");
        songHeader.textContent = single.title + " - " + single.artist.name;
        songHeader.insertAdjacentElement("afterbegin", icon);

        //populate the table
        let singleSongView = document.querySelector("#singleSong");
        singleSongView.classList.toggle("hidden");
        //calculations done to get the duration in minutes:seconds
        let minutes = Math.floor(single.details.duration / 60);
        let seconds = parseInt(single.details.duration % 60, 10);

        //build the table to display title, artist name, type, genre, year, and duration
        let singleSongBody = document.querySelector(".singleSongBody");
        singleSongBody.innerHTML = "";
        let tableRow = document.createElement("tr");

        let title = document.createElement("td");
        title.textContent = single.title;

        let artistName = document.createElement("td");
        artistName.textContent = single.artist.name;

        let genre = document.createElement("td");
        genre.textContent = single.genre.name;

        let year = document.createElement("td");
        year.textContent = single.year;

        let duration = document.createElement("td");
        duration.textContent = minutes + ":" + seconds;

        tableRow.appendChild(title);
        tableRow.appendChild(artistName);
        tableRow.appendChild(genre);
        tableRow.appendChild(year);
        tableRow.appendChild(duration);
        singleSongBody.appendChild(tableRow);
        //end of populate song
    }
    function favAdded(msg) {
        const s = document.querySelector("#snackbar");
        s.textContent = msg;
        s.classList.add("show");
        setTimeout(() => {
            s.classList.remove("show");
        }, 2000);
    }

  
    //function name: populateChart
    //Function builds a radarChart using the canvas tag and the chart from chart.js 
    //the details of the chart are the analytics for a single song
    function populateChart(single) {
        const ctx = document.getElementById('radarChart');
        //if chart exists, destroy it before building new chart
        if (this.myChart) {
            this.myChart.destroy();
            this.myChart = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: ['Energy',
                        'Danceability',
                        'Liveness',
                        'Valence',
                        'Acousticness',
                        'Speechiness'],
                    datasets: [{
                        label: 'Song Analytics',
                        data: [single.analytics.energy, single.analytics.danceability, single.analytics.liveness,
                        single.analytics.valence, single.analytics.acousticness, single.analytics.speechiness],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
            
        }
        else {
            //build chart if doesnt exist
        this.myChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Energy',
                    'Danceability',
                    'Liveness',
                    'Valence',
                    'Acousticness',
                    'Speechiness'],
                datasets: [{
                    label: 'Song Analytics',
                    data: [single.analytics.energy, single.analytics.danceability, single.analytics.liveness,
                    single.analytics.valence, single.analytics.acousticness, single.analytics.speechiness],
                    borderWidth: 1,
                    fill: true,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgb(54, 162, 235)',
                    pointBackgroundColor: 'rgb(54, 162, 235)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(54, 162, 235)'
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        }
    }
    
    function displayFavs(playlist) {
        const tableBody = document.querySelector(".playlistBody");
        tableBody.innerHTML = "";

        for (let s of playlist) {
            //console.log(s);
            let tableRow = document.createElement("tr");
            //tableRow.setAttribute("data-songID", s.id);
            let title = document.createElement("td");
            title.value = s.title;
            let a = document.createElement("a");
            a.setAttribute("data-songid", s.song_id);
            a.classList.add("clickTitle");
            a.textContent = s.title;
            a.style.color = "#7289da";
            a.setAttribute("href", "#");
            title.appendChild(a);
            tableRow.appendChild(title);

            let artist = document.createElement("td");
            artist.textContent = s.artist.name;
            tableRow.appendChild(artist);

            let year = document.createElement("td");
            year.textContent = s.year;
            tableRow.appendChild(year);

            let genre = document.createElement("td");
            genre.textContent = s.genre.name;
            tableRow.appendChild(genre);
            /*
             * USE THIS IF THE POPULARITY PROGRESS BARS BREAK
            let popularity = document.createElement("td");
            popularity.textContent = s.details.popularity;
            tableRow.appendChild(popularity);
            tableBody.appendChild(tableRow);
            */
            let popularity = document.createElement("td");
            let div1 = document.createElement("div");
            div1.className = "progress";
            let div = document.createElement("div");
            div.classList.add("progress", "progress-bar", "progress-bar-striped", "active");
            div.ariaRoleDescription = "progressbar";
            div.ariaValueMax = 100;
            div.ariaValuemin = 0;
            div.ariaValueNow = s.details.popularity;
            div.style = "width:" + s.details.popularity + "%";
            popularity.appendChild(div);
            tableRow.appendChild(popularity)

            //<button type="button" class="btn btn-primary">
            // Favorites
            // </button >
            let favorite = document.createElement("td");
            let button = document.createElement("button");
            favorite.appendChild(button);
            button.classList.add("btn", "btn-dark", "remFav");
            let addFav = document.createElement("img");
            addFav.setAttribute("src", "icons/esc.png");
            button.setAttribute("data-songid", s.song_id);
            button.appendChild(addFav);
            tableRow.appendChild(favorite);
            tableBody.appendChild(tableRow);
        }
      
        /*
         * add the click event within the build table loop.
         */
        const clickTitle = document.querySelectorAll(".clickTitle");
        for (let titles of clickTitle) {
            titles.addEventListener("click", (e) => {
                if (e.target.nodeName == 'A' && e.target) {
                    let id = e.target.getAttribute("data-songid");
                    const single = playlist.find(p => p.song_id == id);
                    //console.log(single);
                    e.preventDefault();
                    //e.stopPropagation();
                    populateSongView(single);
                    populateChart(single);
                }
            });

        }
   
        const clickFav = document.querySelectorAll(".remFav");
        for (let rem of clickFav) {
            rem.addEventListener('click', (e) => {
                if (e.target.nodeName.toLowerCase() == 'button' && e.target) {
                    let id = e.target.getAttribute('data-songid');
                    let s = playlist.find(p => p.song_id == id);
                    playlist.pop(s);
                    displayFavs(playlist);
                }
            });  
        }
    }
});
