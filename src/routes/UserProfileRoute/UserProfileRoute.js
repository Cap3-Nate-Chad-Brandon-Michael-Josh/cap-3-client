// user dashboard container
import Header from '../../components/Header/Header'
import DashNav from '../../components/DashNav/DashNav'
// import Modal from '../../components/DashNav/Modal'
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './UserProfileRoute.css';
import OtakuApiService from '../../services/otakuApiService';

class UserProfileRoute extends Component {
    state = {
        error: null,
        userLists: [],
        userAnimeItems: [],
        expanded: false,
        viewing: false,
    }

    async componentDidMount() {
        let id = this.props.match.params.id;
        console.log(id);
        await OtakuApiService.getSpecifiedUserLists(id)
            .then(res => this.setState({ userLists: res }))
    }

    handleViewListClick = (event, listId) => {
        event.preventDefault();
        this.props.history.push(`/SearchedList/${listId}`);
    }  

    render() {
        return (
            <section className='userProfileRoute'>
                <Header />
                <DashNav />
                {/* <Modal /> */}
                <Link to={'/home'}>
                    Home
                </Link>
                <p>this is User Profile Route</p>
                {this.state.userLists && this.state.userLists.map(list => {
                    return (
                        <section>
                            <h2>{list.name}</h2>
                            <button onClick={event => this.handleViewListClick(event, list.list_id)}>
                                View {list.name}
                            </button>
                            
                        </section>
                    )
                })}
            </section>
        )
    }
}

export default UserProfileRoute;