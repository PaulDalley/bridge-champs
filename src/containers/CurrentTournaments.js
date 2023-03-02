import React, {Component} from 'react';
import {connect} from 'react-redux';
import Add from './Add';
import './CurrentTournaments.css';
import TournamentListItem from '../components/Articles/TournamentListItem';
import { getTournamentArticles, setCurrentTournament } from '../store/actions/articlesActions';
import PlayHand from '../components/BridgeBoard/play/PlayHand';

class CurrentTournaments extends Component {
    // title: this.state.title,
    // category: this.state.category,
    // difficulty: this.state.difficulty,
    // teaser: this.state.teaser,
    // createdAt: ...
    state = {
        tournamentArticles: undefined,
    };

    componentDidMount() {
        // this.props.fetchTournaments();
        this.props.getTournamentArticles();
    };

    goToSpecificArticles = (e, tournamentName) => {
        e.preventDefault();
        // console.log(tournamentName);
        let route = tournamentName.split(" ").join("_");
        this.props.history.push(`/tournament/${route}`);
    }


    render() {
        // console.log(this.props.tournaments);
        // let tournamentNames =
        let tournamentsJSX = [];
        if (this.props.tournaments) {
            // console.log("SHOULD BE IN HERE");
            // console.log(this.props.tournaments)
            Object.keys(this.props.tournaments).forEach((key, idx) => {
                let currentTournament = this.props.tournaments[key];
                // console.log(currentTournament);
                // console.log(key);
                tournamentsJSX.push(
                <TournamentListItem
                            // articles={fakeDataRight}
                            tournamentLogo={currentTournament[0].tournamentLogo}
                            key={key}
                            tournamentName={key}
                            clickHandler={ this.goToSpecificArticles }
                            tournamentStartDate={currentTournament[0].tournamentStartDate}
                            tournamentEndDate={currentTournament[0].tournamentEndDate}
                     />
                 );
             });
        }

        // let TournamentsJSX = this.props.articles.map((article, idx) => (
        //     <TournamentListItem
        //
        //     />
        // ));

        // console.log(articleJSX.length);
        // console.log(tournamentsJSX);
        const isMobileSize = window.innerWidth <= 672;
        let tournamentsJSXLeft;
        let tournamentsJSXRight;
        // let len;
        if (tournamentsJSX && !isMobileSize) {
            // len = tournamentsJSX.length / 2
            tournamentsJSXLeft = tournamentsJSX.filter((article, idx) => idx % 2 === 0);
            tournamentsJSXRight = tournamentsJSX.filter((article, idx) => idx % 2 !== 0);
        }

        // console.log(window.innerWidth);
        // console.log(isMobileSize);

        // let tournamentsJSXLeft = tournamentsJSX.filter((article, idx) => idx < len);
        // let tournamentsJSXRight = tournamentsJSX.filter((article, idx) => idx >= len);
        // console.log(tournamentsJSXLeft);
        // console.log(tournamentsJSXRight);
        return (
            <div className="Articles-outer_div" style={{paddingTop: '0rem'}}>

                <Add goto="create/tournament" history={this.props.history}/>
                {!isMobileSize &&
                <div className="Articles-container Tournaments-container">
                    <div className="Articles-container-left">
                        {tournamentsJSXLeft}
                    </div>
                    <div className="Articles-container-right">
                        {tournamentsJSXRight}
                    </div>
                </div>
                }
                {isMobileSize &&
                <div className="Articles-container">
                    { tournamentsJSX }
                </div>
                }

                {/*<br />*/}
                <br />
                {/*<PlayHand hand="*S-AK1073*H-1043*D-KQ42*C-9"/>*/}
            </div>
        );
    }
}

export default connect(
    ({ articles }) => ({ tournaments: articles.tournamentArticles }),
    { getTournamentArticles, setCurrentTournament })(CurrentTournaments);