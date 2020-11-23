// component should live in header. Should be a classic search bar

/* save results to context, and redirect to Component based on what search type is set to (user-related searches
    we would go to SearchUserItem, for searches directed at finding new anime send to SearchListItem) 
    in ComponentDidMount for respective redirect, make api call */
import React, { Component } from 'react';
import OtakuContext from '../../contexts/OtakuContext';

import KitsuApiService from '../../services/kitsuApiService';

import  { Redirect, withRouter } from 'react-router-dom';
import './SearchBar.css'

class SearchBar extends Component {
    state = {
        error: null,
        searchTerm: '',
        searchOption: '',
    }

    static contextType = OtakuContext

    componentDidMount() {
        KitsuApiService.getAnimesBySearchTerm('cowboy bebop')
            .then(res => console.log(res));
    }

    fetchKitsuAnimeData(searchTerm) {
        KitsuApiService.getAnimesBySearchTerm(searchTerm)
        .then(res => {           
            /*  set an object where each genreId's value is the genre title this is
                needed to avoid subsequent api calls to the kitsu api for genre data */
            let genreObject = {}
            res.included.map(genre => {
                return genreObject[genre.id] = genre.attributes.title
            })               
            
            // create an array of anime objects with only the data necessary for our purposes.
            let animeArray = []
            res.data.forEach(anime => {
                let animeObject = {};
                animeObject = {
                    title: anime.attributes.canonicalTitle,
                    description: anime.attributes.description,
                    smallImage: anime.attributes.posterImage.tiny,
                    mediumImage: anime.attributes.posterImage.medium,
                    rating: anime.attributes.averageRating,
                    episodeCount: anime.attributes.episodeCount,
                    genres: anime.relationships.categories.data.map(genre => {
                        return genreObject[genre.id]
                    })
                }                
                animeArray.push(animeObject)
            })

            this.context.setKitsuAnimeData(animeArray);         
            
        })
        .catch(error => this.context.setError(error))
         
    }

    handleSubmit = (event) => {
        event.preventDefault();
        console.log('search submitted');
        this.context.setSearchTerm(this.state.searchTerm);
        this.context.setSearchOption(this.state.searchOption);
        this.fetchKitsuAnimeData(this.state.searchTerm)                   
        this.props.history.push('/results');    
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value})
    }    

    render() {
        return (
            <div>
                <form className="DashSearch" onSubmit={(event) => this.handleSubmit(event)}>
                    <label htmlFor='search-bar'></label>
                    <br/>
                {/* <nav className='DashNav'> */}
                    <input
                        name='searchTerm'
                        type='text'
                        htmlFor='search-bar'
                        onChange={this.handleChange}
                        value={this.state.searchTerm}
                        placeholder='Search: anime, friends or lists'
                        required />                    
                    <br/>
                    <select name='searchOption' onChange={this.handleChange} required>
                        <option value=''>--Choose one--</option>
                        <option value='animes'>Animes</option>
                        <option value='users'>Users</option>
                        <option value='lists'>Lists</option>
                    </select>
                    <br/>
                    <button
                    className='search'
                     type='submit'>
                         <i class="fas fa-search"></i>
                         {/* Search! */}
                         </button>
                {/* </nav> */}
                </form>
            </div>
        )
    }
}

export default withRouter(SearchBar);
