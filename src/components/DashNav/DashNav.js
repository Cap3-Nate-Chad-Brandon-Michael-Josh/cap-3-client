import React, { Component } from 'react';
import OtakuContext from '../../contexts/OtakuContext';
import Suggestions from '../Suggestions/Suggestions';
import Modal from './Modal';
import './DashNav.css';
import OtakuApiService from '../../services/otakuApiService';
import Rating from '../Rating/Rating';
import Comments from '../Comments/Comments';
import Roulette from '../Roulette/Roulette';
import EditListForm from '../EditListForm/EditListForm';

class DashNav extends Component {
    static contextType = OtakuContext;
    state = {
        Nav: false,
        className: "sidenav",
        classNameHidden: "sidenav2",
        registration: this.context.registration,
        newListInput: '',
        privateOption: true,
        currentList: this.context.currentList,
        randomAnimeIndex: null,
        editing: false,
    }

    async componentDidMount() {
        await OtakuApiService.getLoggedInUserLists()
            .then(res => this.context.setLoggedInUserLists(res))
        this.context.setCurrentList({})
    }

    handleItemDelete = () => {        
        this.setState({ currentList: this.context.currentList });        
    }

    handleFilterClick = () => {
        this.setState({ Nav: !this.state.Nav })
    }

    handleListClick = (event) => {
        const listId = event.target.getAttribute('value');
        OtakuApiService.getListInfo(listId)
            .then(res => {
                this.context.setCurrentList(res);
                this.setState({ currentList: this.context.currentList })
            });
    }

    handleAddNewList = (event) => {
        // select option values are always converted to strings, OR API is expecting boolean.
        event.preventDefault()
        let privacyValue = true;         
        if (this.state.privateOption === 'false') {
            privacyValue = false;
        }
        OtakuApiService.postList(this.state.newListInput, privacyValue)
        OtakuApiService.getLoggedInUserLists()
            .then(res => this.context.setLoggedInUserLists(res));    
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value})
    } 

    setRandomAnime = (num) => {
        this.setState({randomAnimeIndex:num})
    }

    
    handleEditListClick = (event) => {
        event.preventDefault()
        this.setState({ editing: !this.state.editing })
    }

    handleShuffle = () => {
        this.forceUpdate();
    }

    handleResetRandomAnime = () => {
        this.setState({randomAnimeIndex: null})
        
    }
    handleAddSuggestionsList = (anime) => {
        console.log('handleAddSuggestionsList');
        OtakuApiService.postList('My First Anime List', false, anime)
        OtakuApiService.getLoggedInUserLists()
            .then(res => this.context.setLoggedInUserLists(res));    
        this.context.setRegistration()
    }

    render() {
        return (
            <div>
                {this.context.registration &&
                    <Suggestions addSuggestionsList={this.handleAddSuggestionsList}/>
                }
                <div id="mySidenav" className={(this.state.Nav) ? this.state.className : this.state.classNameHidden}>
                    <h1>Your lists</h1>
                    {(this.context.loggedInUserLists &&
                        this.context.loggedInUserLists.map((list, index) => {
                            return <h3 key={index} value={list.list_id} onClick={this.handleListClick}>{list.name}</h3>
                        })
                    )}
                    <form 
                        htmlFor='Add a new list'
                        onSubmit={(event) => this.handleAddNewList(event)}>
                        <input 
                            placeholder='New List'
                            name='newListInput'
                            htmlFor='New list name'
                            onChange={this.handleChange}
                            value={this.state.newListInput}
                            required />
                        <br/>
                        <select 
                            name='privateOption' 
                            onChange={this.handleChange} 
                            required>
                            <option>--Select One--</option>
                            <option value={false}>Public</option>
                            <option value={true}>Private</option>
                        </select>
                        <br/>
                        <button type='submit'>add</button>
                    </form>
                </div>
                <button className="navB" onClick={this.handleFilterClick}>
                    &#9776; Anime Lists
                </button>
                {(this.context.currentList.name) ? 
                    <div>
                        <h1>{this.context.currentList.name}</h1>
                        {(this.state.editing) ? 
                            <EditListForm editing={this.handleEditListClick}/>
                            : null }
                        <button onClick={this.handleEditListClick}>Edit List</button>
                    </div> 
                    : null}

                <section className='animeItem'>
                    {(this.context.currentList.anime) ? this.context.currentList.anime.map((anime, index) => {
                        let expanded = false 
                        if(index === this.state.randomAnimeIndex){
                            expanded = true
                        }
                        
                       return <Modal key={index} handleItemDelete={this.handleItemDelete} anime={anime} show={expanded} index={index} handleResetRandomAnime={this.handleResetRandomAnime} />
                    })
                        : null
                    }
                </section>
                {(this.context.currentList) ?
                    <div>
                        <Rating currentList={this.context.currentList} />
                        <Comments currentList={this.context.currentList} />
                    </div>
                    : null}
                            {/* <img src={require("./1.png")} alt="" id="img" /> */}

                    <Roulette 
                        list={this.state.currentList.anime}
                        updateExpandedItem={this.setRandomAnime}
                        handleShuffle={this.handleShuffle}
                    />
        
            </div>

        )
    }
}

export default DashNav;

{/* <section className='animeItem'>
                    {(this.state.currentList.anime) ? this.state.currentList.anime.map(anime =>
                        <div>
                            <Modal handleItemDelete={this.handleItemDelete} anime={anime} />
                        </div>)
                        : null
                    }
                </section> */}