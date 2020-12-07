import React, { Component } from "react";
import OtakuContext from "../../contexts/OtakuContext";
import OtakuApiService from "../../services/otakuApiService";

class RatingForm extends Component {
    static contextType = OtakuContext;
    constructor(props) {
        super(props);
        this.state = {
            rating: null,
            list_id: this.props.list_id,
            error: null,
        };
        this.setRating = this.setRating.bind(this);
    }

    //   componentDidMount() {
    //     const rating = this.props.user_rating;
    //     const list_id = this.props.list_id;
    //     const item = {
    //       rating,
    //       list_id,
    //     };

    //     this.setState({ item: item });
    //   }

    handleSubmit = async (ev) => {
        ev.preventDefault();
        const newRating = this.state.rating;
        const list_id = this.props.list_id;
        if (newRating && list_id) {
            console.log(list_id)
            await OtakuApiService.postRating(newRating, list_id)
                .then((res) => {
                    this.context.resetRating(res);
                })
                .catch((error) => {
                    this.setState(error);
                });
        }
    };

    setRating(ev) {
        const value = ev.target.getAttribute("value");
        this.setState({ rating: value });
    }

    renderRating() {
        let acc;
        if (!this.state.rating){
            acc = Math.round(this.props.user_rating);
        } else {
            acc = Math.round(this.state.rating);
        }
        let res = [];
        console.log(this.props.user_rating)
        console.log(this.state.rating)
        if (!acc || isNaN(acc)) {
            acc = 0;
        }
        for (let i = 0; i < 5; i++) {
            if (acc === 0) {
                res.push(
                    <i
                        onClick={this.setRating}
                        key={i}
                        value={i + 1}
                        name={`star${i + 1}`}
                        className="far fa-star"
                    ></i>
                );
            } else {
                res.push(
                    <i
                        onClick={this.setRating}
                        key={i}
                        value={i + 1}
                        name={`star${i + 1}`}
                        className="fas fa-star"
                    ></i>
                );
                acc--;
            }
        }
        return res;
    }

    starRatingInput() {
        return (
            <div>
                <p>Your Rating:</p>
                {this.renderRating()}
            </div>
        );
    }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="ratingForm">
        {this.starRatingInput()}
        <label htmlFor="ratingSubmit"></label>
        <button className="submit" type="submit" name="ratingSubmit">
          Submit
        </button>
            </form>
        );
    }
}

export default RatingForm;
